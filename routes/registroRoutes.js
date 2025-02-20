const express = require("express");
const { calcularHorasLabor } = require("../utils/calculos");
const router = express.Router();

router.post("/calcular-horas-labor", (req, res) => {
  console.log("Datos recibidos en /calcular-horas-labor:", req.body);

  const {
    hora_inicio,
    hora_fin,
    descuentoManana,
    descuentoTarde,
    horas_lluvia,
    horas_traslado,
    horas_recoleccion,
    actividad_id,
  } = req.body;

  // Validar campos obligatorios
  if (!hora_inicio || !hora_fin || actividad_id === undefined) {
    return res.status(400).json({
      error: "Los campos hora_inicio, hora_fin y actividad_id son obligatorios.",
    });
  }

  try {

    const horasLluvia = parseFloat(horas_lluvia) || 0;
    const horasTraslado = parseFloat(horas_traslado) || 0;
    const horasRecoleccion = parseFloat(horas_recoleccion) || 0;


    console.log("valores procesados:", {
      hora_inicio,
      hora_fin,
      horasLluvia,
      horasTraslado,
      horasRecoleccion,
      actividad_id,
      descuentoManana,
      descuentoTarde,
    });



    const horasLabor = calcularHorasLabor(
      hora_inicio,
      hora_fin,
      horasLluvia || 0,
      horasTraslado || 0,
      horasRecoleccion || 0,
      actividad_id || null,
      descuentoManana,
      descuentoTarde
    );


    console.log("Horas labor calculadas:", horasLabor);
    res.status(200).json({ horas_labor: horasLabor });
  } catch (error) {
    console.error("Error al calcular las horas laborables:", error.message || error);
    res.status(500).json({
      error: "Error al calcular las horas laborables. Verifique los datos enviados.",
      detalles: error.message || error,
    });
  }
});


module.exports = router; // Asegúrate de que estás exportando el `router`
