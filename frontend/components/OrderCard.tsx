import { Component } from 'react';
import { Collapse, Button } from 'antd';
import styled from 'styled-components';

interface Props {
  orderId: number;
  children: React.ReactNode[] | React.ReactNode;
}

const customPanelStyle = {
  background: '#fff',
  borderRadius: 7,
  marginBottom: 8,
  border: 0,
  boxShadow: '0 2px 2px rgba(0,0,0,0.12)'
};

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
      <span className="title">Table №{orderId}</span>
      <span className="right">
        <Button shape="circle" type="default" icon="check" />
        <Button shape="circle" type="default" icon="close" />
      </span>
    </FlexSpan>
  );
};

class OrderCard extends Component<Props> {
  render() {
    const { orderId } = this.props;
    return (
      <Collapse bordered={false} accordion={false}>
        <Collapse.Panel
          key="1"
          header={<OrderCardHeader orderId={orderId} />}
          style={customPanelStyle}
        >
          this is where the actual product components will be
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default OrderCard;
