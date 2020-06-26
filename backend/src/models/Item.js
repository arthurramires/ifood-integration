const { DataTypes, Model } = require('sequelize');

class Item extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        quantity: DataTypes.INTEGER,
        price: DataTypes.DOUBLE,
        subItemsPrice: DataTypes.DOUBLE,
        totalPrice: DataTypes.DOUBLE,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
    this.hasMany(models.SubItem, { as: 'subItem' });
  }
}

module.exports = Item;
