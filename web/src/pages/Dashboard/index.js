import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import axios from 'axios';
import { isAfter } from 'date-fns';
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
  const [date, setDate] = useState(new Date());

  const getToken = useCallback(async() => {
    const token = await localStorage.getItem('restaurant:token');
    return token;
  }, []);

  useEffect(() => {
    // if (isAfter(date, new Date())){
    //   axios.get('https://pos-api.ifood.com.br/v1.0/events%3Apolling', {
    //     headers: {
    //       'Authorization': getToken(),
    //     }
    //   });
    // }
  }, [date, getToken]);

  const handleCreateOrder = useCallback(async(data) => {
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
  }, []);


  const handleAcceptOrder = useCallback((id) => {
    handleCreateOrder(null);
  }, [handleCreateOrder]);

  const handleDeclineOrder = useCallback((id) => {}, []);

  const handleDelivery = useCallback((id) => {}, []);

  
  return (
    <Container>
      <Title>Dashboard</Title>
      <OrdersContainer>
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
      </OrdersContainer>
    </Container>
  );
}

export default Dashboard;