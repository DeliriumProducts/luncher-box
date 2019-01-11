import {
  ConnectedSocket,
  MessageBody,
  OnConnect,
  OnMessage,
  SocketController,
  SocketIO,
  EmitOnSuccess,
  EmitOnFail
} from 'socket-controllers';
import { redisClient } from '../config';

@SocketController()
export class OrderController {
  @OnConnect()
  async connection(@SocketIO() io: SocketIO.Socket) {
    const key = 'orders';
    const ordersJSON = await redisClient.get(key);

    let orders = [];

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);
    }

    /**
     * Emit all of the orders to the client
     */
    io.emit('fetched_orders', orders);
  }

  @OnMessage('place_order')
  async place(@SocketIO() io: SocketIO.Socket, @MessageBody() order: any) {
    /**
     * Attach state of the order
     */
    order.state = 0;

    const key = 'orders';
    const ordersJSON = await redisClient.get(key);

    let orders = [];

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      /**
       * Attach id to order
       */
      const id = orders.length;
      order.id = id;

      orders.push(order);
    } else {
      /**
       * Attach id to order
       */
      const id = orders.length;
      order.id = id;

      orders = [order];
    }

    /**
     * Save orders in redis server
     */
    await redisClient.set(key, JSON.stringify(orders));

    /**
     * Emit the new orders back to the client
     */
    io.emit('placed_order', orders);
  }

  @OnMessage('accept_order')
  async accept(@SocketIO() io: SocketIO.Socket, @MessageBody() orderId: number) {
    const key = 'orders';
    const ordersJSON = await redisClient.get(key);

    let orders = [];

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      const orderIndex = orders.findIndex((orderItem: any) => orderItem.id === orderId);
      orders[orderIndex].state = 1;
    }

    io.emit('accepted_order');
  }

  @OnMessage('decline_order')
  async decline(@SocketIO() io: SocketIO.Socket, @MessageBody() orderId: number) {
    const key = 'orders';
    const ordersJSON = await redisClient.get(key);

    let orders = [];

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      const orderIndex = orders.findIndex((orderItem: any) => orderItem.id === orderId);
      orders[orderIndex].state = 2;
    }

    io.emit('declined_order');
  }
}
