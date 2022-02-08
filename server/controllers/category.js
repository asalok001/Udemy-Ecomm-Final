const Category = require('../models/category');
const Product = require('../models/products');
const slugify = require('slugify');

const Sub = require('../models/sub');

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await new Category({ name, slug: slugify(name) }).save();
        // console.log('Category created', category);
        res.json(`category create ${category}`);
    } catch (err) {
        res.status(400).send('Creating category failed');
    }
};

exports.list = async (req, res) => {
    res.json(
        await Category.find({})
            .sort({ createdAt: -1 })
            .exec()
    );
};

exports.read = async (req, res) => {
    let category = await Category.findOne({ slug: req.params.slug }).exec();

    let products = await Product.find({ category })
        .populate('category')
        .populate({
            path: 'ratings.postedBy',
            select: '_id name'
        })
        .exec();

    res.json({
        category,
        products
    });
    console.log('All products at cahegory ', products);
};

exports.update = async (req, res) => {
    // console.log('Body Update', req.body);
    const { name } = req.body;

    try {
        let updated = await Category.findOneAndUpdate(
            { slug: req.params.slug },
            { name, slug: slugify(name) },
            { new: true }
        );
        res.json(`${req.params.slug} updated with ${updated.name}`);
    } catch (err) {
        res.status(404).send('Updating failed');
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
        res.json(deleted);
    } catch (err) {
        console.log(err);
        res.status(400).send('Deleting category failed');
    }
};

exports.getSubs = (req, res) => {
    Sub.find({ parent: req.params._id }).exec((err, sub) => {
        if (err) console.log(err);
        res.json(sub);

    });
};