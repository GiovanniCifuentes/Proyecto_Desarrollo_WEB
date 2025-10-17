const { DataTypes, Model } = require('sequelize');

class Evento extends Model {
  static initialize(sequelize) {
    Evento.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, len: [2, 255] } },
      descripcion: { type: DataTypes.TEXT, allowNull: false },
      fecha: { type: DataTypes.DATE, allowNull: false },
      aforo_maximo: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
      aforo_actual: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0 } },
      precio: { type: DataTypes.FLOAT, allowNull: false, validate: { min: 0 } },
      imagen: { type: DataTypes.STRING },
      tipo: { type: DataTypes.ENUM('concierto', 'teatro', 'cine', 'deporte', 'comedia', 'otro'), allowNull: false },
      ubicacion: { type: DataTypes.STRING }
    }, {
      sequelize,
      modelName: 'Evento',
      tableName: 'eventos',
      timestamps: true
    });
  }

  static associate(models) {
    Evento.hasMany(models.Reserva, { foreignKey: 'evento_id', as: 'reservas' });
  }

  tieneAforoDisponible(cantidad = 1) {
    return (this.aforo_maximo - this.aforo_actual) >= cantidad;
  }

  async actualizarAforo(cantidad, operacion = 'sumar') {
    this.aforo_actual += operacion === 'sumar' ? cantidad : -cantidad;
    await this.save();
  }
}

module.exports = Evento;
