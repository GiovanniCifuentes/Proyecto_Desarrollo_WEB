const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class Usuario extends Model {
  static initialize(sequelize) {
    Usuario.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 100] }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true, notEmpty: true }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [6, 255] }
      },
      rol: {
        type: DataTypes.ENUM('cliente', 'admin'),
        defaultValue: 'cliente'
      }
    }, {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      timestamps: true,
      hooks: {
        beforeCreate: async (usuario) => {
          if (usuario.password) usuario.password = await bcrypt.hash(usuario.password, 12);
        },
        beforeUpdate: async (usuario) => {
          if (usuario.changed('password')) usuario.password = await bcrypt.hash(usuario.password, 12);
        }
      }
    });
  }

  static associate(models) {
    Usuario.hasMany(models.Reserva, { foreignKey: 'usuario_id', as: 'reservas' });
  }
}

Usuario.prototype.validarPassword = async function(password) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, this.password);
};

module.exports = Usuario;

