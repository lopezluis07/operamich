// routes/registrosOperariosRoutes.js
const express = require('express');
const auth = require('../middlewares/auth');  
const roleAuth = require('../middlewares/roleAuth');  
const registrosOperariosController = require('../controllers/registrosOperariosController');
const router = express.Router();

// Rutas para registros de operarios

// Obtener todos los registros (para Admin y Supervisor)
router.get('/', auth, roleAuth(['Admin', 'Supervisor']), registrosOperariosController.getRegistros);

// Crear un nuevo registro de operario (para Admin y Supervisor)
router.post('/', auth, roleAuth(['Admin', 'Supervisor']), registrosOperariosController.createRegistro);

// Obtener un registro por ID (para Admin y Supervisor)
router.get('/:id', auth, roleAuth(['Admin', 'Supervisor']), registrosOperariosController.getRegistroById);

// Actualizar un registro de operario (solo Admin)
router.put('/:id', auth, roleAuth(['Admin', 'Supervisor']), registrosOperariosController.updateRegistro);

// Eliminar un registro de operario (solo Admin)
router.delete('/:id', auth, roleAuth(['Admin']), registrosOperariosController.deleteRegistro);



module.exports = router;
