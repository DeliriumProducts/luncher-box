import { Button, Card, Modal } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { CartContext } from '../context';
import { Product } from '../interfaces';
import PriceBadge from './PriceBadge';

const { Meta } = Card;

const StyledCard = styled(Card)`
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 8px 4px 0 4px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
  flex-basis: 16rem;
  padding-bottom: 0;

  .ant-card-body {
    padding-top: 0;
    height: 100%;
  }

  & img {
    border-radius: 7px 7px 0 0;
    object-fit: cover;
    width: 100%;
    height: 16rem;
  }

  @media (max-width: 768px) {
    border-bottom: 1px solid;
    border-bottom-color: rgb(210, 210, 210);
    box-shadow: none;
    margin: 8px 0 0 0;
    flex-basis: 100%;
  }

  .ant-card-actions {
    background-color: #fff;
    border-top-color: rgb(210, 210, 210);
    border-radius: 0 0 7px 7px;
  }
`;

const StyledMeta = styled(Meta)`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  height: 100%;
  & * {
    white-space: initial;
    overflow-wrap: normal;
  }
`;

interface Props {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

const ViewMoreButton: any = styled(Button)`
  border: none;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12);
`;

const addDots = (str: string, limit: number) => {
  if (str.length > limit) {
    return [str.substring(0, limit) + '...', true];
  }

  return [str, false];
};

export default class extends React.Component<Props> {
  static contextType = CartContext;
  context!: React.ContextType<typeof CartContext>;

  viewMore = () => {
    Modal.info({
      title: this.props.name,
      content: (
        <div>
          <p>{this.props.description}</p>
          <strong>{this.props.price} / piece</strong>
        </div>
      ),
      // tslint:disable-next-line
      onOk() {},
      maskClosable: true
    });
  };

  addToCart = () => {
    const product: Product = this.props;
    this.context.actions.increment(product);
  };

  render() {
    const { name, description, price, image } = this.props;

    const [shortName, readMoreName] = addDots(name, 50);
    const [shortDesc, readMoreDesc] = addDots(description, 150);

    return (
      <StyledCard
        bordered={false}
        cover={
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                display: 'flex'
              }}
            >
              <PriceBadge
                style={{
                  zIndex: 0,
                  marginLeft: 10,
                  marginTop: 10,
                  boxShadow: '0 2px 2px rgba(0, 0, 0, 0.12)'
                }}
                offset={[0, 0]}
                overflowCount={1000}
                count={price && `${price} / piece`}
              />
            </div>
            <img alt="example" src={image} />
            <Button
              style={{
                width: 44,
                height: 44,
                position: 'relative',
                bottom: 22,
                border: 'none',
                boxShadow: '0 2px 2px rgba(0, 0, 0, 0.12)'
              }}
              icon="plus"
              shape="circle"
              onClick={this.addToCart}
            />
          </div>
        }
        actions={
          /**
           * There is no need to render any buttons if the text can fit normally
           */
          readMoreDesc || readMoreName
            ? [
                <ViewMoreButton
                  size="small"
                  icon="info"
                  onClick={this.viewMore}
                >
                  View more
                </ViewMoreButton>
              ]
            : []
        }
      >
        <StyledMeta title={shortName} description={<p>{shortDesc}</p>} />
      </StyledCard>
    );
  }
}
