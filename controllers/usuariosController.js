const bcrypt = require('bcrypt');
const Usuario = require('../models/usuariosModels');



// Obtener todos los usuarios (Admin y Supervisor)
exports.getUsuarios = async (req, res, next) => {
    try {
        const usuarios = await Usuario.findAll({
            where: { activo: true }, // Solo usuarios activos
        });
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};



// Crear un nuevo usuario (Admin)
exports.createUsuario = async (req, res, next) => {
    const { nombre, apellido, cedula, telefono, usuario, password, rol, fecha_ingreso } = req.body;

    try {
        // Validar que el rol sea válido
        const rolesValidos = ['Admin', 'Supervisor', 'Operario', 'Conductor', 'Mantenimiento'];
        if (!rolesValidos.includes(rol)) {
            return res.status(400).json({ message: 'El rol proporcionado no es válido' });
        }

        // Cifrar la contraseña si se proporciona
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const nuevoUsuario = await Usuario.create({
            nombre,
            apellido,
            cedula,
            telefono,
            usuario: usuario || null,
            password: hashedPassword, // Almacenar la contraseña cifrada
            rol,
            fecha_ingreso,
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        next(error);
    }
};

// Obtener un usuario por ID (Admin y Supervisor)
exports.getUsuarioById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        next(error);
    }
};

// Actualizar un usuario (Admin)
exports.updateUsuario = async (req, res, next) => {
    const { id } = req.params;
    const { nombre, apellido, cedula, telefono, usuario, rol, password, fecha_ingreso } = req.body;

    console.log(`Intentando actualizar usuario con ID: ${id}`);
    console.log('Datos recibidos para actualizar:', req.body);

    try {
        const usuarioExistente = await Usuario.findByPk(id);
        if (!usuarioExistente) {
            console.log(`Usuario con ID: ${id} no encontrado`);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Validar que el rol sea válido
        const rolesValidos = ['Admin', 'Supervisor', 'Operario', 'Conductor', 'Mantenimiento'];
        if (rol && !rolesValidos.includes(rol)) {
            console.log('Rol inválido:', rol);
            return res.status(400).json({ message: 'El rol proporcionado no es válido' });
        }

        // Si se envía una nueva contraseña, cifrarla antes de actualizar
        let hashedPassword = usuarioExistente.password;
        if (password) {
            console.log('Cifrando nueva contraseña...');
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Actualización del usuario
        console.log('Actualizando usuario en la base de datos...');
        await usuarioExistente.update({
            nombre,
            apellido,
            cedula,
            telefono,
            fecha_ingreso: fecha_ingreso || usuarioExistente.fecha_ingreso, // Asegura que se mantenga si no se envía
            usuario: usuario || usuarioExistente.usuario,
            password: hashedPassword,
            rol,
        });

        console.log(`Usuario con ID: ${id} actualizado correctamente`);
        res.status(200).json(usuarioExistente);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
};



// Eliminar un usuario (Admin)
exports.deleteUsuario = async (req, res, next) => {
    const { id } = req.params;

    try {
        console.log(`Intentando "eliminar" usuario con ID: ${id}`);

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            console.error("Usuario no encontrado con ID:", id);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Cambiar el estado a inactivo
        await usuario.update({ activo: false });
        console.log(`Usuario con ID: ${id} marcado como inactivo`);

        res.status(200).json({ message: 'Usuario marcado como inactivo correctamente' });
    } catch (error) {
        console.error('Error al marcar usuario como inactivo:', error);
        res.status(500).json({ message: 'Error al marcar usuario como inactivo', error: error.message });
    }
};




// Obtener el perfil del Conductor
exports.getPerfilConductor = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id);
        if (!usuario || usuario.rol !== 'Conductor') {
            return res.status(404).json({ message: 'Perfil no encontrado o no autorizado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener perfil del conductor:', error);
        next(error);
    }
};

// Obtener actividades asignadas a Mantenimiento
exports.getActividadesMantenimiento = async (req, res, next) => {
    try {
        // Este ejemplo asume que tienes una tabla "Actividades"
        const actividades = []; // Cambia esto para consultar las actividades reales
        res.status(200).json(actividades);
    } catch (error) {
        console.error('Error al obtener actividades de mantenimiento:', error);
        next(error);
    }
};
