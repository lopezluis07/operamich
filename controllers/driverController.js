const DriverRecord = require("../models/DriverRecord");
const User = require("../models/usuariosModels"); // Importar el modelo de usuarios

const driverController = {
    // Crear un registro
    createRecord: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(403).json({ error: "Usuario no autenticado." });
            }

            const {
                zona,
                fecha,
                hora_inicio,
                hora_fin,
                kilometraje_inicio,
                kilometraje_fin,
                cantidad_entregada,
                observaciones,
                actividad,
            } = req.body;

            const usuario_id = req.user.id;

            const newRecord = await DriverRecord.create({
                usuario_id,
                zona,
                fecha: fecha || null,
                hora_inicio: hora_inicio || null,
                hora_fin: hora_fin || null,
                kilometraje_inicio: kilometraje_inicio || null,
                kilometraje_fin: kilometraje_fin || null,
                cantidad_entregada: cantidad_entregada || null,
                observaciones: observaciones || null,
                actividad: actividad || null,
            });

            res.status(201).json({ message: "Registro creado con éxito", data: newRecord });
        } catch (error) {
            console.error("Error al crear el registro:", error);
            res.status(500).json({ error: "Error al crear el registro" });
        }
    },

    // Obtener todos los registros (incluyendo nombre y apellido de Usuario)
    getAllRecords: async (req, res) => {
        try {
            // 'include' para traer datos del usuario
            // 'attributes' en user para solo retornar nombre y apellido
            const records = await DriverRecord.findAll({
                include: [
                    {
                        model: User,
                        as: "Usuario",
                        attributes: ["nombre", "apellido", "rol"], 
                    },
                ],
            });
            res.json(records);
        } catch (error) {
            console.error("Error al obtener los registros:", error);
            res.status(500).json({ error: "Error al obtener los registros" });
        }
    },

    // Obtener registros por usuario
    getRecordsByUser: async (req, res) => {
        try {
            const { id } = req.params;
            // Si quieres incluir el nombre del usuario aquí también, repite el 'include'
            const records = await DriverRecord.findAll({ 
                where: { usuario_id: id },
                include: [
                    {
                        model: User,
                        as: "Usuario",
                        attributes: ["nombre", "apellido", "rol"],
                    },
                ],
            });
            res.json(records);
        } catch (error) {
            console.error("Error al obtener registros del usuario:", error);
            res.status(500).json({ error: "Error al obtener registros del usuario" });
        }
    },

    // Obtener registros según el usuario autenticado (opcionalmente con filtro de fecha)
    getUserRecords: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(403).json({ error: "Usuario no autenticado." });
            }

            const usuarioId = req.user.id; 
            const { fecha } = req.query; 

            const where = { usuario_id: usuarioId };
            if (fecha) {
                where.fecha = fecha;
            }

            console.log("Filtros aplicados (WHERE):", where);

            // Igual si quieres incluir los datos del usuario
            const records = await DriverRecord.findAll({
                where,
                order: [["fecha", "DESC"]],
                include: [
                    {
                        model: User,
                        as: "Usuario",
                        attributes: ["nombre", "apellido", "rol"],
                    },
                ],
            });

            res.json(records);
        } catch (error) {
            console.error("Error al obtener registros:", error);
            res.status(500).json({ error: "Error al obtener registros." });
        }
    },

    // Actualizar un registro existente
    updateRecord: async (req, res) => {
        try {
            const { id } = req.params;
            const record = await DriverRecord.findByPk(id);
            if (!record) return res.status(404).json({ error: "Registro no encontrado" });

            await record.update(req.body);
            res.json({ message: "Registro actualizado con éxito", data: record });
        } catch (error) {
            console.error("Error al actualizar el registro:", error);
            res.status(500).json({ error: "Error al actualizar el registro" });
        }
    },

    // Eliminar un registro
    deleteRecord: async (req, res) => {
        try {
            const { id } = req.params;
            const record = await DriverRecord.findByPk(id);
            if (!record) return res.status(404).json({ error: "Registro no encontrado" });

            await record.destroy();
            res.json({ message: "Registro eliminado con éxito" });
        } catch (error) {
            console.error("Error al eliminar el registro:", error);
            res.status(500).json({ error: "Error al eliminar el registro" });
        }
    },
};

module.exports = driverController;
