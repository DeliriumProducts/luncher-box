const Category = require('./category');
const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    desc: String,
    price: {
        type: Number,
        required: true
    },
    img: String,
    category: String
}, {
        timestamps: true
    }
);

module.exports = mongoose.model('Product', ProductSchema);    