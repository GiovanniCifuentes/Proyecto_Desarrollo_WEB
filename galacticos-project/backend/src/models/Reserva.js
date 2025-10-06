const { DataTypes, Model } = require('sequelize');

class Reserva extends Model {
  static initialize(sequelize) {
    Reserva.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      usuario_id: { type: DataTypes.INTEGER, allowNull: false },
      evento_id: { type: DataTypes.INTEGER, allowNull: false },
      cantidad_entradas: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1 } },
      estado: { type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'), defaultValue: 'pendiente' },
      codigo_qr: { type: DataTypes.STRING, unique: true, allowNull: true }
    }, {
      sequelize,
      modelName: 'Reserva',
      tableName: 'reservas',
      timestamps: true
    });
  }

  static associate(models) {
    Reserva.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    Reserva.belongsTo(models.Evento, { foreignKey: 'evento_id', as: 'evento' });
  }

  generarCodigoQR() {
    this.codigo_qr = `RESERVA-${this.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return this.codigo_qr;
  }
}

module.exports = Reserva;
