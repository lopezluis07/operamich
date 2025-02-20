const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./usuariosModels");

const DriverRecord = sequelize.define("DriverRecord", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
    },
    zona: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    kilometraje_inicio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    kilometraje_fin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    cantidad_entregada: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    actividad: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: "registros_conductores", // Nombre exacto de la tabla
    timestamps: true, // createdAt y updatedAt
    createdAt: "created_at", // Alineado con la base de datos
    updatedAt: "updated_at", // Alineado con la base de datos
});

DriverRecord.belongsTo(User, {
    foreignKey: "usuario_id",
    as: "Usuario", // Alias para usar en "include"
});

module.exports = DriverRecord;