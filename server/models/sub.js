const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const subSchema = mongoose.Schema({
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
    },
    parent: { type: ObjectId, required: true, ref: 'Category' }
}, { timestamps: true }
);

module.exports = mongoose.model('Sub', subSchema);