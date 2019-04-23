import faker from 'faker';
import { Server } from 'http';
import request from 'supertest';
import { getRepository, MoreThan, Repository } from 'typeorm';
import { initServer } from '../src';
import { Category, Product, User } from '../src/entities';

let server: Server;
let productRepository: Repository<Product>;
let categoryRepository: Repository<Category>;
let cookie: string;

beforeAll(async () => {
  server = await initServer();
  productRepository = getRepository(Product);
  categoryRepository = getRepository(Category);

  const user: Partial<User> = {
    name: faker.name.findName(),
    email: 'product' + faker.internet.exampleEmail(),
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

    category.id = body.id;

    expect(body).toEqual(category);

    const categoryQuery = await categoryRepository.findOne(body.id);

    expect(categoryQuery).toEqual(category);
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

describe('GET /categories', () => {
  it('gets all the categories', async () => {
    const { body } = await request(server)
      .get('/categories')
      .expect(200);

    const categoryQuery = await categoryRepository.find();

    expect(categoryQuery).toEqual(expect.arrayContaining(body));
  });

  it('gets all the categories on a given page', async () => {
    const { body } = await request(server)
      .get('/categories?page=1')
      .expect(200);

    const categoryQuery = await categoryRepository.find({
      skip: 0,
      take: 0
    });

    expect(categoryQuery).toEqual(expect.arrayContaining(body));
  });

  it(`gets all the categories after a given category's id`, async () => {
    const { body } = await request(server)
      .get('/categories?since=1')
      .expect(200);

    const categoryQuery = await categoryRepository.find({
      where: { id: MoreThan(1) },
      take: 0
    });

    expect(categoryQuery).toEqual(expect.arrayContaining(body));
  });

  it('gets all the categories with a limit', async () => {
    const { body } = await request(server)
      .get('/categories?limit=1')
      .expect(200);

    expect(body).toHaveLength(1);

    const categoryQuery = await categoryRepository.find({
      take: 1
    });

    expect(categoryQuery).toEqual(expect.arrayContaining(body));
  });
});

describe('GET /categories/:id', () => {
  it('gets a specific category with its products', async () => {
    const category: Partial<Category> = {
      name: 'to-be-requested',
      image: 'https://image.com',
      products: []
    };

    const {
      body: { id: categoryId }
    } = await request(server)
      .post('/categories')
      .send(category)
      .set('Cookie', cookie)
      .expect(200);

    category.id = categoryId;

    const { body } = await request(server)
      .get(`/categories/${categoryId}`)
      .expect(200);

    expect(body).toEqual(category);
  });

  it('gets a specific category with its products and nested relations', async () => {
    const category: Partial<Category> = {
      name: 'to-be-requested-again',
      image: 'https://image.com',
      products: []
    };

    const {
      body: { id: categoryId }
    } = await request(server)
      .post('/categories')
      .send(category)
      .set('Cookie', cookie)
      .expect(200);

    category.id = categoryId;

    const product: Partial<Product> = {
      name: 'aaaaa',
      description: 'asdfasdf',
      image: 'https://iamge.com',
      price: 5.99,
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
      .send(product)
      .set('Cookie', cookie)
      .expect(200);

    product.id = productId;
    // @ts-ignore
    category.products.push(product);
    const { products, ...categoryWithoutProducts } = category;
    // @ts-ignore
    product.categories = [categoryWithoutProducts];

    const { body } = await request(server)
      .get(`/categories/${categoryId}?relations=true`)
      .expect(200);

    expect(body).toEqual(category);
  });

  it('throws an error when getting a non-existing category', async () => {
    const { body } = await request(server)
      .get(`/categories/${-420}`)
      .set('Cookie', cookie)
      .expect(404);

    expect(body).toEqual({
      name: 'NotFoundError',
      message: 'Category not found!'
    });
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

  it('throws an error when editing a non-existing category', async () => {
    const { body } = await request(server)
      .put(`/categories/${-420}`)
      .set('Cookie', cookie)
      .expect(404);

    expect(body).toEqual({
      name: 'NotFoundError',
      message: 'Category not found!'
    });
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

describe('POST /products', () => {
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

    product.id = body.id;

    expect(body).toEqual({
      ...product,
      categories: [
        {
          id: category.id
        }
      ]
    });

    const productQuery = await productRepository.findOne(body.id, { relations: ['categories'] });

    expect(productQuery).toEqual(product);
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
      // @ts-ignore
      price: 'az',
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(product)
      .expect(400);

    expect(body).toEqual({
      errors: [
        'price must not be greater than 1000',
        'price must not be less than 0',
        'price must be a number'
      ],
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
      // @ts-ignore
      price: 'a',
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
        'price must not be greater than 1000',
        'price must not be less than 0',
        'price must be a number',
        'categories must be created beforehand'
      ],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const productQuery = await productRepository.findOne(body.id, { relations: ['categories'] });

    expect(productQuery).not.toEqual(product);
  });
});

describe('GET /products', () => {
  it('gets all the products', async () => {
    const { body } = await request(server)
      .get('/products')
      .expect(200);

    const productQuery = await productRepository.find();

    expect(productQuery).toEqual(expect.arrayContaining(body));
  });

  it('gets all the products on a given page', async () => {
    const { body } = await request(server)
      .get('/products?page=1')
      .expect(200);

    const productQuery = await productRepository.find({
      skip: 0,
      take: 0
    });

    expect(productQuery).toEqual(expect.arrayContaining(body));
  });

  it(`gets all the products after a given product's id`, async () => {
    const { body } = await request(server)
      .get('/products?since=1')
      .expect(200);

    const productQuery = await productRepository.find({
      where: { id: MoreThan(1) },
      take: 0
    });

    expect(productQuery).toEqual(expect.arrayContaining(body));
  });

  it('gets all the categories with a limit', async () => {
    const { body } = await request(server)
      .get('/products?limit=1')
      .expect(200);

    expect(body).toHaveLength(1);

    const productQuery = await productRepository.find({
      take: 1
    });

    expect(productQuery).toEqual(expect.arrayContaining(body));
  });
});

describe('GET /products/:id', () => {
  it('gets a specific product with its categories', async () => {
    const category: Partial<Category> = {
      name: 'asdfasdfaaa',
      image: 'https://good-image.com'
    };

    const {
      body: { id: categoryId }
    } = await request(server)
      .post('/categories')
      .send(category)
      .set('Cookie', cookie)
      .expect(200);

    category.id = categoryId;

    const product: Partial<Product> = {
      name: 'to-be-requested-again-again',
      description: 'asdfasdfasdfasdf',
      image: 'https://image.com',
      price: 5.99,
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
      .post('/products/')
      .send(product)
      .set('Cookie', cookie)
      .expect(200);

    product.id = productId;
    // @ts-ignore
    product.categories = [category];

    const { body } = await request(server)
      .get(`/products/${productId}`)
      .expect(200);

    expect(body).toEqual(product);
  });

  it('throws an error when trying to get a non-existing product', async () => {
    const { body } = await request(server)
      .get(`/products/${-420}`)
      .set('Cookie', cookie)
      .expect(404);

    expect(body).toEqual({
      name: 'NotFoundError',
      message: 'Product not found!'
    });
  });
});

describe('PUT /products/:id', () => {
  const category: Partial<Category> = {
    name: 'Soups-To-Be-Put',
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

  it('edits a valid product from the database', async () => {
    const oldProduct: Partial<Product> = {
      name: 'ye olde Soup',
      description: `It's tasty and it has cheese`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const {
      body: { id: oldProductId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(oldProduct)
      .expect(200);

    oldProduct.id = oldProductId;

    const editedProduct: Partial<Product> = {
      ...oldProduct,
      name: 'Edited Chicken',
      description: 'new desc',
      image: 'https://iamge.com/thesequel',
      price: 999.0,
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .put(`/products/${oldProductId}`)
      .set('Cookie', cookie)
      .send(editedProduct)
      .expect(200);

    expect(body).toEqual({
      ...editedProduct,
      categories: [
        {
          id: category.id
        }
      ]
    });

    const oldProductQuery = await productRepository.findOne(oldProductId, {
      relations: ['categories']
    });

    expect(oldProductQuery).toEqual(editedProduct);
  });

  it('changes the categories of product', async () => {
    const oldProduct: Partial<Product> = {
      name: 'ye olde Soup',
      description: `It's tasty and it has cheese`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const {
      body: { id: oldProductId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(oldProduct)
      .expect(200);

    oldProduct.id = oldProductId;

    const newCategory: Partial<Category> = {
      name: 'NEW-NEW_NEW',
      image: 'https://image.com'
    };

    const {
      body: { id: newCategoryId }
    } = await request(server)
      .post('/categories')
      .set('Cookie', cookie)
      .send(newCategory)
      .expect(200);

    newCategory.id = newCategoryId;

    const editedProduct: Partial<Product> = {
      ...oldProduct,
      name: 'Edited Chicken',
      description: 'new desc',
      image: 'https://iamge.com/thesequel',
      price: 999.0,
      // @ts-ignore
      categories: [newCategory]
    };

    const { body } = await request(server)
      .put(`/products/${oldProductId}`)
      .set('Cookie', cookie)
      .send(editedProduct)
      .expect(200);

    expect(body).toEqual({
      ...editedProduct,
      categories: [
        {
          id: newCategoryId
        }
      ]
    });

    const oldProductQuery = await productRepository.findOne(oldProductId, {
      relations: ['categories']
    });

    expect(oldProductQuery).toEqual(editedProduct);
  });

  it('throws an error when editing a product with an invalid name', async () => {
    const oldProduct: Partial<Product> = {
      name: 'Valid Old Name',
      description: `It's invalid, sorta`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const {
      body: { id: oldProductId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(oldProduct)
      .expect(200);

    oldProduct.id = oldProductId;

    const editedProduct: Partial<Product> = {
      ...oldProduct,
      name: 'ab',
      description: 'new desc',
      image: 'https://iamge.com/thesequel',
      price: 999.0,
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .put(`/products/${oldProductId}`)
      .set('Cookie', cookie)
      .send(editedProduct)
      .expect(400);

    expect(body).toEqual({
      errors: ['name must be longer than or equal to 3 characters'],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const oldProductQuery = await productRepository.findOne(oldProductId, {
      relations: ['categories']
    });

    expect(oldProductQuery).not.toEqual(editedProduct);
  });

  it('throws an error when editing a product with an invalid description', async () => {
    const oldProduct: Partial<Product> = {
      name: 'Valid Old Name2',
      description: `It's invalid, sorta`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const {
      body: { id: oldProductId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(oldProduct)
      .expect(200);

    oldProduct.id = oldProductId;

    const editedProduct: Partial<Product> = {
      ...oldProduct,
      name: 'Valid-Name',
      description: 'ab',
      image: 'https://iamge.com/thesequel',
      price: 999.0,
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .put(`/products/${oldProductId}`)
      .set('Cookie', cookie)
      .send(editedProduct)
      .expect(400);

    expect(body).toEqual({
      errors: ['description must be longer than or equal to 5 characters'],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const oldProductQuery = await productRepository.findOne(oldProductId, {
      relations: ['categories']
    });

    expect(oldProductQuery).not.toEqual(editedProduct);
  });

  it('throws an error when editing a product with an invalid image', async () => {
    const oldProduct: Partial<Product> = {
      name: 'Valid Old Name23',
      description: `It's invalid, sorta`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const {
      body: { id: oldProductId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(oldProduct)
      .expect(200);

    oldProduct.id = oldProductId;

    const editedProduct: Partial<Product> = {
      ...oldProduct,
      name: 'Valid-Name',
      description: 'valid-desc',
      image: 'bad-img',
      price: 999.0,
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .put(`/products/${oldProductId}`)
      .set('Cookie', cookie)
      .send(editedProduct)
      .expect(400);

    expect(body).toEqual({
      errors: ['image must be an URL address'],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const oldProductQuery = await productRepository.findOne(oldProductId, {
      relations: ['categories']
    });

    expect(oldProductQuery).not.toEqual(editedProduct);
  });

  it('throws an error when editing a product with an invalid price', async () => {
    const oldProduct: Partial<Product> = {
      name: 'Valid Old Name234',
      description: `It's invalid, sorta`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const {
      body: { id: oldProductId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(oldProduct)
      .expect(200);

    oldProduct.id = oldProductId;

    const editedProduct: Partial<Product> = {
      ...oldProduct,
      name: 'Valid-Name',
      description: 'valid-desc',
      image: 'https://example.com/',
      // @ts-ignore
      price: 'a',
      // @ts-ignore
      categories: [category]
    };

    const { body } = await request(server)
      .put(`/products/${oldProductId}`)
      .set('Cookie', cookie)
      .send(editedProduct)
      .expect(400);

    expect(body).toEqual({
      errors: [
        'price must not be greater than 1000',
        'price must not be less than 0',
        'price must be a number'
      ],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const oldProductQuery = await productRepository.findOne(oldProductId, {
      relations: ['categories']
    });

    expect(oldProductQuery).not.toEqual(editedProduct);
  });

  it('throws an error when editing a product with invalid categories', async () => {
    const oldProduct: Partial<Product> = {
      name: 'Valid Old Name2331',
      description: `It's invalid, sorta`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const {
      body: { id: oldProductId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(oldProduct)
      .expect(200);

    oldProduct.id = oldProductId;

    const editedProduct: Partial<Product> = {
      ...oldProduct,
      name: 'Valid-Name',
      description: 'valid-desc',
      image: 'https://image.com',
      price: 999.0,
      // @ts-ignore
      categories: [
        {
          id: -30
        }
      ]
    };

    const { body } = await request(server)
      .put(`/products/${oldProductId}`)
      .set('Cookie', cookie)
      .send(editedProduct)
      .expect(400);

    expect(body).toEqual({
      errors: ['categories must be created beforehand'],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const oldProductQuery = await productRepository.findOne(oldProductId, {
      relations: ['categories']
    });

    expect(oldProductQuery).not.toEqual(editedProduct);
  });

  it('throws an error when editing a product with all fields invalid', async () => {
    const oldProduct: Partial<Product> = {
      name: 'Valid Old Name2345',
      description: `It's invalid, sorta`,
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
      categories: [category]
    };

    const {
      body: { id: oldProductId }
    } = await request(server)
      .post('/products')
      .set('Cookie', cookie)
      .send(oldProduct)
      .expect(200);

    oldProduct.id = oldProductId;

    const editedProduct: Partial<Product> = {
      ...oldProduct,
      name: 'b',
      description: 'a',
      image: 'bad-url',
      // @ts-ignore
      price: 'cak',
      // @ts-ignore
      categories: [{ a: 'b' }]
    };

    const { body } = await request(server)
      .put(`/products/${oldProductId}`)
      .set('Cookie', cookie)
      .send(editedProduct)
      .expect(400);

    expect(body).toEqual({
      errors: [
        'name must be longer than or equal to 3 characters',
        'description must be longer than or equal to 5 characters',
        'image must be an URL address',
        'price must not be greater than 1000',
        'price must not be less than 0',
        'price must be a number',
        'categories must be created beforehand'
      ],
      name: 'NotValidError',
      message: 'Product not valid!'
    });

    const oldProductQuery = await productRepository.findOne(oldProductId, {
      relations: ['categories']
    });

    expect(oldProductQuery).not.toEqual(editedProduct);
  });

  it('throws an error when editing a non-existing product', async () => {
    const { body } = await request(server)
      .put(`/products/${-420}`)
      .set('Cookie', cookie)
      .expect(404);

    expect(body).toEqual({
      name: 'NotFoundError',
      message: 'Product not found!'
    });
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

describe('Authorization', () => {
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

  it('throws an error when editing a category when not logged in', async () => {
    const category: Partial<Category> = {
      name: 'even-badder-examplers-edition',
      image: 'https://image.com/image.com'
    };

    const {
      body: { id: categoryId }
    } = await request(server)
      .post('/categories')
      .send(category)
      .set('Cookie', cookie)
      .expect(200);

    category.id = categoryId;

    const { body } = await request(server)
      .put(`/categories/${categoryId}`)
      .send({
        ...category,
        name: 'edited lmao'
      })
      .expect(401);

    expect(body).toEqual({
      name: 'AuthorizationRequiredError',
      message: `Authorization is required for request on PUT /categories/${categoryId}`
    });

    const categoryQuery = await categoryRepository.findOne(categoryId);

    expect(categoryQuery).toEqual(category);
  });

  it('throws an error when deleting a category when not logged in', async () => {
    const category: Partial<Category> = {
      name: 'even-badder-examplers-deletion',
      image: 'https://image.com/image.com'
    };

    const {
      body: { id: categoryId }
    } = await request(server)
      .post('/categories')
      .send(category)
      .set('Cookie', cookie)
      .expect(200);

    const { body } = await request(server)
      .delete(`/categories/${categoryId}`)
      .expect(401);

    expect(body).toEqual({
      name: 'AuthorizationRequiredError',
      message: `Authorization is required for request on DELETE /categories/${categoryId}`
    });

    const categoryQuery = await categoryRepository.findOne({ where: { ...category } });

    expect(categoryQuery).toBeDefined();
  });

  it('throws an error when creating a product when not logged in', async () => {
    const product: Partial<Product> = {
      name: 'very-bad-example123>_>',
      description: 'very-good-example123<_>',
      image: 'https://image.com/product.com',
      price: 5.0,
      // @ts-ignore
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

    const { categories, ...productWithoutCategories } = product;

    const productQuery = await productRepository.findOne({
      where: { ...productWithoutCategories }
    });

    expect(productQuery).not.toBeDefined();
  });

  it('throws an error when editing a product when not logged in', async () => {
    const category: Partial<Category> = {
      name: 'even-badder-examplers-edition',
      image: 'https://image.com/image.com'
    };

    const {
      body: { id: categoryId }
    } = await request(server)
      .post('/categories')
      .send(category)
      .set('Cookie', cookie)
      .expect(200);

    const product: Partial<Product> = {
      name: 'very-bad-example123>_>',
      description: 'very-good-example123<_>',
      image: 'https://image.com/product.com',
      price: 5.0,
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
      .send(product)
      .set('Cookie', cookie)
      .expect(200);

    product.id = productId;

    const { body } = await request(server)
      .put(`/products/${productId}`)
      .send({
        ...product,
        name: 'new-name',
        description: 'new-desccc'
      })
      .expect(401);

    expect(body).toEqual({
      name: 'AuthorizationRequiredError',
      message: `Authorization is required for request on PUT /products/${productId}`
    });

    const { categories, ...productWithoutCategories } = product;

    const productQuery = await productRepository.findOne(productId);

    expect(productQuery).toEqual(productWithoutCategories);
  });

  it('throws an error when deleting a product when not logged in', async () => {
    const category: Partial<Category> = {
      name: 'asdf',
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
      name: 'very-bad-example123>_>',
      description: `very-good-example123<_>`,
      image: 'https://image.com/product.com',
      price: 5.0,
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

    const { body } = await request(server)
      .delete(`/products/${productId}`)
      .expect(401);

    expect(body).toEqual({
      name: 'AuthorizationRequiredError',
      message: `Authorization is required for request on DELETE /products/${productId}`
    });

    const productQuery = await productRepository.findOne(productId);

    expect(productQuery).toBeDefined();
  });
});
