
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Usuario = require("./usuariosModels");
const Actividad = require("./actividadModels");
const Seccion = require("./seccionModels");
const Lote = require("./loteModels");
const Subactividad = require("./subactividadModels");
const RegistroLote = require("./registroLoteModels");
const RegistroSubactividad = require("./registroSubactividadModels");

const RegistroOperario = sequelize.define(
  "RegistroOperario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    actividad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seccion_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    horas_labor: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },

    horas_lluvia: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    horas_traslado: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    horas_recoleccion: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },

    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cantidad_arboles_aplicados: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cantidad_litros_aplicados: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    cantidad_arboles_fertilizados: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cantidad_kilos_aplicados: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rendimiento: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    unidad_medida: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    supervisor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Usuarios",
        key: "id",
      },
    },
    descuentoManana: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    descuentoTarde: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    descuento_ducha: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
  },
  {
    tableName: "registros_operarios",
    timestamps: false,
    freezeTableName: true,
  }
);

// Relaciones
RegistroOperario.belongsTo(Usuario, {
  as: "Supervisor",
  foreignKey: "supervisor_id",
}); // Relación con el supervisor que registró el dato
RegistroOperario.belongsTo(Usuario, {
  as: "Usuario",
  foreignKey: "usuario_id",
}); // Relación con el usuario/operario asociado
RegistroOperario.belongsTo(Actividad, { foreignKey: "actividad_id" });
RegistroOperario.belongsTo(Seccion, { foreignKey: "seccion_id" });

RegistroOperario.belongsToMany(Subactividad, {
  through: RegistroSubactividad,
  as: 'Subactividades', // Asegúrate de que este alias es 'Subactividades'
  foreignKey: 'registro_id',
  otherKey: 'subactividad_id'
});

RegistroOperario.belongsToMany(Lote, {
  through: RegistroLote,
  as: "Lotes", // Alias necesario para `setLotes`
  foreignKey: "registro_id",
  otherKey: "lote_id",
});

module.exports = RegistroOperario;
