const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const RegistroOperario = require('./registrosOperariosModels');
const Subactividad = require('./subactividadModels');

const RegistroSubactividad = sequelize.define('RegistroSubactividad', {
    registro_id: {
        type: DataTypes.INTEGER,
        references: {
            model: RegistroOperario,
            key: 'id',
        },
    },
    subactividad_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Subactividad,
            key: 'id',
        },
    },
}, {
    tableName: 'registro_subactividades',
    timestamps: false,
    freezeTableName: true
});

module.exports = RegistroSubactividad;
