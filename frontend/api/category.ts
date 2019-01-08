import axios from 'axios';
import { Category } from '../interfaces';
import { BACKEND_URL } from './../config';

export class CategoryAPI {
  static opts = {
    withCredentials: true
  };

  static async getAll(
    opts: { since?: number; page?: number; limit?: number } = {}
  ) {
    if (!opts.limit) {
      opts.limit = 0;
    }

    if (opts.since) {
      const categories: Category[] = (await axios.get(
        `${BACKEND_URL}/categories?since=${opts.since}&limit=${opts.limit}`
      )).data;

      return categories;
    }

    if (opts.page) {
      const categories: Category[] = (await axios.get(
        `${BACKEND_URL}/categories?page=${opts.page}&limit=${opts.limit}`
      )).data;

      return categories;
    } else {
      const categories: Category[] = (await axios.get(
        `${BACKEND_URL}/categories?limit=${opts.limit}`
      )).data;

      return categories;
    }
  }

  static async getOne({ id }: Category, relations: boolean) {
    let category: Category;
    if (relations) {
      category = (await axios.get(
        `${BACKEND_URL}/categories/${id}?relations=1`
      )).data;
    } else {
      category = (await axios.get(`${BACKEND_URL}/categories/${id}`)).data;
    }

    return category;
  }

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
}
