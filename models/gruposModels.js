const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./usuariosModels'); // Importamos el modelo correcto

const Grupo = sequelize.define('Grupo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'grupos',
});

// Asociaciones
Grupo.belongsToMany(Usuario, { through: 'grupo_operarios', foreignKey: 'grupo_id' });
Usuario.belongsToMany(Grupo, { through: 'grupo_operarios', foreignKey: 'usuario_id' });

module.exports = Grupo;
