const express = require('express');
const OrderController = require('./controllers/OrderController');
const routes = express.Router();

routes.post('/orders', OrderController.create);
routes.get('/orders', OrderController.index);

module.exports = routes;