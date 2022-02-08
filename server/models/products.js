const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 30,
        trim: true,
        text: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        imdex: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
        text: true
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        maxlength: 32
    },
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    subs: [
        {
            type: ObjectId,
            ref: 'Sub'
        }
    ],
    quantity: Number,
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    shipping: {
        type: String,
        enum: ["YES", "NO"]
    },
    color: {
        type: String,
        enum: ["Black", "Brown", "Silver", "White", "Blue"]
    },
    brand: {
        type: String,
        enum: ["Apple", "Samsung", "Microsoft", "Lenove", "ASUS"]
    },
    ratings: [
        {
            star: Number,
            postedBy: {
                type: ObjectId,
                ref: 'User'
            },
        },
    ]
},
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);