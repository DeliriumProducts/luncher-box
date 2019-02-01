import { MessageBody, OnMessage, SocketController, SocketIO, SocketId } from 'socket-controllers';
import { redisConnection } from '../connections';
import { getRepository, Repository, In } from 'typeorm';
import { Product } from '../entities';

@SocketController()
export class OrderController {
  private productRepository: Repository<Product>;

  /**
   * Load the Product repository
   */
  constructor() {
    this.productRepository = getRepository(Product);
  }

  @OnMessage('fetch_orders')
  async connection(@SocketIO() io: SocketIO.Socket) {
    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

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
  async place(
    @SocketIO() io: SocketIO.Socket,
    @SocketId() socketId: string,
    @MessageBody() order: any
  ) {
    /**
     * Attach state of the order
     */
    order.state = 0;

    /**
     * Sync products from frontned with products from database
     */
    const syncedProducts = await this.productRepository.find({
      where: { id: In(order.products.map(({ id }: Product) => id)) }
    });

    /**
     * Attach quantity to synced products
     */
    for (const syncedProduct of syncedProducts) {
      for (const orderProduct of order.products) {
        if (syncedProduct.id === orderProduct.id) {
          // @ts-ignore
          syncedProduct.quantity = orderProduct.quantity;
        }
      }
    }

    order.products = syncedProducts;

    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

    let orders = [];

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      /**
       * Attach id to order
       */
      const id = orders[orders.length - 1].id + 1;
      order.id = id;

      /**
       * Attach sender id to order
       */
      order.senderId = socketId;

      orders.push(order);
    } else {
      /**
       * Attach id to order
       */
      const id = 0;
      order.id = id;

      /**
       * Attach sender id to order
       */
      order.senderId = socketId;

      orders = [order];
    }

    /**
     * Save orders in redis server
     */
    await redisConnection.set(key, JSON.stringify(orders));

    /**
     * Emit the new orders back to the client
     */
    io.emit('placed_order', orders);
  }

  @OnMessage('accept_order')
  async accept(
    @SocketIO() io: SocketIO.Socket,
    @SocketId() senderId: any,
    @MessageBody() orderId: number
  ) {
    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

    let orders = [];
    let order = {};

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      const orderIndex = orders.findIndex((orderItem: any) => orderItem.id === orderId);

      if (orderIndex >= 0) {
        orders[orderIndex].state = 1;
        order = orders[orderIndex];
      }
    }

    await redisConnection.set(key, JSON.stringify(orders));
    io
      // @ts-ignore
      .to(order.senderId)
      .emit('accepted_order', order);
    io.emit('accepted_order_admin', order);
  }

  @OnMessage('decline_order')
  async decline(
    @SocketIO() io: SocketIO.Socket,
    @SocketId() senderId: any,
    @MessageBody() orderId: number
  ) {
    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

    let orders = [];
    let order = {};

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      const orderIndex = orders.findIndex((orderItem: any) => orderItem.id === orderId);

      if (orderIndex >= 0) {
        order = orders[orderIndex];

        // @ts-ignore
        order.state = 3;
        orders.splice(orderIndex, 1);
      }

      if (orders.length - 1 > 0) {
        await redisConnection.set(key, JSON.stringify(orders));
      } else {
        await redisConnection.del(key);
      }
    }

    io
      // @ts-ignore
      .to(order.senderId)
      .emit('declined_order', order);
    io.emit('declined_order_admin', order);
  }

  @OnMessage('finish_order')
  async finish(
    @SocketIO() io: SocketIO.Socket,
    @SocketId() senderId: any,
    @MessageBody() orderId: number
  ) {
    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

    let orders = [];
    let order = {};

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      const orderIndex = orders.findIndex((orderItem: any) => orderItem.id === orderId);

      if (orderIndex >= 0) {
        orders[orderIndex].state = 2;
        order = orders[orderIndex];
      }
    }

    await redisConnection.set(key, JSON.stringify(orders));

    io
      // @ts-ignore
      .to(order.senderId)
      .emit('finished_order', order);
    io.emit('finished_order_admin', order);
  }
}
