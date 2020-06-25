const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Item = require('../models/Item');
const SubItem = require('../models/SubItem');
const Customer = require('../models/Customer');

const models = [
    Order,
    Payment,    
    Item,
    SubItem,
    Customer,
  ];
  
class Database {
    constructor() {
        this.init();
    }
    
      init() {
        this.connection = new Sequelize(dbConfig);
        models
          .map(model => model.init(this.connection))
          .map(model => model.associate && model.associate(this.connection.models));
      }
}

module.exports = new Database();