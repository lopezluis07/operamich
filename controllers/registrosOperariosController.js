const { Op } = require("sequelize");
const sequelize = require("../config/db");
const RegistroOperario = require("../models/registrosOperariosModels");
const Lote = require("../models/loteModels");
const Subactividad = require("../models/subactividadModels");
const Usuario = require("../models/usuariosModels");
const Actividad = require("../models/actividadModels");
const Seccion = require("../models/seccionModels");
const { calcularHorasLabor } = require("../utils/calculos");
const { convertMinutesToDecimal, convertDecimalToMinutes, } = require("../utils/formatNumbers");
const { verificarSuperposicionHorarios, verificarDescuentoDuchaSP } = require("../services/registroOperariosService");


// Obtener todos los registros de operarios asociados al supervisor autenticado
exports.getRegistros = async (req, res, next) => {
  try {
    const { id: supervisor_id, role } = req.user;
    const whereClause = role === "Admin" ? {} : { supervisor_id };

    const registros = await RegistroOperario.findAll({
      where: whereClause,
      include: [
        {
          model: Usuario,
          as: "Supervisor",
          attributes: ["nombre", "apellido"],
        },
        {
          model: Usuario,
          as: "Usuario",
          attributes: ["id", "nombre", "apellido", "cedula", "rol"],
        },
        { model: Actividad, attributes: ["id", "nombre"] },
        { model: Seccion, attributes: ["id", "nombre"] },
        {
          model: Lote,
          as: "Lotes",
          through: { attributes: [] },
          attributes: ["id", "nombre"],
        },
        {
          model: Subactividad,
          as: "Subactividades",
          through: { attributes: [] },
          attributes: ["id", "nombre"],
        },
      ],
      attributes: [
        "id",
        "fecha",
        "hora_inicio",
        "hora_fin",
        "horas_labor",
        "horas_lluvia",
        "horas_traslado",
        "horas_recoleccion",
        "observaciones",
        "cantidad_arboles_aplicados",
        "cantidad_litros_aplicados",
        "cantidad_arboles_fertilizados",
        "cantidad_kilos_aplicados",
        "rendimiento",
        "unidad_medida",
        "descuentoManana",
        "descuentoTarde",
      ],
    });

    // Convertir decimales a minutos antes de enviarlos al frontend
    const registrosConvertidos = registros.map((registro) => ({
      ...registro.toJSON(),
      horas_lluvia: convertDecimalToMinutes(registro.horas_lluvia),
      horas_traslado: convertDecimalToMinutes(registro.horas_traslado),
      horas_recoleccion: convertDecimalToMinutes(registro.horas_recoleccion),
    }));

    res.status(200).json(registros);
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    next(error);
  }
};



