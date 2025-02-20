// backend/models/usuariosModels.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  cedula: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  rol: {
    type: DataTypes.ENUM('Admin', 'Supervisor', 'Operario', 'Conductor', 'Mantenimiento'),
    allowNull: false,
  },
  activo: { 
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, 
}, 
}, {
  tableName: 'usuarios',
  timestamps: false,
});



module.exports = Usuario;