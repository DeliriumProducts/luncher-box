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

  const user: Partial<User> = {
    name: faker.name.findName(),
    email: faker.internet.exampleEmail(),
    password: 'FAKEpassword123'
  };

  const { body: confirmationURL } = await request(server)
    .post('/auth/register')
    .send(user);

  await request(server).get(confirmationURL);

  const { header } = await request(server)
    .post('/auth/login')
    .send(user);

  cookie = header['set-cookie'][0].split(/,(?=\S)/).map((item: string) => item.split(';')[0]);
});

describe('POST /categories', () => {
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

    const categoryQuery = await categoryRepository.findOne(body.id);

    expect(categoryQuery).toMatchObject(category);
  });

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

    const categoryQuery = await categoryRepository.findOne({ where: { ...category } });
    expect(categoryQuery).not.toBeDefined();
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

    const categoryQuery = await categoryRepository.findOne({ where: { ...category } });
    expect(categoryQuery).not.toBeDefined();
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

    const categoryQuery = await categoryRepository.findOne({ where: { ...category } });
    expect(categoryQuery).not.toBeDefined();
  });
});

describe('PUT /categories/:id', () => {
  it('edits a valid category from the database', async () => {
    const oldCategory: Partial<Category> = {
      name: 'Old Burgers',
      image: 'https://image.com/image.com'
    };

    const {
      body: { id: oldCategoryId }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(oldCategory)
      .expect(200);

    oldCategory.id = oldCategoryId;

    const editedCategory: Partial<Category> = {
      ...oldCategory,
      name: 'New Burgers',
      image: 'https://new-image.com/image.com'
    };

    const { body } = await request(server)
      .put(`/categories/${oldCategoryId}`)
      .set('Cookie', cookie)
      .send(editedCategory)
      .expect(200);

    expect(body).toEqual(editedCategory);

    const oldCategoryQuery = await categoryRepository.findOne(oldCategoryId);

    expect(oldCategoryQuery).toEqual(editedCategory);
  });

  it('throws an error when editing a category with an invalid name', async () => {
    const oldCategory: Partial<Category> = {
      name: 'Old Soups',
      image: 'https://image-soup.com/image.com'
    };

    const {
      body: { id: oldCategoryId }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(oldCategory)
      .expect(200);

    oldCategory.id = oldCategoryId;

    const editedCategory: Partial<Category> = {
      ...oldCategory,
      name: 'b',
      image: 'https://new-image.com/image.com'
    };

    const { body } = await request(server)
      .put(`/categories/${oldCategoryId}`)
      .set('Cookie', cookie)
      .send(editedCategory)
      .expect(400);

    expect(body).toEqual({
      errors: ['name must be longer than or equal to 3 characters'],
      message: 'Category not valid!',
      name: 'NotValidError'
    });

    const oldCategoryQuery = await categoryRepository.findOne(oldCategoryId);

    expect(oldCategoryQuery).not.toEqual(editedCategory);
  });

  it('throws an error when editing a category with an invalid image', async () => {
    const oldCategory: Partial<Category> = {
      name: 'Old Salads',
      image: 'https://image-soup.com/image.com'
    };

    const {
      body: { id: oldCategoryId }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(oldCategory)
      .expect(200);

    oldCategory.id = oldCategoryId;

    const editedCategory: Partial<Category> = {
      ...oldCategory,
      name: 'New Salads',
      image: 'not-a-good-url'
    };

    const { body } = await request(server)
      .put(`/categories/${oldCategoryId}`)
      .set('Cookie', cookie)
      .send(editedCategory)
      .expect(400);

    expect(body).toEqual({
      errors: ['image must be an URL address'],
      message: 'Category not valid!',
      name: 'NotValidError'
    });

    const oldCategoryQuery = await categoryRepository.findOne(oldCategoryId);

    expect(oldCategoryQuery).not.toEqual(editedCategory);
  });

  it('throws an error when editing a category with a all fields invalid', async () => {
    const oldCategory: Partial<Category> = {
      name: 'Old Salads',
      image: 'https://image-soup.com/image.com'
    };

    const {
      body: { id: oldCategoryId }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(oldCategory)
      .expect(200);

    oldCategory.id = oldCategoryId;

    const editedCategory: Partial<Category> = {
      ...oldCategory,
      name: 'bf',
      image: 'VERY-bad-URL'
    };

    const { body } = await request(server)
      .put(`/categories/${oldCategoryId}`)
      .set('Cookie', cookie)
      .send(editedCategory)
      .expect(400);

    expect(body).toEqual({
      errors: ['name must be longer than or equal to 3 characters', 'image must be an URL address'],
      message: 'Category not valid!',
      name: 'NotValidError'
    });

    const oldCategoryQuery = await categoryRepository.findOne(oldCategoryId);

    expect(oldCategoryQuery).not.toEqual(editedCategory);
  });
});

describe('DELETE /categories/:id', () => {
  it('deletes an existing category with no products from the database', async () => {
    const category: Partial<Category> = {
      name: 'to-be-deleted',
      image: 'https://image.com/image.com'
    };

    const {
      body: { id: categoryId }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(200);

    const { body } = await request(server)
      .delete(`/categories/${categoryId}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body).toEqual('Category deleted!');

    const categoryQuery = await categoryRepository.findOne(categoryId);

    expect(categoryQuery).not.toBeDefined();
  });

  it('deletes an existing category with products that only belong to it from the database', async () => {
    const category: Partial<Category> = {
      name: 'to-be-deleted-again',
      image: 'https://image.com/image.com'
    };

    const {
      body: { id: categoryId }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(200);

    const product: Partial<Product> = {
      name: 'tobedeleted',
      description: 'denial',
      price: 5,
      image: 'https://image.com/image',
      // @ts-ignore
      categories: [
        {
          id: categoryId
        }
      ]
    };

    const {
      body: { id: productId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(200);

    const {
      body: { id: product1Id }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send({
        ...product,
        name: 'tobedeletedagain'
      })
      .expect(200);

    const { body } = await request(server)
      .delete(`/categories/${categoryId}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body).toEqual('Category deleted!');

    const categoryQuery = await categoryRepository.findOne(categoryId);

    expect(categoryQuery).not.toBeDefined();

    const productQuery = await productRepository.findOne(productId);
    const productQuery1 = await productRepository.findOne(product1Id);

    expect(productQuery).not.toBeDefined();
    expect(productQuery1).not.toBeDefined();
  });

  it('deletes an existing category with products that only some of which belong to it from the database', async () => {
    const category: Partial<Category> = {
      name: 'to-be-deleted-again-again',
      image: 'https://image.com/image.com'
    };

    const {
      body: { id: categoryId }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(200);

    const category1: Partial<Category> = {
      name: 'to-be-deleted-again-again2',
      image: 'https://image.com/image.com'
    };

    const {
      body: { id: categoryId1 }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category1)
      .expect(200);

    category1.id = categoryId1;

    const product: Partial<Product> = {
      name: 'tobedeleted2',
      description: 'denial',
      price: 5,
      image: 'https://image.com/image',
      // @ts-ignore
      categories: [
        {
          id: categoryId
        }
      ]
    };

    const {
      body: { id: productId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(200);

    product.id = productId;

    const product1: Partial<Product> = {
      ...product,
      name: 'tobedeletedagainaaa',
      // @ts-ignore
      categories: [
        {
          // this was accidentally set to id: categoryId1 and it was causing an internal server error - investigate!!!
          id: categoryId
        },
        {
          id: categoryId1
        }
      ]
    };

    const {
      body: { id: productId1 }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product1)
      .expect(200);

    product1.id = productId1;

    const { body } = await request(server)
      .delete(`/categories/${categoryId}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body).toEqual('Category deleted!');

    const categoryQuery = await categoryRepository.findOne(categoryId);

    expect(categoryQuery).not.toBeDefined();

    const categoryQuery1 = await categoryRepository.findOne(categoryId1, {
      relations: ['products']
    });

    const { categories, ...product1WithoutCategories } = product1;

    expect(categoryQuery1).toEqual({
      ...category1,
      products: [product1WithoutCategories]
    });

    const productQuery = await productRepository.findOne(productId);

    expect(productQuery).not.toBeDefined();

    const productQuery1 = await productRepository.findOne(productId1);

    expect(productQuery1).toEqual(product1WithoutCategories);
  });

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

describe('POST /products', async () => {
  const category: Partial<Category> = {
    name: 'Soups',
    image: 'https://image.com/image.com'
  };

  beforeAll(async () => {
    const {
      body: { id }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category);

    category.id = id;
  });

  it('creates a valid product to the database', async () => {
    const product: Partial<Product> = {
      name: 'ihicken Soup',
      description: `It's tasty and it has cheese`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(200);

    // doesn't pass because the db returns what you passed in - the categories without the extra fields
    expect(body).toMatchObject({
      ...product,
      categories: [
        {
          id: category.id
        }
      ]
    });

    const products = await productRepository.findOne(body.id, { relations: ['categories'] });

    expect(products).toMatchObject(product);
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

    const productQuery = await productRepository.findOne(body.id, { relations: ['categories'] });

    expect(productQuery).not.toEqual(product);
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

    const productQuery = await productRepository.findOne(body.id, { relations: ['categories'] });

    expect(productQuery).not.toEqual(product);
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

    const productQuery = await productRepository.findOne(body.id, { relations: ['categories'] });

    expect(productQuery).not.toEqual(product);
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

    const productQuery = await productRepository.findOne(body.id, { relations: ['categories'] });

    expect(productQuery).not.toEqual(product);
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

    const productQuery = await productRepository.findOne(body.id, { relations: ['categories'] });

    expect(productQuery).not.toEqual(product);
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

    const productQuery = await productRepository.findOne(body.id, { relations: ['categories'] });

    expect(productQuery).not.toEqual(product);
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

    const productQuery = await productRepository.findOne(body.id, { relations: ['categories'] });

    expect(productQuery).not.toEqual(product);
  });
});

describe('DELETE /products/:id', () => {
  it('deletes an existing product from the database', async () => {
    const category: Partial<Category> = {
      name: 'useless',
      image: 'https://image.com/image.com'
    };

    const {
      body: { id: categoryId }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(category)
      .expect(200);

    category.id = categoryId;

    const product: Partial<Product> = {
      name: 'to-be-deleted',
      description: 'good-desc',
      image: 'https://image.com/image.com',
      price: 5.99,
      // @ts-ignore
      categories: [category]
    };

    const {
      body: { id: productId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(200);

    const { body: body1 } = await request(server)
      .delete(`/products/${productId}`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body1).toEqual('Product deleted!');

    const productQuery = await productRepository.findOne(productId);

    expect(productQuery).not.toBeDefined();
  });

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

    const categoryQuery = await categoryRepository.findOne({ where: { ...category } });

    expect(categoryQuery).not.toBeDefined();
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

    const productQuery = await categoryRepository.findOne({ where: { ...product } });

    expect(productQuery).not.toBeDefined();
  });
});

afterAll(async () => {
  await dbConnection.close();
});
