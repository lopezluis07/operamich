const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const roleAuth = require('../middlewares/roleAuth');
const usuariosController = require('../controllers/usuariosController');
const router = express.Router();

// Rutas para el CRUD de los usuarios

// Ruta para obtener todos los usuarios (accesible para Admin y Supervisor)
router.get('/', auth, roleAuth(['Admin', 'Supervisor']), usuariosController.getUsuarios);

// Ruta para crear un nuevo usuario (accesible solo para Admin)
router.post(
    '/',
    auth,
    roleAuth('Admin'),
    [
        body('nombre').not().isEmpty().withMessage('El nombre es obligatorio'),
        body('apellido').not().isEmpty().withMessage('El apellido es obligatorio'),
        body('cedula').not().isEmpty().withMessage('La cédula es obligatoria'),
        body('rol')
            .not()
            .isEmpty()
            .withMessage('El rol es obligatorio')
            .isIn(['Admin', 'Supervisor', 'Operario', 'Conductor', 'Mantenimiento'])
            .withMessage('El rol proporcionado no es válido'),
        body('usuario')
            .if((value, { req }) => req.body.rol === 'Admin' || req.body.rol === 'Supervisor')
            .not()
            .isEmpty()
            .withMessage('El usuario es obligatorio')
            .isAlphanumeric()
            .withMessage('El usuario debe ser alfanumérico')
            .isLength({ min: 6 })
            .withMessage('El usuario debe tener al menos 6 caracteres'),
        body('password')
            .if((value, { req }) => req.body.rol === 'Admin' || req.body.rol === 'Supervisor')
            .not()
            .isEmpty()
            .withMessage('La contraseña es obligatoria')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    usuariosController.createUsuario
);

// Ruta para obtener un usuario por ID (accesible para Admin y Supervisor)
router.get('/:id', auth, roleAuth(['Admin', 'Supervisor']), usuariosController.getUsuarioById);

// Ruta para actualizar un usuario (solo acceso para el Admin)
router.put(
    '/:id',
    auth,
    roleAuth('Admin'),
    [
        body('nombre').not().isEmpty().withMessage('El nombre es obligatorio'),
        body('apellido').not().isEmpty().withMessage('El apellido es obligatorio'),
        body('cedula').not().isEmpty().withMessage('La cédula es obligatoria'),
        body('usuario')
            .if((value, { req }) => req.body.rol !== 'Operario') // Solo validar usuario para ciertos roles
            .isAlphanumeric()
            .withMessage('El usuario debe ser alfanumérico')
            .isLength({ min: 6 })
            .withMessage('El usuario debe tener al menos 6 caracteres'),
        body('password')
            .if((value, { req }) => req.body.rol !== 'Operario') // Solo validar contraseña para ciertos roles
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    usuariosController.updateUsuario
);

// Ruta para eliminar un usuario (solo para el Admin)
router.delete('/:id', auth, roleAuth('Admin'), usuariosController.deleteUsuario);

// Rutas específicas para Conductores
router.get('/perfil', auth, roleAuth(['Conductor']), usuariosController.getPerfilConductor);

// Rutas específicas para Mantenimiento
router.get('/actividades', auth, roleAuth(['Mantenimiento']), usuariosController.getActividadesMantenimiento);

module.exports = router;
