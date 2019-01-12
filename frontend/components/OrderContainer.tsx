import { Component } from 'react';
import { Collapse, Alert, Tag } from 'antd';
import styled from 'styled-components';
import ItemCard from './ItemCard';
import { Order, Product } from '../interfaces';
import OrderCardHeader from './OrderCardHeader';
import { AdminContext } from '../context';

interface Props {
  orders: Order[];
}

interface State {
  orders: Order[];
}

const customPanelStyle = {
  background: '#fff',
  borderRadius: 7,
  marginBottom: 8,
  border: 0,
  boxShadow: '0 2px 2px rgba(0,0,0,0.12)'
};

const StyledAlert = styled(Alert)`
  border-radius: 7px;
  border: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.12);
`;

export const FlexSpan = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .title {
    word-break: break-all;
  }

  .right {
    margin-left: auto;

    & > * {
      margin-right: 20px;
      border: 0;
      color: #1890ff;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
    }
  }
`;

class OrderContainer extends Component<Props, State> {
  render() {
    const { orders } = this.props;
    return (
      <Collapse bordered={false} style={{ background: '#f0f2f5' }}>
        {orders.length > 0 &&
          orders.map((order: Order) => {
            let totalSum = 0;
            return (
              <Collapse.Panel
                key={order.id.toString()}
                header={
                  <OrderCardHeader
                    orderId={order.id}
                    orderTable={order.table}
                    orderState={order.state && order.state}
                  />
                }
                style={customPanelStyle}
              >
                {orders.length &&
                  order.products.map((product: Product) => {
                    totalSum +=
                      product.price *
                      (product.quantity !== undefined ? product.quantity : 1);
                    return (
                      <ItemCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        description={product.description}
                        image={product.image}
                        price={product.price}
                        quantity={product.quantity}
                        interactive={false}
                      />
                    );
                  })}
                {order.comment && (
                  <StyledAlert
                    message="Comment"
                    description={order.comment}
                    type="info"
                    showIcon
                    style={{ marginTop: '8px' }}
                  />
                )}
                {order.state === 2 && (
                  <StyledAlert
                    message="Success!"
                    type="success"
                    showIcon
                    description={
                      totalSum > 0 && (
                        <Tag color="green">
                          Total price: $ {totalSum.toFixed(2)}
                        </Tag>
                      )
                    }
                    style={{ marginTop: '8px' }}
                  />
                )}
              </Collapse.Panel>
            );
          })}
      </Collapse>
    );
  }
}

export default OrderContainer;
