const Actividad = require('../models/actividadModels');
const Subactividad = require('../models/subactividadModels'); // Modelo de Subactividad


exports.getActividades = async (req, res) => {
    try {
        const actividades = await Actividad.findAll({
            include: [
                {
                    model: Subactividad,
                    as: 'subactividades',
                    attributes: ['id', 'nombre'], // Traer solo los campos necesarios
                },
            ],
        });
        res.status(200).json(actividades);
    } catch (error) {
        console.error('Error al obtener actividades:', error);
        res.status(500).json({ error: 'Error al obtener actividades' });
    }
};


exports.createActividad = async (req, res) => {
    const { nombre, subactividades } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre de la actividad es obligatorio' });
    }

    try {
        const nuevaActividad = await Actividad.create({ nombre });

        // Crear subactividades si se proporcionan
        if (subactividades && subactividades.length > 0) {
            const subactividadesToCreate = subactividades.map((sub) => ({
                nombre: sub.nombre,
                actividad_id: nuevaActividad.id,
            }));
            await Subactividad.bulkCreate(subactividadesToCreate);
        }

        res.status(201).json({ message: 'Actividad creada con éxito', nuevaActividad });
    } catch (error) {
        console.error('Error al crear actividad:', error);
        res.status(500).json({ error: 'Error al crear actividad' });
    }
};


exports.updateActividad = async (req, res) => {
    const { id } = req.params;
    const { nombre, subactividades } = req.body;

    try {
        const actividad = await Actividad.findByPk(id);
        if (!actividad) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }

        // Actualizar la actividad principal
        await actividad.update({ nombre });

        // Manejar subactividades
        if (subactividades && subactividades.length > 0) {
            // Eliminar las subactividades existentes
            await Subactividad.destroy({ where: { actividad_id: id } });

            // Crear nuevas subactividades
            const subactividadesToCreate = subactividades.map((sub) => ({
                nombre: sub.nombre,
                actividad_id: id,
            }));
            await Subactividad.bulkCreate(subactividadesToCreate);
        }

        res.status(200).json({ message: 'Actividad actualizada con éxito' });
    } catch (error) {
        console.error('Error al actualizar actividad:', error);
        res.status(500).json({ error: 'Error al actualizar actividad' });
    }
};

// Eliminar una actividad y sus subactividades
exports.deleteActividad = async (req, res) => {
    try {
        const { id } = req.params;
        const actividad = await Actividad.findByPk(id, {
            include: [{ model: Subactividad, as: 'subactividades' }],
        });

        if (!actividad) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }

        // Eliminar subactividades asociadas
        await Subactividad.destroy({ where: { actividad_id: id } });

        // Eliminar actividad principal
        await actividad.destroy();

        res.status(200).json({ message: 'Actividad y sus subactividades eliminadas correctamente' });
    } catch (error) {
        console.error('Error al eliminar la actividad:', error);
        res.status(500).json({ error: 'Error al eliminar la actividad' });
    }
};
