const { DataTypes, Model } = require('sequelize');

class Payment extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        code: DataTypes.STRING,
        value: DataTypes.DOUBLE,
        prepaId: DataTypes.BOOLEAN,
        issuer: DataTypes.STRING
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
  }
}

module.exports = Payment;
