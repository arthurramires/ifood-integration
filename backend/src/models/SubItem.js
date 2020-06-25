const { DataTypes, Model } = require('sequelize');

class SubItem extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        quantity: DataTypes.INTEGER,
        price: DataTypes.DOUBLE,
        totalPrice: DataTypes.DOUBLE,
      },
      { sequelize }
    );

    return this;
  }
  static associate(models) {
    this.belongsTo(models.Item, { foreignKey: 'item_id', as: 'item' });
  }
}

module.exports = SubItem;
