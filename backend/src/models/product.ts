import Category from './category';
import * as mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
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

export default mongoose.model('Product', ProductSchema);    