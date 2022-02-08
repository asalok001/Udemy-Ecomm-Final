const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required',
        minlength: [4, 'Too Short'],
        maxlength: [32, 'Too long'],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    }
}, { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);