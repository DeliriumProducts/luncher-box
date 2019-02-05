import faker from 'faker';
import { Server } from 'http';
import request from 'supertest';
import { getRepository, Repository } from 'typeorm';
import { initServer } from '../src';
import { Category, Product, User } from '../src/entities';

let server: Server;
let productRepository: Repository<Product>;
const userCredentials: Partial<User> = {
  name: faker.name.findName(),
  email: faker.internet.exampleEmail(),
  password: 'FAKEpassword123'
};

beforeAll(async () => {
  server = await initServer();
  productRepository = getRepository(Product);

  beforeAll(async () => {
    await request(server)
      .post('/auth/register')
      .send(userCredentials);
  });
});

describe('Creating Categories', () => {
  it('adds valid categories to the database', async () => {
    const category: Partial<Category> = {
      name: 'Burgers',
      image: 'https://image.com/image.com'
    };
  });
});
