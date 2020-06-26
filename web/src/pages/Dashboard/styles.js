import styled from 'styled-components';

export const Container = styled.div`
    color: #FFF;
    font-size: 20px;
`;

export const Title = styled.h1`
    display: flex;
    padding: 60px;
`;

export const OrdersContainer = styled.div`
    background: #FFF;
    height: 100%;
    width: 100%;
    padding: 20px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const Order = styled.div`
    background: #FFF;
    height: 100%;
    width: 600px;
    border: 1px solid #FF9000;
    padding: 8px;
    display: flex;
    border-radius: 8px;
    margin-right: 8px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
`;

export const OrderInfo = styled.div`
`;

export const OrderActions = styled.div`
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 200px;
    background: #FFF;
    padding: 8px;
    justify-content: center;
    align-items: center;
`;

export const OrderName = styled.h3`
    color: #000;
    font-size: 20px;
`;

export const OrderTime = styled.p`
    color: #000;
    margin-top: 10px;
    font-size: 16px;
`;

export const OrderStatus = styled.p`
    color: #000;
    font-size: 16px;
    margin-top: 4px;
`;

export const OrderClient = styled.p`
    color: #000;
    font-size: 16px;
    margin-top: 4px;
`;

export const OrderClientPhone = styled.p`
    color: #000;
    font-size: 16px;
    margin-top: 4px;
`;

export const OrderItems = styled.div`
    flex-direction: row;
`;

export const OrderItemsTitle = styled.h3`
    color: #000;
    font-size: 16px;
    margin-top: 4px;
`;

export const OrderItemsQuantity = styled.p`
    color: #000;
    font-size: 16px;
    margin-top: 4px;
`;

export const OrderItemsPrice = styled.p`
    color: #000;
    font-size: 16px;
    margin-top: 4px;
`;

export const OrderDeliveryFee = styled.p`
    color: #000;
    font-size: 16px;
    margin-top: 4px;
`;

export const OrderTotal = styled.h4`
    color: #000;
    font-size: 16px;
    margin-top: 4px;
`;

export const OrderActionsTitle = styled.h3`
    color: #000;
    font-size: 20px;
    margin-top: 10px;
    margin-bottom: 8px;
`;

export const AcceptOrder = styled.button`
    width: 150px;
    background: #7FFF00;
    margin-top: 4px;
    color: #FFF;
    font-size: 17px;
    border: 0;
    border-radius: 10px;
`;

export const DeclineOrder = styled.button`
    width: 150px;
    background: #FF0000;
    margin-top: 4px;
    color: #FFF;
    font-size: 17px;
    border: 0;
    border-radius: 10px;
`;

export const DeliveryButton = styled.button`
    width: 150px;
    background: #FF9000;
    margin-top: 4px;
    color: #FFF;
    font-size: 17px;
    border: 0;
    border-radius: 10px;
`;

