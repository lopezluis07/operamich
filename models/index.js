// backend/models/index.js
const sequelize = require('../config/db');
const Usuario = require('./usuariosModels');
const Grupo = require('./gruposModels');
const GrupoOperarios = require('./gruposOperariosModels');

// Definir asociaciones
Grupo.belongsToMany(Usuario, {
  through: GrupoOperarios,
  foreignKey: 'grupo_id',
  otherKey: 'usuario_id',
  as: 'usuarios',
});

Usuario.belongsToMany(Grupo, {
  through: GrupoOperarios,
  foreignKey: 'usuario_id',
  otherKey: 'grupo_id',
  as: 'grupos',
});

module.exports = {
  sequelize,
  Usuario,
  Grupo,
  GrupoOperarios,
};
