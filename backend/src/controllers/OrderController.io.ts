import { Authorized, Get, JsonController, Param, Put, QueryParam } from 'routing-controllers';
import { MessageBody, OnMessage, SocketController, SocketId } from 'socket-controllers';
import { EntityError } from 'src/types';
import { getRepository, In, Repository } from 'typeorm';
import { v4 } from 'uuid';
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

    let orders: Order[] = [];

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);
    }

    /**
     * Emit all of the orders to the client
     */
    return orders;
  }

  /**
   * GET /orders/specific
   *
   * Gets specific orders
   * @param orderIds
   */
  @Get('/specific')
  async getMany(@QueryParam('id') orderIds: string) {
    const key = 'orders';
    const orderJSON = await redisConnection.get(key);

    let orders: Order[] = [];

    if (orderJSON) {
      orders = JSON.parse(orderJSON);

      orders = orders.filter(o => orderIds.includes(o.id));
    }

    /**
     * Emit all of the requested orders to the client
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
  async accept(@Param('orderId') orderId: string) {
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
  async decline(@Param('orderId') orderId: string) {
    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

    let orders: Order[] = [];
    let order = {};

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      orders = orders.map(o => {
        if (o.id === orderId) {
          if (o.state !== 3) {
            o.state = 3;
          } else {
            throw new OrderNotFoundError();
          }
          order = o;
        }

        return o;
      });
    }

    await redisConnection.set(key, JSON.stringify(orders));

    // @ts-ignore
    order.state = 3;

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
  async finish(@Param('orderId') orderId: string) {
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
   * @param socketId
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

    let orders: Order[] = [];

    if (ordersJSON && ordersJSON !== '[]') {
      orders = JSON.parse(ordersJSON);

      /**
       * Attach id to order
       */
      const id = v4();
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
      const id = v4();
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
     * TODO: Emit to clients too
     *
     * Emit the new orders back to admins
     */
    io.emit('placed_order_admin', orders);
    console.log(order);
    io.to(order.customerId).emit('placed_order', order);
  }

  /**
   * Socket Emit update_customer_id
   *
   * Updates the customer id based on the new orders
   * @param orderIds
   */
  @OnMessage('update_customerId')
  async updateCustomerId(@SocketId() socketId: string, @MessageBody() orderIds: string[]) {
    const key = 'orders';
    const ordersJSON = await redisConnection.get(key);

    let orders: Order[] = [];
    const customerOrders: Order[] = [];

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);

      orders = orders.map(o => {
        if (orderIds.includes(o.id)) {
          const newOrder = {
            ...o,
            customerId: socketId
          };

          customerOrders.push(newOrder);

          return newOrder;
        }

        return o;
      });
    }

    await redisConnection.set(key, JSON.stringify(orders));

    io.to(socketId).emit('updated_customerId', customerOrders);
  }
}
