const Seccion = require('../models/seccionModels');

exports.getSecciones = async (req, res) => {
    try {
        const secciones = await Seccion.findAll();
        res.json(secciones);
    } catch (error) {
        console.error('Error al obtener secciones:', error);
        res.status(500).json({ message: 'Error al obtener las secciones' });
    }
};
