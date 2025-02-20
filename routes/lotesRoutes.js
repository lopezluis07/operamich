const express = require('express');
const router = express.Router();
const Lote = require('../models/loteModels'); // Asegúrate de tener el modelo Lote correcto

// Ruta para obtener lotes por sección
router.get('/seccion/:seccionId', async (req, res) => {
    const { seccionId } = req.params;
    try {
        const lotes = await Lote.findAll({ where: { seccion_id: seccionId } });
        res.status(200).json(lotes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los lotes' });
    }
});

module.exports = router;
