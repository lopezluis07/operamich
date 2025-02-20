const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Seccion = sequelize.define('Seccion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'secciones', // Nombre de la tabla en tu base de datos
    timestamps: false
});

module.exports = Seccion;
