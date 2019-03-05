import { MessageBody, OnMessage, SocketId, SocketIO, SocketController } from 'socket-controllers';
import { getRepository, In, Repository } from 'typeorm';
import { redisConnection } from '../connections';
import { Product } from '../entities';
import { Order, OrderNotValidError } from '../interfaces';
import { EntityError } from 'src/types';
import { Authorized, JsonController, Get, Put, Param, Body } from 'routing-controllers';
import { io } from '../config';

@SocketController()
@JsonController('/orders')
export class OrderController {
  private productRepository: Repository<Product>;

  /**
   * Load the Product repository
   */
  constructor() {
    this.productRepository = getRepository(Product);
  }

  /**
   * GET /orders
   *
   * Gets all orders
   */
  @Get()
  @Authorized()
  async getAll() {
    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

    let orders = [];

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);
    }

    /**
     * Emit all of the orders to the client
     */
    return orders;
  }

  /**
   * POST /orders/accept/:orderId
   *
   * Accepts an order based on the query params
   * @param orderId
   */
  @Put('/accept/:orderId')
  @Authorized()
  async accept(@Param('orderId') orderId: number) {
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
      .to(order.customerId)
      .emit('accepted_order', order);
    io.emit('accepted_order_admin', order);

    return order;
  }

  /**
   * POST /orders/decline/:orderId
   *
   * Declines an order based on the query params
   * @param orderId
   */
  @Put('/decline/:orderId')
  @Authorized()
  async decline(@Param('orderId') orderId: number) {
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
      .to(order.customerId)
      .emit('declined_order', order);
    io.emit('declined_order_admin', order);

    return 'Order declined!';
  }

  /**
   * POST /orders/finish/:orderId
   *
   * Finishes an order based on the query params
   * @param orderId
   */
  @Put('/finish/:orderId')
  @Authorized()
  async finish(@Param('orderId') orderId: number) {
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
      .to(order.customerId)
      .emit('finished_order', order);
    io.emit('finished_order_admin', order);

    return order;
  }

  /**
   *  Socket Emit place_order
   *
   * Places an order based on the socket's message body
   * @param order
   */
  @OnMessage('place_order')
  async place(@SocketId() socketId: string, @MessageBody() order: Order) {
    const orderErr: EntityError = [];

    /**
     * TODO:
     *
     * Implement table validation
     */
    if (!order.table || order.table === '') {
      orderErr.push('table not found');
    }

    /**
     * Sync products from frontend with products from database
     */
    const syncedProducts = await this.productRepository.find({
      where: { id: In(order.products.map(({ id }: Partial<Product>) => id)) }
    });

    if (!syncedProducts.length || !order.products.length || !order.products) {
      orderErr.push('products not found');
    }

    if (orderErr.length) {
      throw new OrderNotValidError(orderErr);
    }

    /**
     * Attach quantity to synced products
     */
    for (const syncedProduct of syncedProducts) {
      for (const orderProduct of order.products) {
        // @ts-ignore
        if (syncedProduct.id === orderProduct.id) {
          // @ts-ignore
          syncedProduct.quantity = orderProduct.quantity;
        }
      }
    }

    order.products = syncedProducts;

    /**
     * Attach state of the order
     */
    order.state = 0;

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
      order.customerId = socketId;

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
      order.customerId = socketId;

      orders = [order];
    }

    /**
     * Save orders in redis server
     */
    await redisConnection.set(key, JSON.stringify(orders));

    /**
     * Emit the new orders back to the clients
     */
    io.emit('placed_order', orders);
  }
}
