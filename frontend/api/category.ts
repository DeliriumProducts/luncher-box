import axios from 'axios';
import { BACKEND_URL } from './../config';
import { Category } from '../types';

export class CategoryAPI {
  static opts = {
    withCredentials: true
  };

  static async create(category: Category) {
    const response = await axios.post(
      `${BACKEND_URL}/categories`,
      category,
      this.opts
    );

    return response;
  }

  static async edit(category: Category) {
    const { id } = category;
    const response = await axios.put(
      `${BACKEND_URL}/categories/${id}`,
      category,
      this.opts
    );

    return response;
  }

  static async delete({ id }: Category) {
    const response = await axios.delete(
      `${BACKEND_URL}/categories/${id}`,
      this.opts
    );

    return response;
  }

  static async getAll(page: number, amount: number) {
    const categories: Category[] = (await axios.get(
      `${BACKEND_URL}/categories?page=${page}&amount=${amount}`
    )).data;

    return categories;
  }

  static async getOne({ id }: Category) {
    const category: Category = (await axios.get(
      `${BACKEND_URL}/categories/${id}`
    )).data;

    return category;
  }
}
