const Lote = require('../models/loteModels');

// Traer lotes filtrados por sección
const getLotesBySeccion = async (req, res) => {
    const { seccionId } = req.params;
    try {
        const lotes = await Lote.findAll({ where: { Seccion_ID: seccionId } });
        if (lotes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron lotes para esta sección' });
        }
        res.status(200).json(lotes);
    } catch (error) {
        console.error("Error al obtener lotes por sección:", error);
        res.status(500).json({ message: 'Error al obtener los lotes' });
    }
};

module.exports = { getLotesBySeccion };
