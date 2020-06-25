const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const Item = require('../models/Item');
const SubItem = require('../models/SubItem');
module.exports = {
    async index(request, response){
        const orders = await Order.findAll({
            include: {
                model: Payment,
                as: 'payment',
                attributes: ['id', 'name', 'code', 'issuer', 'prepaId']
            }
        });

        return response.json(orders);
    },
    async create(request, response){
        //const { order_data } = request.body;
        let itemId = [];
        const data = {
            reference: 31,
            createdAt: "2020-06-25T11:39:00+00:00",
            type: "DELIVERY",
            deliveryFee: 5,
            subTotal: 20.0,
            totalPrice: 25,
            payments: [
                {
                    name: "Nome da forma de pagamento",
                    code: "Codigo da forma de pagamento⁎⁎⁎",
                    value: 20.0,
                    prepaId: false,
                    issuer: "Elo"
                },
                {
                    name: "Nome da forma de pagamento",
                    code: "Codigo da forma de pagamento⁎⁎⁎",
                    value: 20.0,
                    prepaId: false,
                    issuer: "Mastercard"
                }
            ],
            customer: {
                name: "Nome do cliente",
                taxPayerIdentificationNumber: "1234556",
                phone: "67992327947",
                email: "arthurramires@gmail.com",
                
            },
            items: [
                {
                    name: "Nome do item",
                    quantity: 2,
                    price: 10,
                    subItemsPrice: 5,
                    totalPrice: 20,
                    subItems: [
                        {
                            name: "Sub item1",
                            quantity: 1,
                            price: 1,
                            totalPrice: 2,
                        }
                    ]
                },
                {
                    name: "Nome do item",
                    quantity: 2,
                    price: 10,
                    subItemsPrice: 5,
                    totalPrice: 20,
                    subItems: [
                        {
                            name: "sub item 2",
                            quantity: 1,
                            price: 1,
                            totalPrice: 2,
                        }
                    ]
                },
            ],
            deliveryAddress: {
                formattedAddress: "Endereço formatado",
                country: "Pais",
                state: "Estado",
                city: "Cidade",
                neighborhood: "Bairro",
                streetName: "Endereço (Tipo logradouro + Logradouro)",
                streetNumber: 112,
                postalCode: "CEP",
                coordinates: {
                    latitude: -20.5330711,
                    longitude: -54.5985399
                },
                reference: "Referencia",
                complement: "Complemento do endereço"
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
            reference: data.deliveryAddress.reference,
            complement: data.deliveryAddress.complement
        }).then(response => {
            Order.create({
                customer_id: response.dataValues.id,
                totalPrice: data.totalPrice, 
                subTotal: data.subTotal, 
                deliveryFee: data.deliveryFee, 
                type: data.type,
            });
        });

        for (let i = 0; i < data.payments.length; i++){
            await Payment.create({
                order_id: data.reference,
                name: data.payments[i].name,
                code: data.payments[i].code,
                value: data.payments[i].value,
                issuer: data.payments[i].issuer,
                prepaId: data.payments[i].prepaId,
            });
        }

        for (let i = 0; i < data.items.length; i++){
            await Item.create({
                order_id: data.reference,
                name: data.items[i].name,
                quantity: data.items[i].quantity,
                price: data.items[i].price,
                subItemsPrice: data.items[i].subItemsPrice,
                totalPrice: data.items[i].totalPrice,
            }).then(response => {
                itemId.push(response.dataValues.id)
            });

            for (let j = 0; j < data.items[i].subItems.length; j++){
                SubItem.create({
                    item_id: itemId[i],
                    name: data.items[i].subItems[j].name,
                    quantity: data.items[i].subItems[j].quantity,
                    price: data.items[i].subItems[j].price,
                    totalPrice: data.items[i].subItems[j].totalPrice,
                });
            }
        }
            
        
        
        
        return response.json({});
    }
}