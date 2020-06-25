const { DataTypes, Model } = require('sequelize');

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        taxPayerIdentificationNumber: DataTypes.BIGINT,
        phone: DataTypes.BIGINT,
        email: DataTypes.STRING,
        formattedAddress: DataTypes.STRING,
        country: DataTypes.STRING,
        state: DataTypes.STRING,
        city: DataTypes.STRING,
        latitude: DataTypes.DOUBLE,
        longitude: DataTypes.DOUBLE,
        neighborhood: DataTypes.STRING,
        streetName: DataTypes.STRING,
        streetNumber: DataTypes.INTEGER,
        postalCode: DataTypes.INTEGER,
        reference: DataTypes.STRING,
        complement: DataTypes.STRING,
      },
      { sequelize }
    );

    return this;
  }
}

module.exports = Customer;
