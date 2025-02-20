const express = require('express');
const router = express.Router();
const actividadesController = require('../controllers/actividadesController');

// Rutas de actividades
router.get('/', actividadesController.getActividades);
router.post('/', actividadesController.createActividad);
router.put('/:id', actividadesController.updateActividad);
router.delete("/:id", actividadesController.deleteActividad);

module.exports = router;
  