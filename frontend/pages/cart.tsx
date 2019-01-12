import UserLayout from '../components/UserLayout';
import ItemCard from '../components/ItemCard';
import styled from 'styled-components';
import { CartContext } from '../context';
import { Empty, Card, Button, InputNumber, Modal, message } from 'antd';
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
  socket: SocketIOClient.Socket;

  state: State = {
    modalVisible: false,
    loadingFromLocal: true
  };

  async componentDidMount() {
    await this.context.actions.reload();
    this.setState({ loadingFromLocal: false });

    this.socket = io(`${BACKEND_URL}`);
  }

  placeOrder = () => {
    if (this.context.order.table) {
      /**
       * Remove the actions and the totalAmount before sending to the backend
       */
      const { order } = this.context;
      this.socket.emit('place_order', order);
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
        data = (
          <>
            {this.context.order.products.map((product: Product) => (
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
            ))}
            <div style={{ width: '100%' }}>
              <StyledCard>
                <TextArea
                  placeholder="Write comments in case you are allergic to ingredients or want to exclude some. e.g. no onions, no mayo. "
                  onChange={this.handleComment}
                  rows={6}
                  style={{ width: '100%', marginTop: '2%' }}
                />
                <div style={{ display: 'flex' }}>
                  <Input
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
