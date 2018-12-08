import Product from "../models/product";
import Category from "../models/category";
import handleError from "../utils/handleError";

export default {
  create: (req, res) => {
    if (!req.isAuthenticated()) {
      handleError(
        {
          status: 401,
          msg: "Unauthorized user."
        },
        res
      );
      return;
    }

    if (!req.body.name || !req.body.price) {
      handleError(
        {
          status: 400,
          msg: "Product info can not be empty."
        },
        res
      );
      return;
    }

    let product = new Product({
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      img: req.body.img,
      category: req.body.category
    });

    Category.findOne({ name: req.body.category })
      .then(category => {
        if (!category) {
          throw {
            status: 404,
            msg: "Category not found: " + req.body.category + "."
          };
        }

        return product;
      })
      .then(product => product.save())
      .then(product =>
        res.status(200).send({
          msg: "Product created succesfully!",
          product: product
        })
      )
      .catch(err => handleError(err, res));
  },

  edit: (req, res) => {
    if (!req.isAuthenticated()) {
      handleError(
        {
          status: 401,
          msg: "Unauthorized user."
        },
        res
      );
      return;
    }

    if (!req.body.name && !req.body.price) {
      handleError(
        {
          status: 400,
          msg: "Product info can not be empty."
        },
        res
      );
    }

    let editedProduct = {
      name: req.body.name,
      desc: req.body.desc,
      price: req.body.price,
      img: req.body.img,
      category: req.body.category
    };

    Category.findOne({ name: req.body.category })
      .then(category => {
        if (!category) {
          throw {
            status: 404,
            msg: "Category not found: " + req.body.category + "."
          };
        }
      })
      .then(
        (): any =>
          Product.findByIdAndUpdate(req.params.productId, editedProduct, {
            new: true
          })
      )
      .then(product => {
        if (!product) {
          throw {
            status: 404,
            msg: "Product not found: " + req.body.name + "."
          };
        }

        res.status(200).send({
          msg: "Product updated successfully!",
          product: product
        });
      })
      .catch(err => handleError(err, res));
  },

  delete: (req, res) => {
    if (!req.isAuthenticated()) {
      handleError(
        {
          status: 401,
          msg: "Unauthorized user."
        },
        res
      );
      return;
    }

    Product.findByIdAndRemove(req.params.productId)
      .then(product => {
        if (!product) {
          handleError(
            {
              status: 404,
              msg: "Product not found: " + req.params.productId + "."
            },
            res
          );
        }

        res.status(200).send({
          msg: "Product deleted successfully!"
        });
      })
      .catch(err => handleError(err, res));
  },

  findOne: (req, res) => {
    Product.findById(req.params.productId)
      .then(product => {
        if (!product) {
          throw {
            status: 404,
            msg: "Product not found: " + req.params.productId + "."
          };
        }

        res.status(200).send({
          product: product
        });
      })
      .catch(err => handleError(err, res));
  },

  findAllByCategory: (req, res) => {
    Category.findById(req.params.categoryId)
      .then((category: any): any => Product.find({ category: category.name }))
      .then(products => {
        if (!products) {
          throw {
            status: 404,
            message: "Products not found."
          };
        }

        res.status(200).send({
          products: products
        });
      })
      .catch(err => handleError(err, res));
  }
};
