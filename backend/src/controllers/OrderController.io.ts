/* istanbul ignore file */
import { TransformValidationOptions } from 'class-transformer-validator';
import { JsonController } from 'routing-controllers';
import { MessageBody, OnMessage, SocketController, SocketId } from 'socket-controllers';
import { getRepository, In, Repository } from 'typeorm';
import { io } from '../config';
import { Order, OrderNotValidError, OrderProduct, Product, Table } from '../entities';
import { QueryResponse, TransformAndValidateTuple } from '../types';
import { transformAndValidate } from '../utils';

@SocketController()
@JsonController('/orders')
export class OrderController {
  private productRepository: Repository<Product>;
  private tableRepository: Repository<Table>;
  private orderRepository: Repository<Order>;
  private transformAndValidateOrder: (
    obj: object | Array<{}>,
    options?: TransformValidationOptions
  ) => TransformAndValidateTuple<Order>;

  /**
   * Load the Product repository
   */
  constructor() {
    this.productRepository = getRepository(Product);
    this.tableRepository = getRepository(Table);
    this.orderRepository = getRepository(Order);
    this.transformAndValidateOrder = transformAndValidate(Order);
  }

  // @OnMessage('socket-connect')
  // connect(@MessageBody() message: string) {
  //   io.emit('socket-connected', message);
  // }

  // /**
  //  * GET /orders
  //  *
  //  * Gets all orders
  //  */
  // @Get()
  // @Authorized()
  // async getAll() {
  //   const key = 'orders';
  //   const ordersJSON = await redisConnection.get(key);

  //   let orders: Order[] = [];

  //   if (ordersJSON) {
  //     orders = JSON.parse(ordersJSON);
  //   }

  //   /**
  //    * Emit all of the orders to the client
  //    */
  //   return orders;
  // }

  // /**
  //  * PUT /orders/accept/:orderId
  //  *
  //  * Accepts an order based on the query params
  //  * @param orderId
  //  */
  // @Put('/accept/:orderId')
  // @Authorized('Waiter')
  // async accept(@Param('orderId') orderId: string) {
  //   const key = 'orders';
  //   const ordersJSON = await redisConnection.get(key);

  //   let orders: Order[] = [];
  //   let order: Partial<Order> = {};

  //   if (ordersJSON) {
  //     orders = JSON.parse(ordersJSON);

  //     orders = orders.map(o => {
  //       if (o.id === orderId) {
  //         if (o.state !== 1) {
  //           o.state = 1;
  //         } else {
  //           throw new OrderNotFoundError();
  //         }

  //         o.accepted = new Date();
  //         order = o;
  //       }

  //       return o;
  //     });
  //   }

  //   await redisConnection.set(key, JSON.stringify(orders));

  //   io
  //     // @ts-ignore
  //     .to(order.customerId)
  //     .emit('accepted-order', order);
  //   io.emit('accepted-order-admin', order);

  //   return order;
  // }

  // /**
  //  * PUT /orders/decline/:orderId
  //  *
  //  * Declines an order based on the query params
  //  * @param orderId
  //  */
  // @Put('/decline/:orderId')
  // @Authorized('Waiter')
  // async decline(@Param('orderId') orderId: string) {
  //   const key = 'orders';
  //   const ordersJSON = await redisConnection.get(key);

  //   let orders: Order[] = [];
  //   let order: Partial<Order> = {};

  //   if (ordersJSON) {
  //     orders = JSON.parse(ordersJSON);

  //     orders = orders.map(o => {
  //       if (o.id === orderId) {
  //         if (o.state !== 3) {
  //           o.state = 3;
  //         } else {
  //           throw new OrderNotFoundError();
  //         }

  //         o.declined = new Date();
  //         order = o;
  //       }

  //       return o;
  //     });
  //   }

  //   await redisConnection.set(key, JSON.stringify(orders));

  //   // @ts-ignore
  //   order.state = 3;

  //   io
  //     // @ts-ignore
  //     .to(order.customerId)
  //     .emit('declined-order', order);
  //   io.emit('declined-order-admin', order);

  //   return 'Order declined!';
  // }

