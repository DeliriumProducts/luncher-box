import { Authorized, Get, JsonController, Param, Put } from 'routing-controllers';
import { MessageBody, OnMessage, SocketController, SocketId } from 'socket-controllers';
import { EntityError } from 'src/types';
import { getRepository, In, Repository } from 'typeorm';
import { io } from '../config';
import { redisConnection } from '../connections';
import { Product } from '../entities';
import { Order, OrderNotFoundError, OrderNotValidError } from '../interfaces';

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
   * PUT /orders/accept/:orderId
   *
   * Accepts an order based on the query params
   * @param orderId
   */
  @Put('/accept/:orderId')
  @Authorized()
  async accept(@Param('orderId') orderId: number) {
    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

    let orders: Order[] = [];
    let order = {};

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      orders = orders.map(o => {
        if (o.id === orderId) {
          if (o.state !== 1) {
            o.state = 1;
          } else {
            throw new OrderNotFoundError();
          }
          order = o;
        }
        return o;
      });
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
   * PUT /orders/decline/:orderId
   *
   * Declines an order based on the query params
   * @param orderId
   */
  @Put('/decline/:orderId')
  @Authorized()
  async decline(@Param('orderId') orderId: number) {
    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

    let orders: Order[] = [];
    let order = {};

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      orders = orders.filter(o => {
        if (o.id === orderId) {
          order = o;
        }

        return o.id !== orderId;
      });
    }

    await redisConnection.set(key, JSON.stringify(orders));

    io
      // @ts-ignore
      .to(order.customerId)
      .emit('declined_order', order);
    io.emit('declined_order_admin', order);

    return 'Order declined!';
  }

  /**
   * PUT /orders/finish/:orderId
   *
   * Finishes an order based on the query params
   * @param orderId
   */
  @Put('/finish/:orderId')
  @Authorized()
  async finish(@Param('orderId') orderId: number) {
    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

    let orders: Order[] = [];
    let order = {};

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      orders = orders.map(o => {
        if (o.id === orderId) {
          if (o.state !== 2) {
            o.state = 2;
          } else {
            throw new OrderNotFoundError();
          }
          order = o;
        }
        return o;
      });
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
   * Socket Emit place_order
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

    if (ordersJSON && ordersJSON !== '[]') {
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
