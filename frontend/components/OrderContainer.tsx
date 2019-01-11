import { Component } from 'react';
import { Collapse, Button, Alert } from 'antd';
import styled from 'styled-components';
import ItemCard from './ItemCard';
import { Order, Product } from '../interfaces';

interface Props {
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

const FlexSpan = styled.span`
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

const OrderCardHeader = ({ orderId }: any) => {
  return (
    <FlexSpan>
      <span className="title">Table № {orderId}</span>
      <span className="right">
        <Button shape="circle" type="default" icon="check" />
        <Button shape="circle" type="default" icon="close" />
      </span>
    </FlexSpan>
  );
};

class OrderContainer extends Component<Props> {
  render() {
    const { orders } = this.props;
    return (
      <Collapse bordered={false} style={{ background: '#f0f2f5' }}>
        {orders.length > 0 &&
          orders.map((order: Order) => (
            <Collapse.Panel
              key={order.id.toString()}
              header={<OrderCardHeader orderId={order.table} />}
              style={customPanelStyle}
            >
              {orders.length &&
                order.products.map((product: Product) => (
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
                ))}
              {order.comment && (
                <StyledAlert
                  message="Comment"
                  description={order.comment}
                  type="info"
                  showIcon
                  style={{ marginTop: '8px' }}
                />
              )}
            </Collapse.Panel>
          ))}
      </Collapse>
    );
  }
}

export default OrderContainer;
