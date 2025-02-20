const { sequelize } = require("../models");

exports.getDashboardData = async (req, res) => {
    try {
        // Array con los nombres de los meses
        const monthNames = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        // Consulta a la base de datos
        const datos = await sequelize.query(
            `SELECT 
                MONTH(ro.fecha) AS mes,
                ap.nombre AS actividad_nombre,
                SUM(ro.horas_labor) AS jornales,
                COUNT(DISTINCT CONCAT(ro.fecha, '-', ro.usuario_id)) AS dias,
                SUM(ro.cantidad_litros_aplicados) AS total_litros, -- Litros aplicados
                SUM(ro.cantidad_arboles_aplicados) AS total_arboles, -- Árboles aplicados
                SUM(ro.cantidad_arboles_fertilizados) AS total_fertilizados, -- Árboles fertilizados
                SUM(ro.cantidad_kilos_aplicados) AS total_kilos, -- Kilos aplicados
                SUM(ro.horas_lluvia) AS horas_lluvia
            FROM registros_operarios ro
            JOIN actividades_principales ap ON ro.actividad_id = ap.id
            GROUP BY mes, actividad_nombre`,
            { type: sequelize.QueryTypes.SELECT }
        );

        // Transformar el número del mes en nombre
        const datosTransformados = datos.map(item => ({
            ...item,
            mes: monthNames[item.mes - 1], // Convertir número del mes a nombre
        }));

        // Enviar la respuesta
        res.json(datosTransformados);
    } catch (error) {
        console.error("Error al obtener datos del Dashboard:", error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};
