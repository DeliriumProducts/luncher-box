import faker from 'faker';
import { Server } from 'http';
import request from 'supertest';
import { Connection, getRepository, Repository } from 'typeorm';
import { initServer } from '../src';
import { dbConnection as getDbConnection } from '../src/connections';
import { Category, Product, User } from '../src/entities';

let server: Server;
let dbConnection: Connection;
let productRepository: Repository<Product>;
let categoryRepository: Repository<Category>;
let cookie: string;

beforeAll(async () => {
  server = await initServer();
  dbConnection = await getDbConnection();
  productRepository = getRepository(Product);
  categoryRepository = getRepository(Category);

  const { body: confirmationURL } = await request(server)
    .post('/auth/register')
    .send(userCredentials);

  await request(server).get(confirmationURL);

  const { header } = await request(server)
    .post('/auth/login')
    .send(userCredentials);

  cookie = header['set-cookie'][0].split(/,(?=\S)/).map((item: string) => item.split(';')[0]);
});

const userCredentials: Partial<User> = {
  name: faker.name.findName(),
  email: faker.internet.exampleEmail(),
  password: 'FAKEpassword123'
};

describe('Valid categories', () => {
  it('adds valid categories to the database', async () => {
    const category: Partial<Category> = {
      name: 'Burgers',
      image: 'https://image.com/image.com'
    };

    const { body } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(200);

    expect(body).toMatchObject(category);

    const categories = await categoryRepository.find();
    expect(categories).toEqual(expect.arrayContaining([expect.objectContaining(category)]));
  });
});

describe('Invalid categories', async () => {
  it('throws an error when adding a category with an invalid name', async () => {
    const category: Partial<Category> = {
      name: 'Bu',
      image: 'https://image.com/image.com'
    };

    const { body } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(400);

    expect(body).toEqual({
      errors: ['name must be longer than or equal to 3 characters'],
      name: 'NotValidError',
      message: 'Category not valid!'
    });

    const categories = await categoryRepository.find();
    expect(categories).not.toEqual(expect.arrayContaining([expect.objectContaining(category)]));
  });
  it('throws an error when adding a category with an invalid image', async () => {
    const category: Partial<Category> = {
      name: 'Burgers',
      image: 'not-a-url'
    };

    const { body } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(400);

    expect(body).toEqual({
      errors: ['image must be an URL address'],
      name: 'NotValidError',
      message: 'Category not valid!'
    });

    const categories = await categoryRepository.find();
    expect(categories).not.toEqual(expect.arrayContaining([expect.objectContaining(category)]));
  });
  it('throws an error when adding a category with all fields invalid', async () => {
    const category: Partial<Category> = {
      name: 'ba',
      image: 'anoter-not-a-url'
    };

    const { body } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(400);

    expect(body).toEqual({
      errors: ['name must be longer than or equal to 3 characters', 'image must be an URL address'],
      name: 'NotValidError',
      message: 'Category not valid!'
    });

    const categories = await categoryRepository.find();
    expect(categories).not.toEqual(expect.arrayContaining([expect.objectContaining(category)]));
  });
  it('throws an error when adding a category with an empty name', async () => {
    const category: Partial<Category> = {
      name: '',
      image: 'https://image.com/image.com'
    };

    const { body } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(400);

    expect(body).toEqual({
      errors: ['name must be longer than or equal to 3 characters'],
      name: 'NotValidError',
      message: 'Category not valid!'
    });

    const categories = await categoryRepository.find();
    expect(categories).not.toEqual(expect.arrayContaining([expect.objectContaining(category)]));
  });
  it('throws an error when adding a category with an empty image', async () => {
    const category: Partial<Category> = {
      name: 'Burgers',
      image: ''
    };

    const { body } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(400);

    expect(body).toEqual({
      errors: [
        'image must be longer than or equal to 5 characters',
        'image must be an URL address'
      ],
      name: 'NotValidError',
      message: 'Category not valid!'
    });

    const categories = await categoryRepository.find();
    expect(categories).not.toEqual(expect.arrayContaining([expect.objectContaining(category)]));
  });
  it('throws an error when adding a category with all fields empty', async () => {
    const category: Partial<Category> = {
      name: '',
      image: ''
    };

    const { body } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(400);

    expect(body).toEqual({
      errors: [
        'name must be longer than or equal to 3 characters',
        'image must be longer than or equal to 5 characters',
        'image must be an URL address'
      ],
      name: 'NotValidError',
      message: 'Category not valid!'
    });

    const categories = await categoryRepository.find();
    expect(categories).not.toEqual(expect.arrayContaining([expect.objectContaining(category)]));
  });
});

describe('Valid products', async () => {
  it('adds valid products to the database', async () => {
    const category: Partial<Category> = {
      name: 'Soups',
      image: 'https://image.com/image.com'
    };

    const { body } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category);

    category.id = body.id;

    const product: Partial<Product> = {
      name: 'Chicken Soup',
      description: `It's tasty and it has chicken`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const { body: body1 } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(200);

    expect(body1).toMatchObject(product);

    const products = await productRepository.find({ relations: ['categories'] });

    expect(products).toEqual(expect.arrayContaining([expect.objectContaining(product)]));
  });
});

afterAll(async () => {
  await dbConnection.close();
});
