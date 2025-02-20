const Grupo = require('../models/gruposModels');
const GrupoOperario = require('../models/gruposOperariosModels');
const Usuario = require('../models/usuariosModels');

// Crear un grupo
exports.createGrupo = async (req, res) => {
    const { nombre, operarios } = req.body;

    if (!nombre || !operarios || operarios.length === 0) {
        return res.status(400).json({ error: 'Nombre y operarios son obligatorios' });
    }

    try {
        const nuevoGrupo = await Grupo.create({ nombre });

        const grupoOperarios = operarios.map((usuario_id) => ({
            grupo_id: nuevoGrupo.id,
            usuario_id,
        }));

        await GrupoOperario.bulkCreate(grupoOperarios);

        res.status(201).json({ message: 'Grupo creado correctamente', grupo: nuevoGrupo });
    } catch (error) {
        console.error('Error al crear el grupo:', error);
        res.status(500).json({ error: 'Error al crear el grupo' });
    }
};

// Obtener todos los grupos
exports.getGrupos = async (req, res) => {
    try {
        const grupos = await Grupo.findAll({
            include: [
                {
                    model: Usuario,
                    through: { attributes: [] }, // No incluir datos de la tabla intermedia
                },
            ],
        });
        res.status(200).json(grupos);
    } catch (error) {
        console.error('Error al obtener los grupos:', error);
        res.status(500).json({ error: 'Error al obtener los grupos' });
    }
};

// Eliminar un grupo
exports.deleteGrupo = async (req, res) => {
    const { id } = req.params;

    try {
        await GrupoOperario.destroy({ where: { grupo_id: id } });
        await Grupo.destroy({ where: { id } });
        res.status(200).json({ message: 'Grupo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el grupo:', error);
        res.status(500).json({ error: 'Error al eliminar el grupo' });
    }
};
