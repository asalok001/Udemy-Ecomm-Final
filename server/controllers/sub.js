const Sub = require('../models/sub');
const Product = require('../models/products');
const slugify = require('slugify');
// const sub = require('../models/sub');

exports.create = async (req, res) => {
    try {
        const { name, parent } = req.body;

        const subCreate = await new Sub({ name, parent, slug: slugify(name) }).save();
        console.log('Sub Create', subCreate);
        res.json(`sub Category Created ${subCreate}`);
    } catch (err) {
        console.log(err);
        res.status(400).send(`Create Sub Category Failed`);
    }
};

exports.list = async (req, res) => {
    res.json(
        await Sub.find({})
            .sort({ createdAt: -1 })
            .exec()
    );
};

exports.read = async (req, res) => {
    let sub = await Sub.findOne({ slug: req.params.slug }).exec();

    let products = await Product.find({ subs: sub })
        .populate('subs')
        .exec();

    res.json({
        sub,
        products
    });
};

exports.update = async (req, res) => {
    const { name, parent } = req.body;

    try {
        let updated = await Sub.findOneAndUpdate(
            { slug: req.params.slug },
            { name, parent, slug: slugify(name) },
            { new: true }
        );

        res.json(`${req.params.slug} updated with ${updated.name}`);
    } catch (err) {
        res.status(400).send();
    }
};


exports.remove = async (req, res) => {
    try {
        res.json(await Sub.findOneAndDelete({ slug: req.params.slug }));
    }
    catch (err) {
        res.status(400).json('Deleting category failed');
    };
};