  // /**
  //  * PUT /orders/finish/:orderId
  //  *
  //  * Finishes an order based on the query params
  //  * @param orderId
  //  */
  // @Put('/finish/:orderId')
  // @Authorized('Cook')
  // async finish(@Param('orderId') orderId: string) {
  //   const key = 'orders';
  //   const ordersJSON = await redisConnection.get(key);

  //   let orders: Order[] = [];
  //   let order: Partial<Order> = {};

  //   if (ordersJSON) {
  //     orders = JSON.parse(ordersJSON);

  //     orders = orders.map(o => {
  //       if (o.id === orderId) {
  //         if (o.state !== 2) {
  //           o.state = 2;
  //         } else {
  //           throw new OrderNotFoundError();
  //         }

  //         o.finished = new Date();
  //         order = o;
  //       }

  //       return o;
  //     });
  //   }

  //   await redisConnection.set(key, JSON.stringify(orders));

  //   io
  //     // @ts-ignore
  //     .to(order.customerId)
  //     .emit('finished-order', order);
  //   io.emit('finished-order-admin', order);

  //   return order;
  // }

  /**
   * Socket Emit place-order
   *
   * Places an order based on the socket's message body
   * @param socketId
   * @param order
   */
  @OnMessage('place-order')
  async place(@SocketId() socketId: string, @MessageBody() orderJSON: Order) {
    const [order, orderErr] = await this.transformAndValidateOrder(orderJSON);
    let syncedProducts: QueryResponse<Product[]> = [];

    if (!order.products) {
      orderErr.push('products not found');
    } else {
      /**
       * Sync products from frontend with products from database
       */
      syncedProducts = await this.productRepository.find({
        where: {
          // @ts-ignore
          id: In(order.products.map(({ id }: Product) => id))
        }
      });

      if (!syncedProducts.length) {
        orderErr.push('products not found');
      }
    }

    if (!order.table) {
      orderErr.push('table not found');
    } else {
      /**
       * Make sure the table exists
       */
      const table = await this.tableRepository.findOne({
        where: {
          name: order.table
        }
      });

      if (!table) {
        orderErr.push('table not found');
      } else {
        order.table = table;
      }
    }

    if (orderErr.length) {
      io.to(socketId).emit('placed-order-fail', new OrderNotValidError(orderErr));
      return;
    }

    const orderProducts: OrderProduct[] = [];

    /**
     * Attach quantity to synced products
     */
    for (const syncedProduct of syncedProducts) {
      for (const orderProduct of order.products) {
        // @ts-ignore
        if (syncedProduct.id === orderProduct.id) {
          const op = new OrderProduct();

          op.order = order;
          op.product = syncedProduct;
          op.quantity = orderProduct.quantity;

          orderProducts.push(op);
        }
      }
    }

    order.products = orderProducts;
    order.customerId = socketId;
    order.state = 0;
    order.placed = new Date();
    order.accepted = new Date(0);
    order.declined = new Date(0);
    order.finished = new Date(0);

    await this.orderRepository.save(order);

    // io.emit('placed-order-admin', orders);
    io.to(socketId).emit('placed-order', order);
  }

  // /**
  //  * Socket Emit update-customer-id
  //  *
  //  * Updates the customer id based on the new orders
  //  * @param orderIds
  //  */
  // @OnMessage('update-customerId')
  // async updateCustomerId(@SocketId() socketId: string, @MessageBody() orderIds: string[]) {
  //   const key = 'orders';
  //   const ordersJSON = await redisConnection.get(key);

  //   let orders: Order[] = [];
  //   const customerOrders: Order[] = [];

  //   if (ordersJSON) {
  //     orders = JSON.parse(ordersJSON);

  //     orders = orders.map(o => {
  //       if (orderIds.includes(o.id)) {
  //         const newOrder = {
  //           ...o,
  //           customerId: socketId
  //         };

  //         customerOrders.push(newOrder);

  //         return newOrder;
  //       }

  //       return o;
  //     });
  //   }

  //   customerOrders.sort((o1, o2) => {
  //     if (new Date(o1.placed!) > new Date(o2.placed!)) {
  //       return -1;
  //     } else {
  //       return 1;
  //     }
  //   });

  //   await redisConnection.set(key, JSON.stringify(orders));

  //   io.to(socketId).emit('updated-customerId', customerOrders);
  // }
}
