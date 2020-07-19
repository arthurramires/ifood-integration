import React, { useCallback, useState } from 'react';
import api from '../../services/api';
import axios from 'axios';
import schedule from 'node-schedule';
import { 
  Container, OrdersContainer, Order, 
  OrderName, OrderTime, OrderStatus, 
  OrderClient, OrderClientPhone, OrderItems, 
  OrderItemsTitle, OrderItemsQuantity, OrderItemsPrice,
  OrderDeliveryFee, OrderTotal, OrderInfo,
  OrderActions, AcceptOrder, DeclineOrder, 
  DeliveryButton, OrderActionsTitle, Title } from './styles';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [eventsKnows, setEventsKnows] = useState([]);

  const getToken = useCallback(() => {
    return localStorage.getItem('restaurant:token');
  }, []);

  //Informa ao IFood que o pedido foi confirmado pelo e-PDV
  //[x]
  const handleConfirmOrder = useCallback(async (correlationId) => {
    await axios.post(`https://pos-api.ifood.com.br/v1.0/orders/${correlationId}/statuses/integration`,{
        headers: {
          'Authorization': 'Bearer ' + getToken(),
        }
    });
    await axios.post(`https://pos-api.ifood.com.br/v1.0/orders/${correlationId}/statuses/confirmation`,{
        headers: {
          'Authorization': 'Bearer ' + getToken(),
        }
    });
  }, [getToken]);

  //Pega informações dos pedidos que possuem Status PLACED
  //[x]
  // const requestOrders = useCallback(() => {
  //   events.map(async (event) => {
  //     if (event.code === 'PLACED'){
  //       await axios.get(`https://pos-api.ifood.com.br/v2.0/orders/${event.correlationId}`, {
  //         headers: {
  //           'Authorization': 'Bearer ' + getToken(),
  //         },
  //       }).then(response => {
  //         //Informa ao IFood que o pedido foi integrado e confirmado pelo e-PDV.
  //          //handleConfirmOrder(event.correlationId);
  //          setOrders(response.data)
  //       });
  //     }
  //   });
  // }, [events, getToken]);

  //[x]
  // const handleAcknowledgment = useCallback(() => {
  //   if (events.length !== 0){
  //     events.map(async (event) => {
  //       const existingEvents = eventsKnows.includes(event.id);
  //       if(!existingEvents){
  //         const idEvents = events.map(eventId => {
  //           return {
  //             id: eventId.correlationId, 
  //           }
  //         });
      
  //         await axios.post('https://pos-api.ifood.com.br/v1.0/events/acknowledgment', idEvents, {
  //           headers: {
  //             'Authorization': 'Bearer ' + getToken(),
  //           }
  //         });
  //         setEventsKnows([...eventsKnows, idEvents]);
  //       }
  //     });
  //   }   
  // }, [events, eventsKnows, getToken]);

  //Polling precisa ser executado a todo momento para pegar os eventos
  //[x]
  schedule.scheduleJob('*/30 * * * * *', function(){
    axios.get('https://pos-api.ifood.com.br/v1.0/events%3Apolling', {
        headers: {
          'Authorization': 'Bearer ' + getToken(),
        }
    }).then(response => {
      const newEvents = response.data;
      // setEvents(response.data);
      // handleAcknowledgment();
      // requestOrders();
      newEvents.map(async (event) => {
        let idEvents = newEvents.map(eventId => {
          return {
            id: eventId.correlationId, 
          }
        });
      
        await axios.post('https://pos-api.ifood.com.br/v1.0/events/acknowledgment', idEvents, {
          headers: {
            'Authorization': 'Bearer ' + getToken(),
          }
        });

        idEvents = []

        if (event.code === 'PLACED' || event.code === 'CONFIRMED' || event.code === 'INTEGRATED'){
          await axios.get(`https://pos-api.ifood.com.br/v2.0/orders/${event.correlationId}`, {
            headers: {
              'Authorization': 'Bearer ' + getToken(),
            },
          }).then(response => {
            //Informa ao IFood que o pedido foi integrado e confirmado pelo e-PDV.
             //handleConfirmOrder(event.correlationId);
             const existingOrder = orders.find(order => event.correlationId === order.reference); 
             if(!existingOrder){
              setOrders([...orders, response.data]);
             }
          });
        }
      });      
    });
  });
  
  //Salva os pedidos no banco de dados da Gestor Food
  //[]
  const handleCreateOrder = useCallback(async(data) => {
    try {
      await api.post('/orders', {
        reference: data.reference,
        createdAt: data.createdAt,
        type: data.type,
        deliveryFee: data.deliveryFee,
        subTotal: data.subTotal,
        totalPrice: data.totalPrice,
        payments: data.payments,
        customer: {
            name: data.customer.name,
            taxPayerIdentificationNumber: data.customer.taxPayerIdentificationNumber,
            phone: data.customer.phone,
            email: data.customer.email,
        },
        items: data.items,
        deliveryAddress: {
            formattedAddress: data.deliveryAddress.formattedAddress,
            country: data.deliveryAddress.country,
            state: data.deliveryAddress.state,
            city: data.deliveryAddress.city,
            neighborhood: data.deliveryAddress.neighborhood,
            streetName: data.deliveryAddress.streetName,
            streetNumber: data.deliveryAddress.streetNumber,
            postalCode: data.deliveryAddress.postalCode,
            coordinates: {
                latitude: data.deliveryAddress.coordinates.latitude,
                longitude: data.deliveryAddress.coordinates.longitude
            },
            reference: data.deliveryAddress.reference,
            complement: data.deliveryAddress.complement
        },
      });

      alert('O pedido selecionado acaba de ser salvo no banco de dados Gestor Food!');
    }catch (err){
      console.log(err)
    }
    
  }, []);

  const handleAcceptOrder = useCallback(async(id) => {
    const createOrder = orders.find(order => order.reference === id);
    try {
      await axios.post(`https://pos-api.ifood.com.br/v1.0/orders/${id}/statuses/confirmation`,{
        headers: {
          'Authorization': 'Bearer ' + getToken(),
        }
      });
    }catch (err){
      console.log(err);
    }
    handleCreateOrder(createOrder);
  }, [getToken, handleCreateOrder, orders]);

  //Solicita cancelamento do pedido
  //[]
  const handleDeclineOrder = useCallback(async (id) => {
    try {
      await axios.post(`https://pos-api.ifood.com.br/v3.0/orders/${id}/statuses/cancellationRequested`, {
        headers: {
          'Authorization': 'Bearer ' + getToken(),
        }
      });

      alert('Solicitação de cancelamento enviada!')
    }catch (err){
      console.log(err);
    }
    
  }, [getToken]);

  //Informa que o pedido saiu para entrega
  //[]
  const handleDelivery = useCallback(async (id) => {
    try {
      await axios.post(`https://pos-api.ifood.com.br/v1.0/orders/${id}/statuses/dispatch`, {
        headers: {
          'Authorization': 'Bearer ' + getToken(),
        }
      });
      alert('O cliente será informado de que o pedido saiu para entrega!')
    }catch (err){
      console.log(err);
    }
    
  }, [getToken]);

  
  return (
    <Container>
      <Title>Dashboard</Title>
      <OrdersContainer>
          {orders.map(order => (
            <Order key={order.id}>
              <OrderInfo>
                <OrderName>{order.name}</OrderName>
                <OrderTime>{order.createdAt}</OrderTime>
                <OrderStatus>Status: Em preparo</OrderStatus>
                <OrderClient>Cliente: {order.customer.name}</OrderClient>
                <OrderClientPhone>Telefone: {order.customer.phone}</OrderClientPhone>
                {order.items.map(item => (
                    <OrderItems>
                      <OrderItemsTitle>Itens</OrderItemsTitle>
                      <OrderItemsQuantity>{item.name} x {item.quantity}</OrderItemsQuantity>
                      <OrderItemsPrice>Preço unitário: {item.price}</OrderItemsPrice>
                      {/* {order.subItemsPrice !== 0 && item.subItems.map(subItem => (
                        <>
                          <OrderItemsQuantity>{subItem.name} x {subItem.quantity}</OrderItemsQuantity>
                          <OrderItemsPrice>Preço unitário: R$ {subItem.price}</OrderItemsPrice>
                        </>
                      ))} */}
                    </OrderItems>
                ))}
                <OrderDeliveryFee>Taxa de entrega: {order.deliveryFee}</OrderDeliveryFee>
                <OrderTotal>Total: R$ {order.totalPrice}</OrderTotal>
              </OrderInfo>
              <OrderActions>
                <OrderActionsTitle>Ações</OrderActionsTitle>
                <AcceptOrder onClick={() => handleAcceptOrder(order.reference)}>Aceitar Pedido</AcceptOrder>
                <DeclineOrder onClick={() => handleDeclineOrder(order.reference)}>Cancelar Pedido</DeclineOrder>
                <DeliveryButton onClick={() => handleDelivery(order.reference)}>Saiu para entrega</DeliveryButton>
              </OrderActions>
            </Order>
          ))}
        {/* <Order>
          <OrderInfo>
            <OrderName>Batata Frita com molho</OrderName>
            <OrderTime>Pedido realizado às 18h</OrderTime>
            <OrderStatus>Status: Em preparo</OrderStatus>
            <OrderClient>Cliente: Arthur Ramires</OrderClient>
            <OrderClientPhone>Telefone: (67) 9 9232-7947</OrderClientPhone>
            <OrderItems>
              <OrderItemsTitle>Itens</OrderItemsTitle>
              <OrderItemsQuantity>Batata Frita x 4</OrderItemsQuantity>
              <OrderItemsPrice>Preço unitário: R$ 10.00</OrderItemsPrice>
            </OrderItems>
            <OrderDeliveryFee>Taxa de entrega: Grátis</OrderDeliveryFee>
            <OrderTotal>Total: R$ 40.00</OrderTotal>
          </OrderInfo>
          <OrderActions>
            <OrderActionsTitle>Ações</OrderActionsTitle>
            <AcceptOrder>Aceitar Pedido</AcceptOrder>
            <DeclineOrder>Cancelar Pedido</DeclineOrder>
            <DeliveryButton>Saiu para entrega</DeliveryButton>
          </OrderActions>
        </Order>

        <Order>
          <OrderInfo>
            <OrderName>Batata Frita com molho</OrderName>
            <OrderTime>Pedido realizado às 18h</OrderTime>
            <OrderStatus>Status: Em preparo</OrderStatus>
            <OrderClient>Cliente: Arthur Ramires</OrderClient>
            <OrderClientPhone>Telefone: (67) 9 9232-7947</OrderClientPhone>
            <OrderItems>
              <OrderItemsTitle>Itens</OrderItemsTitle>
              <OrderItemsQuantity>Batata Frita x 4</OrderItemsQuantity>
              <OrderItemsPrice>Preço unitário: R$ 10.00</OrderItemsPrice>
            </OrderItems>
            <OrderDeliveryFee>Taxa de entrega: Grátis</OrderDeliveryFee>
            <OrderTotal>Total: R$ 40.00</OrderTotal>
          </OrderInfo>
          <OrderActions>
            <OrderActionsTitle>Ações</OrderActionsTitle>
            <AcceptOrder>Aceitar Pedido</AcceptOrder>
            <DeclineOrder>Cancelar Pedido</DeclineOrder>
            <DeliveryButton>Saiu para entrega</DeliveryButton>
          </OrderActions>
        </Order>

        <Order>
          <OrderInfo>
            <OrderName>Batata Frita com molho</OrderName>
            <OrderTime>Pedido realizado às 18h</OrderTime>
            <OrderStatus>Status: Em preparo</OrderStatus>
            <OrderClient>Cliente: Arthur Ramires</OrderClient>
            <OrderClientPhone>Telefone: (67) 9 9232-7947</OrderClientPhone>
            <OrderItems>
              <OrderItemsTitle>Itens</OrderItemsTitle>
              <OrderItemsQuantity>Batata Frita x 4</OrderItemsQuantity>
              <OrderItemsPrice>Preço unitário: R$ 10.00</OrderItemsPrice>
            </OrderItems>
            <OrderDeliveryFee>Taxa de entrega: Grátis</OrderDeliveryFee>
            <OrderTotal>Total: R$ 40.00</OrderTotal>
          </OrderInfo>
          <OrderActions>
            <OrderActionsTitle>Ações</OrderActionsTitle>
            <AcceptOrder onClick={() => handleAcceptOrder('id_do_pedido')}>Aceitar Pedido</AcceptOrder>
            <DeclineOrder onClick={() => handleDeclineOrder('id_do_pedido')}>Cancelar Pedido</DeclineOrder>
            <DeliveryButton onClick={() => handleDelivery('id_do_pedido')}>Saiu para entrega</DeliveryButton>
          </OrderActions>
        </Order>

        <Order>
          <OrderInfo>
            <OrderName>Batata Frita com molho</OrderName>
            <OrderTime>Pedido realizado às 18h</OrderTime>
            <OrderStatus>Status: Em preparo</OrderStatus>
            <OrderClient>Cliente: Arthur Ramires</OrderClient>
            <OrderClientPhone>Telefone: (67) 9 9232-7947</OrderClientPhone>
            <OrderItems>
              <OrderItemsTitle>Itens</OrderItemsTitle>
              <OrderItemsQuantity>Batata Frita x 4</OrderItemsQuantity>
              <OrderItemsPrice>Preço unitário: R$ 10.00</OrderItemsPrice>
            </OrderItems>
            <OrderDeliveryFee>Taxa de entrega: Grátis</OrderDeliveryFee>
            <OrderTotal>Total: R$ 40.00</OrderTotal>
          </OrderInfo>
          <OrderActions>
            <OrderActionsTitle>Ações</OrderActionsTitle>
            <AcceptOrder onClick={() => handleAcceptOrder('id_do_pedido')}>Aceitar Pedido</AcceptOrder>
            <DeclineOrder onClick={() => handleDeclineOrder('id_do_pedido')}>Cancelar Pedido</DeclineOrder>
            <DeliveryButton onClick={() => handleDelivery('id_do_pedido')}>Saiu para entrega</DeliveryButton>
          </OrderActions>
        </Order>

        <Order>
          <OrderInfo>
            <OrderName>Batata Frita com molho</OrderName>
            <OrderTime>Pedido realizado às 18h</OrderTime>
            <OrderStatus>Status: Em preparo</OrderStatus>
            <OrderClient>Cliente: Arthur Ramires</OrderClient>
            <OrderClientPhone>Telefone: (67) 9 9232-7947</OrderClientPhone>
            <OrderItems>
              <OrderItemsTitle>Itens</OrderItemsTitle>
              <OrderItemsQuantity>Batata Frita x 4</OrderItemsQuantity>
              <OrderItemsPrice>Preço unitário: R$ 10.00</OrderItemsPrice>
            </OrderItems>
            <OrderDeliveryFee>Taxa de entrega: Grátis</OrderDeliveryFee>
            <OrderTotal>Total: R$ 40.00</OrderTotal>
          </OrderInfo>
          <OrderActions>
            <OrderActionsTitle>Ações</OrderActionsTitle>
            <AcceptOrder onClick={() => handleAcceptOrder('id_do_pedido')}>Aceitar Pedido</AcceptOrder>
            <DeclineOrder onClick={() => handleDeclineOrder('id_do_pedido')}>Cancelar Pedido</DeclineOrder>
            <DeliveryButton onClick={() => handleDelivery('id_do_pedido')}>Saiu para entrega</DeliveryButton>
          </OrderActions>
        </Order> */}
      </OrdersContainer>
    </Container>
  );
}

export default Dashboard;