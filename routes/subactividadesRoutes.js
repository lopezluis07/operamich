const express = require('express');
const router = express.Router();
const { getSubactividadesPorActividad } = require('../controllers/subactividadesController');


// Ruta para obtener subactividades filtradas por actividad
router.get('/actividad/:actividadId', getSubactividadesPorActividad);


module.exports = router;
