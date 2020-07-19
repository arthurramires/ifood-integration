const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const Item = require('../models/Item');
const SubItem = require('../models/SubItem');
module.exports = {
    async index(request, response){
        const orders = await Order.findAll({
            include: [
                {
                    model: Customer,
                    as: 'customer',
                },
                {
                    model: Item,
                    as: 'item'
                }
            ]
        });
        
        return response.json(orders);
    },
    async create(request, response){
        const  order_data  = request.body;
        let itemId = [];
        const data = {
            reference: order_data.reference,
            createdAt: order_data.createdAt,
            type: order_data.type,
            deliveryFee: order_data.deliveryFee,
            subTotal: order_data.subTotal,
            totalPrice: order_data.totalPrice,
            payments: order_data.payments,
            customer: {
                name: order_data.customer.name,
                taxPayerIdentificationNumber: order_data.customer.taxPayerIdentificationNumber,
                phone: order_data.customer.phone,
                email: 'Não fornecido',
            },
            items: order_data.items,
            deliveryAddress: {
                formattedAddress: order_data.deliveryAddress.formattedAddress,
                country: order_data.deliveryAddress.country,
                state: order_data.deliveryAddress.state,
                city: order_data.deliveryAddress.city,
                neighborhood: order_data.deliveryAddress.neighborhood,
                streetName: order_data.deliveryAddress.streetName,
                streetNumber: order_data.deliveryAddress.streetNumber,
                postalCode: order_data.deliveryAddress.postalCode,
                coordinates: {
                    latitude: order_data.deliveryAddress.coordinates.latitude,
                    longitude: order_data.deliveryAddress.coordinates.longitude
                },
                complement: order_data.deliveryAddress.complement
            },
        }

        await Customer.create({
            name: data.customer.name,
            taxPayerIdentificationNumber: data.customer.taxPayerIdentificationNumber,
            phone: data.customer.phone,
            email: data.customer.email,
            formattedAddress: data.deliveryAddress.formattedAddress,
            country: data.deliveryAddress.country,
            state: data.deliveryAddress.state,
            latitude: data.deliveryAddress.coordinates.latitude,
            longitude: data.deliveryAddress.coordinates.longitude,
            city: data.deliveryAddress.city,
            neighborhood: data.deliveryAddress.neighborhood,
            streetName: data.deliveryAddress.streetName,
            streetNumber: data.deliveryAddress.streetNumber,
            postalCode: data.deliveryAddress.postalCode,
            reference: data.deliveryAddress.neighborhood,
            complement: data.deliveryAddress.complement
        }).then(response => {
            Order.create({
                customer_id: response.dataValues.id,
                totalPrice: data.totalPrice, 
                subTotal: data.subTotal, 
                deliveryFee: data.deliveryFee, 
                type: data.type,
            }).then(responseOrder => {
                for (let i = 0; i < data.payments.length; i++){
                    Payment.create({
                        order_id: responseOrder.id,
                        name: data.payments[i].name,
                        code: data.payments[i].code,
                        value: data.payments[i].value,
                        issuer: data.payments[i].issuer,
                        prepaId: data.payments[i].prepaid,
                    });
                }

                for (let i = 0; i < data.items.length; i++){
                    Item.create({
                        order_id: responseOrder.id,
                        name: data.items[i].name,
                        quantity: data.items[i].quantity,
                        price: data.items[i].price,
                        subItemsPrice: data.items[i].subItemsPrice,
                        totalPrice: data.items[i].totalPrice,
                    }).then(response => {
                        if (response.subItemsPrice !== 0){
                            for (let j = 0; j < data.items[i].subItems.length; j++){
                                SubItem.create({
                                    item_id: response.id,
                                    name: data.items[i].subItems[j].name,
                                    quantity: data.items[i].subItems[j].quantity,
                                    price: data.items[i].subItems[j].price,
                                    totalPrice: data.items[i].subItems[j].totalPrice,
                                });
                            }
                        }
                    });
        
                    
                }
            });
        });

        
        return response.json({});
    }
}