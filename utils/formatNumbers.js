/**
 * Convierte minutos en decimales para horas.
 * Ejemplo: 10 minutos -> 0.17
 */
const convertMinutesToDecimal = (minutes) => {
    if (!minutes || isNaN(minutes)) return 0; // Maneja valores nulos o indefinidos
    // Verificar si el valor es un entero
    if (Number.isInteger(minutes)) {
        return parseFloat((minutes / 60).toFixed(2)); // Divide minutos por 60 y redondea a 2 decimales
    }
    return parseFloat(minutes); // Si ya es decimal, devolver como está
};

/**
 * Convierte decimales de horas a minutos.
 * Ejemplo: 0.17 -> 10 minutos
 */
const convertDecimalToMinutes = (decimal) => {
    if (!decimal || isNaN(decimal)) return 0; // Maneja valores nulos o indefinidos
    // Asegurarse de que el valor decimal esté dentro de un rango razonable
    if (decimal >= 0 && decimal <= 24) { // 24 horas como máximo
        return Math.round(decimal * 60); // Multiplica el decimal por 60 para obtener minutos
    }
    return 0; // Valor no válido
};

module.exports = {
    convertMinutesToDecimal,
    convertDecimalToMinutes,
};
