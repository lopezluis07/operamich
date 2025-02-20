const bcrypt = require('bcrypt');
const Usuario = require('../models/usuariosModels');

// Función para cifrar las contraseñas existentes
async function cifrarContraseñasExistentes() {
    try {
        const usuarios = await Usuario.findAll();  // Obtén todos los usuarios
        for (let usuario of usuarios) {
            // Si la contraseña no está cifrada, la ciframos
            if (!usuario.password.startsWith('$2b$')) {  // Las contraseñas cifradas con bcrypt comienzan con $2b$
                const hashedPassword = await bcrypt.hash(usuario.password, 10);
                await usuario.update({ password: hashedPassword });
                console.log(`Contraseña cifrada para el usuario: ${usuario.usuario}`);
            }
        }
    } catch (error) {
        console.error('Error al cifrar las contraseñas:', error);
    }
}

cifrarContraseñasExistentes();
