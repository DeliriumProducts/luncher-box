import { Button, message } from 'antd';
import React from 'react';
import { AdminContext } from '../context';
import { FlexSpan } from './OrderContainer';

interface Props {
  orderId: number;
  orderTable: string;
  orderState?: number;
}

class OrderCardHeader extends React.Component<Props> {
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

  handleAccept = (e: React.FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const { orderId } = this.props;

    if (this.context.socket) {
      this.context.socket.emit('accept_order', orderId);
      message.success(`Successfully accepted order ${orderId + 1} 🎉`);
    }
  };

  handleDecline = (e: React.FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const { orderId } = this.props;

    if (this.context.socket) {
      this.context.socket.emit('decline_order', orderId);
      message.success(`Successfully declined order ${orderId + 1} 🎉`);
    }
  };

  handleFinish = (e: React.FormEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const { orderId } = this.props;

    if (this.context.socket) {
      this.context.socket.emit('finish_order', orderId);
      message.success(`Successfully finished order ${orderId + 1} 🎉`);
    }
  };

  render() {
    const { orderState } = this.props;
    let data: React.ReactNode;

    if (orderState === 0) {
      data = (
        <>
          <span className="title">Table № {this.props.orderTable}</span>
          <span className="right">
            <Button
              onClick={this.handleAccept}
              shape="circle"
              type="default"
              icon="check"
            />
            <Button
              onClick={this.handleDecline}
              shape="circle"
              type="default"
              icon="close"
            />
          </span>
        </>
      );
    } else if (orderState === 1) {
      data = (
        <>
          <span className="title">Table № {this.props.orderTable} </span>
          <span className="right">
            <Button
              shape="circle"
              onClick={this.handleFinish}
              type="default"
              icon="flag"
            />
          </span>
        </>
      );
    } else {
      data = <span className="title">Order finished!</span>;
    }

    return <FlexSpan>{data}</FlexSpan>;
  }
}

export default OrderCardHeader;
