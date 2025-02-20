const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./usuariosModels');
const Grupo = require('./gruposModels');

const GrupoOperario = sequelize.define('GrupoOperario', {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  grupo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
}, {
  tableName: 'grupo_operarios',
  timestamps: false,
});

module.exports = GrupoOperario;