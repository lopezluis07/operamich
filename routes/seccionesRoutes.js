const express = require('express');
const router = express.Router();
const seccionesController = require('../controllers/seccionesController');

router.get('/', seccionesController.getSecciones);

module.exports = router;
