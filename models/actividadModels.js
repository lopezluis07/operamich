const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Asegúrate de que la conexión a la base de datos está bien configurada

const Actividad = sequelize.define('Actividad', {
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
    tableName: 'actividades_principales',  // Nombre de la tabla en la base de datos
    timestamps: false          // Si no estás usando los campos de createdAt/updatedAt
});

module.exports = Actividad;
  