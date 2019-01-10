import { CartContext } from '../context';
import React from 'react';
import { Card, Icon, Button, Badge, Avatar } from 'antd';
import styled from 'styled-components';
import ButtonGroup from 'antd/lib/button/button-group';

interface Props {
  name: string;
  price: number | string;
  quantity: number | string;
  interactive?: boolean;
  image: string;
}

const StyledCard: any = styled(Card)`
  margin: 8px 4px 0 4px;
  border-radius: 7px;
  width: 70%;
  border: none;
  text-align: center;
  display: flex;
  flex-direction: row;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);

  h1 {
    font-size: 2rem;
  }

  @media (max-width: 768px) {
    .ant-card-body {
      flex-direction: column;
    }
    width: 100%;
    flex-basis: 100%;
  }

  .ant-card-body {
    width: 100%;
    display: flex;
    padding-top: 8px;
    padding-bottom: 8px;
    align-items: center;
    padding-left: 0;
    padding-right: 0;
  }

  .quantity {
    margin-right: 2.5%;
    margin-left: 2.5%;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    @media (max-width: 768px) {
      order: 3;
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .ant-btn-group {
    min-width: 8rem;
  }

  .title {
    flex-grow: 1;
    margin-top: 1%;
    margin: auto;
    word-break: break-all;
    text-align: left;
    padding-left: 2.5%;
    padding-right: 2.5%;
    @media (max-width: 768px) {
      order: 1;
      text-align: center;
    }
  }

  .price {
    flex-shrink: 0;
    z-index: 5;
    margin-left: 2.5%;
    margin-right: 2.5%;
    margin-top: 2.5%;
    margin-bottom: 2.5%;
    @media (max-width: 768px) {
      order: 2;
    }
  }
`;

const StyledButton: any = styled(Button)`
  border: none;
  box-shadow: none;
`;

export default class extends React.Component<Props> {
  static contextType = CartContext;
  context!: React.ContextType<typeof CartContext>;

  render() {
    const { name, price, quantity, interactive } = this.props;

    return (
      <StyledCard>
        <div className="quantity">
          <ButtonGroup>
            {interactive && (
              <StyledButton>
                <Icon type="minus" />
              </StyledButton>
            )}
            <div
              style={{
                marginLeft: 10,
                marginRight: 10,
                display: 'inline',
                fontSize: '1rem'
              }}
            >
              {quantity}
            </div>
            {interactive && (
              <StyledButton>
                <Icon type="plus" />
              </StyledButton>
            )}
          </ButtonGroup>
        </div>
        <Avatar shape="square" size={72} src={this.props.image} />
        <div style={{ fontSize: '1rem' }} className="title">
          {name}
        </div>
        <div className="price">$ {price}</div>
      </StyledCard>
    );
  }
}
