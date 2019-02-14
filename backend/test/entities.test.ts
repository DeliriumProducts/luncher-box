import faker from 'faker';
import { Server } from 'http';
import request from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { initServer } from '../src';
import { Category, Product, User } from '../src/entities';

let server: Server;
let productRepository: Repository<Product>;
let categoryRepository: Repository<Category>;

const userCredentials: Partial<User> = {
  name: faker.name.findName(),
  email: faker.internet.exampleEmail(),
  password: 'FAKEpassword123'
};

beforeAll(async () => {
  server = await initServer();
  productRepository = getRepository(Product);
  categoryRepository = getRepository(Category);

  beforeAll(async () => {
    await request(server)
      .post('/auth/register')
      .send(userCredentials);
  });
});

describe('Creating Categories', () => {
  xit('adds valid categories to the database', async () => {
    const category: Partial<Category> = {
      name: 'Burgers',
      image: 'https://image.com/image.com'
    };
  });
});
