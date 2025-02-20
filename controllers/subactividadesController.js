const Subactividad = require('../models/subactividadModels');


// Obtener subactividades por ID de actividad
const getSubactividadesPorActividad = async (req, res) => {
    try {
        const { actividadId } = req.params;
        const subactividades = await Subactividad.findAll({
            where: { actividad_id: actividadId },
        });

        res.status(200).json(subactividades);
    } catch (error) {
        console.error('Error al obtener subactividades por actividad:', error);
        res.status(500).json({ error: 'Error al obtener subactividades' });
    }
};


module.exports = { getSubactividadesPorActividad };
