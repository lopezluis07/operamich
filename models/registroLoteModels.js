const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const RegistroOperario = require('./registrosOperariosModels');
const Lote = require('./loteModels');

const RegistroLote = sequelize.define('RegistroLote', {
    registro_id: {
        type: DataTypes.INTEGER,
        references: {
            model: RegistroOperario,
            key: 'id',
        },
    },
    lote_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Lote,
            key: 'id',
        },
    },
}, {
    tableName: 'registro_lotes',
    timestamps: false,
    freezeTableName: true
});

module.exports = RegistroLote;
