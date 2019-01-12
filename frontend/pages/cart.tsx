import UserLayout from '../components/UserLayout';
import ItemCard from '../components/ItemCard';
import styled from 'styled-components';
import { CartContext } from '../context';
import { Empty, Card, Button, InputNumber, Modal, message, Tag } from 'antd';
import React from 'react';
import { Product } from '../interfaces';
import { Input } from 'antd';
import io from 'socket.io-client';
import { BACKEND_URL } from '../config';
import Spinner from '../components/Spinner';

const { TextArea } = Input;

const StyledCard = styled(Card)`
  margin-top: 8px;
  border-radius: 7px;
  border: none;
  display: flex;
  .ant-card-body {
    padding-bottom: 0;
    padding-top: 0;
  }
  flex-direction: column;
  text-align: center;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
  @media (min-width: 768px) {
    margin: auto;
    width: 70%;
  }
`;

interface State {
  modalVisible: boolean;
  loadingFromLocal: boolean;
}

export default class extends React.Component<any, State> {
  static contextType = CartContext;
  context!: React.ContextType<typeof CartContext>;

  state: State = {
    modalVisible: false,
    loadingFromLocal: true
  };

  async componentDidMount() {
    await this.context.actions.reload();
    this.setState({ loadingFromLocal: false });
  }

  placeOrder = () => {
    if (this.context.order.table) {
      /**
       * Remove the actions and the totalAmount before sending to the backend
       */
      const { order } = this.context;
      let totalSum = 0;
      Modal.warn({
        title: 'Are you sure you want to place this order?',
        content: (
          <div>
            {this.context.order.products.map((product: Product) => {
              totalSum += product.price;
              return (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <p>{product.name}</p>
                  <p>
                    {product.price} x {product.quantity}
                  </p>
                </div>
              );
            })}
            <strong>Total price: $ {totalSum.toFixed(2)}</strong>
          </div>
        ),
        onOk: () => {
          if (this.context.socket) {
            this.context.socket.emit('place_order', order);
            this.context.actions.clear();
          }
        },
        maskClosable: true
      });
    }
  };

  handleComment = (e: React.FormEvent<HTMLTextAreaElement>) => {
    this.context.actions.comment(e.currentTarget.value);
  };

  handleTable = (e: React.FormEvent<HTMLInputElement>) => {
    this.context.actions.setTable(e.currentTarget.value);
  };

  render() {
    let data: React.ReactNode[] | React.ReactNode;
    /**
     * Check whether orders are still being fetched from localStorage
     */
    if (this.state.loadingFromLocal) {
      data = <Spinner />;
    } else {
      if (this.context.order && this.context.order.products.length) {
        let totalSum = 0;
        data = (
          <>
            {this.context.order.products.map((product: Product) => {
              totalSum += product.price;
              return (
                <ItemCard
                  interactive
                  id={product.id}
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  image={product.image}
                  price={product.price}
                  quantity={product.quantity}
                />
              );
            })}
            <div style={{ width: '100%' }}>
              <StyledCard>
                <TextArea
                  placeholder="Write comments in case you are allergic to ingredients or want to exclude some. e.g. no onions, no mayo. "
                  onChange={this.handleComment}
                  rows={6}
                  defaultValue={this.context.order.comment}
                  style={{ width: '100%', marginTop: '2%' }}
                />
                <div style={{ display: 'flex' }}>
                  <Input
                    defaultValue={this.context.order.table}
                    placeholder="Enter table e.g. A1, A2 etc."
                    onChange={this.handleTable}
                    style={{ marignLeft: '1%', marginTop: '2%' }}
                    size="large"
                  />
                </div>
                <Button
                  type="primary"
                  style={{ marginBottom: '2%', marginTop: '2%' }}
                  onClick={this.placeOrder}
                >
                  Place order!
                </Button>
                <Tag style={{ marginLeft: '2%' }} color="green">
                  Total price: $ {totalSum.toFixed(2)}
                </Tag>
              </StyledCard>
            </div>
          </>
        );
      } else {
        data = (
          <Empty description="No products">
            No items added to the cart yet. Go and add some!
          </Empty>
        );
      }
    }

    return (
      <UserLayout selectedKey="cart">
        <FlexContainer>{data}</FlexContainer>
      </UserLayout>
    );
  }
}
