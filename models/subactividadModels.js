const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Actividad = require('./actividadModels');

const Subactividad = sequelize.define('Subactividad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    actividad_id: {  // Este campo actúa como clave foránea para la relación con actividades
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Actividad,
            key: 'id',
        },
    },
}, {
    tableName: 'subactividades',
    timestamps: false,
});

Actividad.hasMany(Subactividad, { as: 'subactividades', foreignKey: 'actividad_id' });
Subactividad.belongsTo(Actividad, { foreignKey: 'actividad_id' });

module.exports = Subactividad;