exports.createRegistro = async (req, res, next) => {
  const {
    usuario_ids,
    fecha,
    actividad_id,
    subactividades_id,
    seccion_id,
    lote_ids,
    hora_inicio,
    hora_fin,
    horas_lluvia,
    horas_traslado,
    horas_recoleccion,
    observaciones,
    arboles_por_operario,
    cantidad_litros_aplicados,
    cantidad_arboles_fertilizados,
    cantidad_kilos_aplicados,
    rendimiento,
    unidad_medida,
    descuentoManana,
    descuentoTarde,
  } = req.body;

  console.log("Datos recibidos en el backend:", req.body);

  const supervisor_id = req.user.id;

  if (!usuario_ids || !fecha || !actividad_id) {
    return res
      .status(400)
      .json({ error: "usuario_ids, fecha y actividad_id son obligatorios" });
  }

  try {
    const registros = [];
    const conflictos = [];

    await sequelize.transaction(async (t) => {
      for (const usuario_id of usuario_ids) {





        const operarioData = arboles_por_operario.find(
          (operario) => parseInt(operario.operarioId) === parseInt(usuario_id)
        );

        if (!operarioData) {
          return res.status(400).json({
            error: `No se encontró información de arboles_por_operario para el usuario_id: ${usuario_id}.`,
          });
        }

        const { cantidad_arboles_aplicados } = operarioData;


        const fertilizacionOperario = req.body.arboles_por_operario.find(
          (item) => item.operarioId === usuario_id
        );
    
        const cantidadFertilizados =
          fertilizacionOperario?.cantidad_arboles_fertilizados || 0;






        // Validar superposición de horarios
        const superposiciones = await verificarSuperposicionHorarios(
          usuario_id,
          fecha,
          hora_inicio,
          hora_fin
        );

        if (superposiciones.length > 0) {
          superposiciones.forEach(({ nombreCompleto, horaInicio, horaFin, fecha }) => {
            conflictos.push(
              `El horario ingresado (${hora_inicio} - ${hora_fin}) para el usuario ${nombreCompleto} ya está en conflicto con otro registro existente (${horaInicio} - ${horaFin}) en la fecha ${fecha}.`
            );
          });
          continue;
        }

        // Verificar si el descuento ya fue aplicado
        const yaAplicado = await verificarDescuentoDuchaSP(usuario_id, fecha);

        // Cálculo de horas laborables con descuento si corresponde
        const horasLaborCalculadas = calcularHorasLabor(
          hora_inicio,
          hora_fin,
          horas_lluvia,
          horas_traslado,
          horas_recoleccion,
          actividad_id,
          descuentoManana,
          descuentoTarde,
          yaAplicado // Aplicar el descuento de ducha solo si corresponde
        );

        // Crear el registro
        const nuevoRegistro = await RegistroOperario.create(
          {
            usuario_id,
            fecha,
            actividad_id,
            seccion_id,
            hora_inicio,
            hora_fin,
            horas_labor: horasLaborCalculadas,
            horas_lluvia,
            horas_traslado,
            horas_recoleccion,
            observaciones,
            cantidad_arboles_aplicados,
            cantidad_litros_aplicados,
            cantidad_arboles_fertilizados: cantidadFertilizados,
            cantidad_kilos_aplicados,
            rendimiento,
            unidad_medida,
            supervisor_id,
            descuento_ducha: !yaAplicado, // Marca si el descuento no estaba aplicado
            descuentoManana,
            descuentoTarde,
          },
          { transaction: t }
        );

        // Asociar subactividades si existen
        if (subactividades_id && subactividades_id.length > 0) {
          await nuevoRegistro.addSubactividades(subactividades_id, { transaction: t });
        }

        // Asociar lotes si existen
        if (lote_ids && lote_ids.length > 0) {
          await nuevoRegistro.addLotes(lote_ids, { transaction: t });
        }

        registros.push(nuevoRegistro);
      }

      if (conflictos.length > 0) {
        // Enviar un error claro al cliente con todos los conflictos
        throw new Error(conflictos.join("\n"));
      }
    });

    res.status(201).json({
      message: "Registros creados correctamente",
      registros,
    });
  } catch (error) {
    console.error("Error al crear el registro:", error);
    // Enviar los conflictos o errores al cliente
    res.status(500).json({
      error: "Error al crear el registro.",
      detalles: error.message || error,
    });
  }
};



// Obtener un registro por ID (verificar que el supervisor_id coincida)
exports.getRegistroById = async (req, res, next) => {
  const { id } = req.params;
  const supervisor_id = req.user.id;

  try {
    const registro = await RegistroOperario.findOne({
      where: { id, supervisor_id },
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "apellido", "cedula", "rol"],
        },
        { model: Actividad, attributes: ["id", "nombre"] },
        { model: Seccion, attributes: ["id", "nombre"] },
        {
          model: Lote,
          through: { attributes: [] },
          attributes: ["id", "nombre"],
        },
        {
          model: Subactividad,
          through: { attributes: [] },
          as: "subactividades",
          attributes: ["id", "nombre"],
        },
      ],
      attributes: [
        "id",
        "fecha",
        "hora_inicio",
        "hora_fin",
        "horas_labor",
        "horas_lluvia",
        "horas_traslado",
        "horas_recoleccion",
        "observaciones",
        "cantidad_arboles_aplicados",
        "cantidad_litros_aplicados",
        "cantidad_arboles_fertilizados",
        "cantidad_kilos_aplicados",
        "rendimiento",
        "unidad_medida",
        "descuentoManana",
        "descuentoTarde",
      ],
    });
    console.log("Registro recuperado:", registro);

    if (!registro)
      return res
        .status(404)
        .json({ error: "Registro no encontrado o no autorizado" });
    res.status(200).json(registro);
  } catch (error) {
    console.error("Error al obtener el registro por ID:", error);
    next(error);
  }
};

const axios = require("axios");


