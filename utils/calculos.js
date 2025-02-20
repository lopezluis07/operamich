const calcularHorasLabor = (horaInicio, horaFin, horasLluvia, horasTraslado, horasRecoleccion, actividad_id, descuentoManana, descuentoTarde, yaAplicado) => {
  // Definición de las actividades que requieren descuento de ducha (20 minutos o 0.33 horas)
  const actividadesConDucha = [1, 5, 7];

  // Convertir las horas de inicio y fin a minutos desde la medianoche
  const [horasInicio, minutoInicio] = horaInicio.split(":").map(Number);
  const [horaFinValor, minutoFin] = horaFin.split(":").map(Number);

  const inicio = horasInicio * 60 + minutoInicio;
  const fin = horaFinValor * 60 + minutoFin;

  // Calcular la duración total en horas del día
  let horasLabor = (fin - inicio) / 60;

  // Definición de los descansos en minutos del día
  const descansos = [
    { inicio: 8 * 60, fin: 8 * 60 + 30, duracion: 0.5 }, // Desayuno: 08:00 - 08:30
    { inicio: 12 * 60, fin: 12 * 60 + 30, duracion: 0.5 }, // Almuerzo: 12:00 - 12:30
    { inicio: 10 * 60, fin: 10 * 60 + 10, duracion: 10 / 60, tipo: "manana" }, // Pausa Activa Mañana: 10:00 - 10:10
    { inicio: 15 * 60, fin: 15 * 60 + 10, duracion: 10 / 60, tipo: "tarde" }, // Pausa Activa Tarde: 15:00 - 15:10
  ];

  // Aplicar descansos según los valores de los checkboxes
  descansos.forEach((descanso) => {
    const solapamientoInicio = Math.max(inicio, descanso.inicio);
    const solapamientoFin = Math.min(fin, descanso.fin);

    if (solapamientoInicio < solapamientoFin) {
      if (
        (descanso.tipo === "manana" && descuentoManana) || // Aplica descuento si es pausa de la mañana y está activado
        (descanso.tipo === "tarde" && descuentoTarde) || // Aplica descuento si es pausa de la tarde y está activado
        !descanso.tipo // Aplica siempre para desayuno y almuerzo
      ) {
        horasLabor -= descanso.duracion;
      }
    }
  });

  // Aplicar descuento de ducha si corresponde
  if (actividadesConDucha.includes(Number(actividad_id)) && !yaAplicado) {
    horasLabor -= 20 / 60; // Descuento de 20 minutos (0.33 horas)
  }

  // Función para convertir siempre los valores de minutos a horas
  const convertirAMinutos = (valor) => {
    return (parseFloat(valor) || 0) / 60;
  };

  // Restar horas adicionales (lluvia, traslado, recolección)
  horasLabor -= convertirAMinutos(horasLluvia);
  horasLabor -= convertirAMinutos(horasTraslado);
  horasLabor -= convertirAMinutos(horasRecoleccion);


  return Math.max(0, horasLabor).toFixed(2); // Asegurar que no sea negativo
  
};
module.exports = { calcularHorasLabor };
