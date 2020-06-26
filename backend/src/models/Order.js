const { DataTypes, Model } = require('sequelize');

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        totalPrice: DataTypes.DOUBLE,
        subTotal: DataTypes.DOUBLE,
        deliveryFee: DataTypes.DOUBLE,
        type: DataTypes.STRING,
      },
      { sequelize }
    );

    return this;
  }
  static associate(models) {
    this.belongsTo(models.Customer, { foreignKey: 'customer_id', as: 'customer' });
    this.hasMany(models.Item, { as: 'item' });
  }
}

module.exports = Order;
