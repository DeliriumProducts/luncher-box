const Category = require('../models/category');
const Product = require('../models/product');
const { handleError } = require('../utils/handleError');

module.exports = {
    create: (req, res) => {
        if (!req.isAuthenticated()) {
            handleError({
                status: 550,
                msg: 'Unauthorized user.'
            }, res);
            return;
        }

        if (!req.body.name || !req.body.img) {
            handleError({
                status: 400,
                msg: 'Category name or img can not be empty.'
            }, res);
        }

        const category = new Category({
            name: req.body.name,
            img: req.body.img,
        });

        category.save()
            .then(category => res.status(200).send({
                msg: 'Category created successfully!',
                category: category
            }))
            .catch((err) => handleError(err, res));
    },

    edit: (req, res) => {
        if (!req.isAuthenticated()) {
            handleError({
                staus: 403,
                msg: 'Unauthorized user.'
            }, res);
            return;
        }

        if (!req.body.name || !req.body.img) {
            handleError({
                status: 400,
                msg: 'Category name or img can not be empty.'
            }, res);
            return;
        }

        const editedCategory = {
            name: req.body.name,
            img: req.body.img
        };

        Category.findById(req.params.categoryId)
            .then(category => {
                if (!category) {
                    throw {
                        status: 404,
                        msg: 'Category not found: ' + req.body.name
                    };
                }

                return category;
            })
            .then(category => {
                let oldCategoryName = category.name;

                category.set({
                    name: editedCategory.name,
                    img: editedCategory.img
                });
                category.save();
                res.status(200).send({
                    msg: 'Category updated successfully!',
                    category: category
                });
                return Product.find({ category: oldCategoryName });
            })
            .then(products => {
                for (let product of products) {

                    product.set({ category: editedCategory.name });
                    product.save();
                }
            })
            .catch((err) => handleError(err, res));
    },

    delete: (req, res) => {
        if (!req.isAuthenticated()) {
            handleError({
                status: 403,
                msg: 'Unauthorized user.'
            }, res);
            return;
        }

        Category.findById(req.params.categoryId)
            .then(category => {
                if (!category) {
                    throw {
                        status: 404,
                        msg: 'Category not fonud: ' + req.body.name
                    };
                }
                return category;
            })
            .then(category => Product.deleteMany({ category: category.name }))
            .then(() => Category.findByIdAndRemove(req.params.categoryId))
            .then(() => {
                res.status(200).send({
                    msg: 'Category deleted successfully!'
                });
            })
            .catch((err) => handleError(err, res));
    },

    findOne: (req, res) => {
        Category.findById(req.params.categoryId)
            .then(category => {
                if (!category) {
                    throw {
                        status: 404,
                        msg: 'Category not found: ' + req.params.categoryId + '.'
                    };
                }

                res.status(200).send({
                    category: category
                });
            })
            .catch((err) => handleError(err, res));
    },

    findAll: (req, res) => {
        Category.find()
            .then(categories => {
                if (categories.length == 0) {
                    throw {
                        status: 404,
                        msg: 'Category not found: ' + req.body.name
                    };
                }
                res.status(200).send({
                    categories: categories
                });
            })
            .catch((err) => handleError(err, res));
    }
};
