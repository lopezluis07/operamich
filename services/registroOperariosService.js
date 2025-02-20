const sequelize = require("../config/db");
const { Op } = require("sequelize");
const RegistroOperario = require("../models/registrosOperariosModels");
const Usuario = require("../models/usuariosModels");

/**
 * Valida si hay superposición de horarios para un usuario.
 * @param {number} usuario_id 
 * @param {string} fecha 
 * @param {string} hora_inicio 
 * @param {string} hora_fin 
 * @param {number|null} registroId 
 * @returns {Promise<Array>} Lista de conflictos detectados.
 */
const verificarSuperposicionHorarios = async (usuario_id, fecha, hora_inicio, hora_fin, registroId = null) => {
 
  // Convertir fecha a un objeto Date para asegurar formato correcto
  const fechaProcesada = typeof fecha === "string" ? new Date(fecha) : fecha;

  if (isNaN(fechaProcesada.getTime())) {
    throw new Error("La fecha proporcionada no es válida.");
  }


  const whereClause = {
    usuario_id,
    [Op.and]: [
      sequelize.where(sequelize.fn("DATE", sequelize.col("fecha")),
       "=", 
       fechaProcesada.toISOString().split("T")[0]
      ),
      {
        [Op.or]: [
          {
            hora_inicio: { [Op.lt]: hora_fin },
            hora_fin: { [Op.gt]: hora_inicio },
          },
          {
            hora_inicio: { [Op.lte]: hora_inicio },
            hora_fin: { [Op.gte]: hora_fin },
          },
        ],
      },
    ],
  };

  if (registroId) {
    whereClause.id = { [Op.ne]: registroId };
  }

  const registrosSuperpuestos = await RegistroOperario.findAll({
    where: whereClause,
    include: [{ model: Usuario, as: "Usuario", attributes: ["id", "nombre", "apellido"] }],
  });

   return registrosSuperpuestos.map((registro) => {
    const fechaFormateada =
      registro.fecha instanceof Date
        ? registro.fecha.toISOString().split("T")[0]
        : registro.fecha;

    return {
      id: registro.id,
      nombreCompleto: `${registro.Usuario.nombre} ${registro.Usuario.apellido}`,
      horaInicio: registro.hora_inicio,
      horaFin: registro.hora_fin,
      fecha: fechaFormateada,
    };
  });
};

/**
 * Llama al procedimiento almacenado para verificar si el descuento ya fue aplicado.
 * @param {number} usuario_id 
 * @param {string} fecha 
 * @returns {Promise<boolean>} Retorna true si el descuento ya fue aplicado.
 */
const verificarDescuentoDuchaSP = async (usuario_id, fecha) => {
  try {
    await sequelize.query(
      "CALL verificarDescuentoDucha(:usuario_id, :fecha, @descuento_aplicado);",
      { replacements: { usuario_id, fecha }, type: sequelize.QueryTypes.RAW }
    );

    const result = await sequelize.query("SELECT @descuento_aplicado AS descuento_aplicado;", {
      type: sequelize.QueryTypes.SELECT,
    });

    if (!result || result.length === 0) return false;
    return result[0].descuento_aplicado === 1;
  } catch (error) {
    console.error("Error al verificar el descuento de ducha:", error);
    throw new Error("Error al verificar descuento de ducha");
  }
};

module.exports = {
  verificarSuperposicionHorarios,
  verificarDescuentoDuchaSP,
};