// Actualizar un registro existente (solo si coincide el supervisor_id)
exports.updateRegistro = async (req, res, next) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  const {
    usuario_ids,
    fecha,
    actividad_id,
    subactividades_id,
    seccion_id,
    lote_ids,
    hora_inicio,
    hora_fin,
    horas_lluvia,
    horas_traslado,
    horas_recoleccion,
    observaciones,
    cantidad_arboles_aplicados,
    cantidad_litros_aplicados,
    cantidad_arboles_fertilizados,
    cantidad_kilos_aplicados,
    rendimiento,
    unidad_medida,
    descuentoManana,
    descuentoTarde,
  } = req.body;

  console.log("Datos recibidos en el backend:", req.body);

  // Validar campos obligatorios
  if (!usuario_ids || usuario_ids.length === 0 || !fecha || !actividad_id) {
    return res
      .status(400)
      .json({ error: "usuario_ids, fecha y actividad_id son obligatorios" });
  }

  const usuario_id = Array.isArray(usuario_ids) ? usuario_ids[0] : usuario_ids;

  try {
    // 1. Verificar los valores que se enviarán al endpoint de cálculo
    console.log("Datos enviados para calcular horas laborables:");
    console.log({
      hora_inicio,
      hora_fin,
      horas_lluvia: parseFloat(horas_lluvia) || 0,
      horas_traslado: parseFloat(horas_traslado) || 0,
      horas_recoleccion: parseFloat(horas_recoleccion) || 0,
      actividad_id,
      descuentoManana,
      descuentoTarde,
    });

    // 2. Llamar al endpoint para calcular las horas laborables
    const response = await axios.post(`${process.env.BASE_URL}/api/calcular-horas-labor`, {
      hora_inicio,
      hora_fin,
      horas_lluvia,
      horas_traslado,
      horas_recoleccion,
      actividad_id,
      descuentoManana,
      descuentoTarde,
    });

    // 3. Validar respuesta del endpoint
    console.log("Respuesta del cálculo de horas laborables:", response.data);

    const horasLaborCalculadas = response.data.horas_labor;

    // 4. Confirmar los valores calculados
    console.log("Horas laborables calculadas:", horasLaborCalculadas);

    // Convertir horas a decimales
    const horasLluviaDecimal = convertMinutesToDecimal(horas_lluvia);
    const horasTrasladoDecimal = convertMinutesToDecimal(horas_traslado);
    const horasRecoleccionDecimal = convertMinutesToDecimal(horas_recoleccion);


    console.log("Horas en formato decimal antes de actualizar:");
    console.log({ horasLluviaDecimal, horasTrasladoDecimal, horasRecoleccionDecimal });

    // 5. Verificar que el registro existe
    const whereClause = role === "Admin" ? { id } : { id, supervisor_id: userId };
    const registro = await RegistroOperario.findOne({ where: whereClause });

    if (!registro) {
      console.error("Registro no encontrado o no autorizado.");
      return res
        .status(404)
        .json({ error: "Registro no encontrado o no autorizado" });
    }

    // 6. Actualizar los datos

    console.log("Datos enviados para calcular horas laborables:");
    await registro.update({
      usuario_id,
      fecha,
      actividad_id,
      seccion_id,
      hora_inicio,
      hora_fin,
      horas_labor: horasLaborCalculadas, // Usar las horas calculadas
      horas_lluvia: horasLluviaDecimal,
      horas_traslado: horasTrasladoDecimal,
      horas_recoleccion: horasRecoleccionDecimal,
      observaciones,
      cantidad_arboles_aplicados,
      cantidad_litros_aplicados,
      cantidad_arboles_fertilizados,
      cantidad_kilos_aplicados,
      rendimiento,
      unidad_medida,
      descuentoManana,
      descuentoTarde,
    });

    // 7. Confirmar la actualización
    console.log("Registro actualizado correctamente:", registro.toJSON());

    // Actualizar relaciones
    if (subactividades_id) {
      await registro.setSubactividades(subactividades_id);
    }

    if (lote_ids) {
      await registro.setLotes(lote_ids);
    }

    const registroActualizado = await RegistroOperario.findOne({
      where: { id: registro.id },
      include: [
        {
          model: Subactividad,
          as: "Subactividades",
          attributes: ["id", "nombre"],
          through: { attributes: [] },
        },
        {
          model: Lote,
          as: "Lotes",
          attributes: ["id", "nombre"],
          through: { attributes: [] },
        },
      ],
    });


    return res.status(200).json({ message: "Registro actualizado correctamente" });
  } catch (error) {
    // 8. Manejo de errores con más información
    console.error("Error al actualizar el registro:", error.response?.data || error.message || error);

    return res.status(500).json({
      error: error.response?.data || "Error al actualizar el registro",
    });
  }
};








// Eliminar un registro (solo si coincide el supervisor_id)
exports.deleteRegistro = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId, role } = req.user; // Obtenemos el rol y el ID del usuario

  try {
    // Condición para el rol Admin (puede eliminar sin restricciones)
    const whereClause =
      role === "Admin" ? { id } : { id, supervisor_id: userId };

    const registro = await RegistroOperario.findOne({ where: whereClause });
    if (!registro)
      return res
        .status(404)
        .json({ error: "Registro no encontrado o no autorizado" });

    await registro.destroy();
    res.status(200).json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    next(error);
  }
};