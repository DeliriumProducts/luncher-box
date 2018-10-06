const product = require('../controllers/product');
const category = require('../controllers/category');
const user = require('../controllers/user');
const token = require('../controllers/token');

module.exports = (app) => {
    // Create a product
    app.post('/products', product.create);

    // Retrieve all products
    app.get('/products/category/:categoryId', product.findAllByCategory);

    // Retrieve a single product with productId
    app.get('/products/:productId', product.findOne);
   
    // Update a product with productId
    app.put('/products/:productId', product.edit);
   
    // Delete a product with productId
    app.delete('/products/:productId', product.delete);

    // Create a category
    app.post('/categories', category.create);

    // Retrieve all categories
    app.get('/categories', category.findAll);

    // Update a category with categoryId
    app.put('/categories/:categoryId', category.edit);
   
    // Delete a category with categoryId
    app.delete('/categories/:categoryId', category.delete);

    // Register a user
    app.post('/register', user.register);

    // Login a user
    app.post('/login', user.loginPost);

    // Check for authentication 
    app.get('/login', user.isAuthenticated);

    // Logout a user
    app.get('/logout', user.logout);

    // Confirm a user
    app.get('/confirmation/:token', token.confirm);
};
