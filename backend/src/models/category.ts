import * as mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    img: {
        type: String,
        unique: true,
        required: true
    },
}, {
        timestamps: true
    }
);

export default mongoose.model('Category', CategorySchema);    