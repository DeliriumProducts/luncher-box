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

describe('Creating valid categories', () => {
  it('creates a valid category to the database', async () => {
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

describe('Not creating invalid categories', async () => {
  it('throws an error when creating a category with an invalid name', async () => {
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

  it('throws an error when creating a category with an invalid image', async () => {
    const category: Partial<Category> = {
      name: 'ValidName',
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

  it('throws an error when creating a category with all fields invalid', async () => {
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
});

describe('Deleting categories', () => {
  it('deletes an existing category from the database', async () => {
    const category: Partial<Category> = {
      name: 'to-be-deleted',
      image: 'https://image.com/image.com'
    };

    const {
      body: { id }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(200);

    const { body } = await request(server)
      .delete(`/categories/${id}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body).toEqual('Category deleted!');

    const categories = await categoryRepository.find();
    expect(categories).toEqual(expect.not.arrayContaining([expect.objectContaining(category)]));
  });
});

describe('Not deleting categories', () => {
  it('throws an error when deleting a non-existing category from the database', async () => {
    const { body } = await request(server)
      .delete(`/categories/${-420}`)
      .set('Cookie', cookie)
      .expect(404);

    expect(body).toEqual({
      name: 'NotFoundError',
      message: 'Category not found!'
    });
  });
});

describe('Creating valid products', async () => {
  it('creates a valid product to the database', async () => {
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

describe('Not creating invalid products', async () => {
  let category: Partial<Category>;

  beforeAll(async () => {
    category = {
      name: 'Soups',
      image: 'https://image.com/image.com'
    };

    const { body } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category);

    category.id = body.id;
  });

  it('throws an errors when creating a product with an invalid name', async () => {
    const product: Partial<Product> = {
      name: 'ab',
      description: `It's invalid, sorta`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(400);

    expect(body).toEqual({
      errors: ['name must be longer than or equal to 3 characters'],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const products = await productRepository.find({ relations: ['categories'] });

    expect(products).not.toEqual(expect.arrayContaining([expect.objectContaining(product)]));
  });

  it('throws an errors when creating a product with an invalid description', async () => {
    const product: Partial<Product> = {
      name: 'Chicken',
      description: 'inv',
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(400);

    expect(body).toEqual({
      errors: ['description must be longer than or equal to 5 characters'],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const products = await productRepository.find({ relations: ['categories'] });

    expect(products).not.toEqual(expect.arrayContaining([expect.objectContaining(product)]));
  });

  it('throws an errors when creating a product with an invalid image', async () => {
    const product: Partial<Product> = {
      name: 'Chicken',
      description: 'Good description',
      image: 'bad-url',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(400);

    expect(body).toEqual({
      errors: ['image must be an URL address'],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const products = await productRepository.find({ relations: ['categories'] });

    expect(products).not.toEqual(expect.arrayContaining([expect.objectContaining(product)]));
  });

  it('throws an errors when creating a product with an invalid image', async () => {
    const product: Partial<Product> = {
      name: 'Chicken',
      description: 'Good description',
      image: 'bad-url',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(400);

    expect(body).toEqual({
      errors: ['image must be an URL address'],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const products = await productRepository.find({ relations: ['categories'] });

    expect(products).not.toEqual(expect.arrayContaining([expect.objectContaining(product)]));
  });

  it('throws an errors when creating a product with an invalid price', async () => {
    const product: Partial<Product> = {
      name: 'Chicken',
      description: 'Good description',
      image: 'https://image.com/image.com',
      price: -13234234,
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(400);

    expect(body).toEqual({
      errors: ['price must not be less than 0'],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const products = await productRepository.find({ relations: ['categories'] });

    expect(products).not.toEqual(expect.arrayContaining([expect.objectContaining(product)]));
  });

  it('throws an errors when creating a product with invalid categories', async () => {
    const product: Partial<Product> = {
      name: 'Chicken',
      description: 'Good description',
      image: 'https://image.com/image.com',
      price: 5.0,
      // @ts-ignore
      categories: [
        {
          id: -54545,
          name: 'b',
          image: 'ff'
        }
      ]
    };

    const { body } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(400);

    expect(body).toEqual({
      errors: ['categories must be created beforehand'],
      message: 'Product not valid!',
      name: 'NotValidError'
    });

    const products = await productRepository.find({ relations: ['categories'] });

    expect(products).not.toEqual(expect.arrayContaining([expect.objectContaining(product)]));
  });

  it('throws an errors when creating a product with all fields invalid', async () => {
    const product: Partial<Product> = {
      name: 'Ab',
      description: 'Ab',
      image: 'not-a-url',
      price: -13234234,
      // @ts-ignore
      categories: [
        {
          id: -54545,
          name: 'b',
          image: 'ff'
        }
      ]
    };

    const { body } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(400);

    expect(body).toEqual({
      errors: [
        'name must be longer than or equal to 3 characters',
        'description must be longer than or equal to 5 characters',
        'image must be an URL address',
        'price must not be less than 0',
        'categories must be created beforehand'
      ],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const products = await productRepository.find({ relations: ['categories'] });

    expect(products).not.toEqual(expect.arrayContaining([expect.objectContaining(product)]));
  });
});

describe('Deleting products', () => {
  it('deletes an existing product from the database', async () => {
    const category: Partial<Category> = {
      name: 'useless',
      image: 'https://image.com/image.com'
    };

    const { body } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(200);

    category.id = body.id;

    const product: Partial<Product> = {
      name: 'to-be-deleted',
      description: 'good-desc',
      image: 'https://image.com/image.com',
      price: 5.99,
      // @ts-ignore
      categories: [category]
    };

    const {
      body: { id }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(200);

    const { body: body1 } = await request(server)
      .delete(`/products/${id}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body1).toEqual('Product deleted!');

    const products = await categoryRepository.find();
    expect(products).toEqual(expect.not.arrayContaining([expect.objectContaining(product)]));
  });
});

describe('Not deleting products', () => {
  it('throws an error when deleting a non-existing product from the database', async () => {
    const { body } = await request(server)
      .delete(`/products/${-420}`)
      .set('Cookie', cookie)
      .expect(404);

    expect(body).toEqual({
      name: 'NotFoundError',
      message: 'Product not found!'
    });
  });
});

describe('Authorization', async () => {
  it('throws an error when creating a category when not logged in', async () => {
    const category: Partial<Category> = {
      name: 'even-badder-examplers',
      image: 'https://image.com/image.com'
    };

    const { body } = await request(server)
      .post('/categories')
      .send(category)
      .expect(401);

    expect(body).toEqual({
      name: 'AuthorizationRequiredError',
      message: 'Authorization is required for request on POST /categories'
    });

    const categories = await categoryRepository.find();
    expect(categories).not.toEqual(expect.arrayContaining([expect.objectContaining(category)]));
  });

  it('throws an error when creating a product when not logged in', async () => {
    const product: Partial<Product> = {
      name: 'very-bad-example123>_>',
      description: `very-good-example123<_>`,
      image: 'https://image.com/product.com',
      price: 5.0,
      categories: []
    };

    const { body } = await request(server)
      .post('/products')
      .send(product)
      .expect(401);

    expect(body).toEqual({
      name: 'AuthorizationRequiredError',
      message: 'Authorization is required for request on POST /products'
    });

    const products = await categoryRepository.find();
    expect(products).not.toEqual(expect.arrayContaining([expect.objectContaining(product)]));
  });
});

afterAll(async () => {
  await dbConnection.close();
});
