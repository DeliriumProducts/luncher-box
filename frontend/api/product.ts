import axios from 'axios';
import { BACKEND_URL } from './../config';
import { Product } from '../types';

export class ProductAPI {
  static opts = {
    withCredentials: true
  };

  static async create(product: Product) {
    const response = await axios.post(
      `${BACKEND_URL}/products`,
      product,
      this.opts
    );

    return response;
  }

  static async edit(product: Product) {
    const { id } = product;
    const response = await axios.put(
      `${BACKEND_URL}/products/${id}`,
      product,
      this.opts
    );

    return response;
  }

  static async delete({ id }: Product) {
    const response = await axios.delete(
      `${BACKEND_URL}/products/${id}`,
      this.opts
    );

    return response;
  }

  static async getAll() {
    const products: Product[] = (await axios.get(`${BACKEND_URL}/products`))
      .data;

    return products;
  }

  static async getOne({ id }: Product) {
    const product: Product = (await axios.get(`${BACKEND_URL}/products/${id}`))
      .data;

    return product;
  }
}
