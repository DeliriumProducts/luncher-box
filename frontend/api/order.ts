import axios from 'axios';
import { Order } from '../interfaces';
import { BACKEND_URL } from './../config';

export class OrderAPI {
  static opts = {
    withCredentials: true
  };

  static async getAll() {
    const orders: Order[] = (await axios.get(`${BACKEND_URL}/orders`)).data;

    return orders;
  }

  static async accept(order: Order) {
    const { id } = order;

    const response = await axios.post(
      `${BACKEND_URL}/orders/accept/${id}`,
      this.opts
    );

    return response;
  }

  static async decline(order: Order) {
    const { id } = order;

    const response = await axios.post(
      `${BACKEND_URL}/orders/decline/${id}`,
      this.opts
    );

    return response;
  }

  static async finish(order: Order) {
    const { id } = order;

    const response = await axios.post(
      `${BACKEND_URL}/orders/finish/${id}`,
      this.opts
    );

    return response;
  }
}
