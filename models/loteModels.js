const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lote = sequelize.define('Lote', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    seccion_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'lotes',
    timestamps: false
});

module.exports = Lote;


