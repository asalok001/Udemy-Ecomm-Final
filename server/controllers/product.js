const Product = require("../models/products");
const User = require("../models/users");
const slugify = require("slugify");

exports.create = async (req, res) => {
    try {
        // console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
        // res.status(400).send('Create product failed');
    }
};

exports.listAll = async (req, res) => {
    let products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate("category")
        .populate("subs")
        .sort([["createdAt", "desc"]])
        .exec();

    console.log('Products At listAll', products);
    res.json(products);
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndDelete({
            slug: req.params.slug,
        });
        res.json(deleted);
    } catch (err) {
        // console.log("Deleting Product Failed at /product/:slug on remove()", err);
        res.status(400).send("Deleting Product Failed", err);
    }
};

exports.read = async (req, res) => {
    let product = await Product.findOne({ slug: req.params.slug })
        .populate("category")
        .populate("subs")
        .exec();
    res.json(product);
};

exports.update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        let updated = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        ).exec();
        res.json(updated);
    } catch (err) {
        // console.log("Product Update Error at controllers products-----", err);
        // return res.status(400).send('Product Update Failed at products controllers');
        res.status(400).json({
            err: err.message,
        });
    }
};

// without pagination

// exports.list = async (req, res) => {
//     try {
//         // sort=[createdAt/updatedAt], order=[asc/desc], limit=3
//         const { sort, order, limit } = req.body;
//         const products = await Product.find({})
//             .populate("category")
//             .populate("subs")
//             .sort([[sort, order]])
//             .limit(limit)
//             .exec();

//         res.json(products);
//     } catch (err) {
//         console.log('Error at list in product controllers', err);
//     }
// };

// with pagination
exports.list = async (req, res) => {
    // console.log("Data Send from list", req.body);
    try {
        // sort=[createdAt/updatedAt], order=[asc/desc], limit=3
        const { sort, order, page } = req.body;
        const currentPage = page || 1;
        const perpage = 3;

        const products = await Product.find({})

            // suppose on currentpage = 3 then (3-1)*3 = 6
            // 6 products will be skipped.
            .skip((currentPage - 1) * perpage)
            .populate("category")
            .populate("subs")
            .sort([[sort, order]])
            .limit(perpage)
            .exec();

        res.json(products);
    } catch (err) {
        // console.log("Error at list in product controllers", err);
    }
};

exports.totalCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
};

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    console.log(" user At Star of product = ", user);
    // who is updating ?
    // chsck if currently logged in user have already added rating to this product
    let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
    );
    console.log("Existing Rating = ", existingRatingObject);

    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: { ratings: { star, postedBy: user._id } },
            },
            { new: true }
        ).exec();

        // console.log("Ratings added through productStar", ratingAdded);
        res.json(ratingAdded);
    } else {
        // if use have alresdy left rating , update it
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            },
            {
                $set: { "ratings.$.star": star },
            },
            { new: true }
        ).exec();
        // console.log("Ratings updated through productStar", ratingUpdated);
        res.json(ratingUpdated);
    }
};

exports.listRelated = async (req, res) => {
    let product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
        // here ($ne = not included )
        _id: { $ne: product._id },
        category: product.category,
    })
        .limit(3)
        .populate("category")
        .populate("subs")
        // .populate('postedBy')
        // for not sending any prpoerty related to object/element include( -prpertyname )
        .exec();

    res.json(related);
    // console.log('Related products from list Related at backend', related);
};

// serch / filters

const handleQuery = async (req, res, query) => {
    // ($text) based on  text element inside product object (title and description)
    const products = await Product.find({ $text: { $search: query } })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate({
            path: "ratings.postedBy",
            select: "_id name",
        })
        .exec();
    res.json(products);
};

const handlePrice = async (req, res, price) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
            .populate("category", "Id name")
            .populate("subs", "Id name")
            .populate({
                path: "ratings.postedBy",
                select: "_id name",
            })
            .exec();
        res.json(products);

    } catch (err) {
        console.log("Error at searchFiler", err);
        res.json(err);
    }
};

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({ category })
            .populate("category", "_id name")
            .populate("subs", "_id name")
            .populate({
                path: "ratings.postedBy",
                select: "_id name",
            })
            .exec();
        // console.log('products on selected categories', products);
        res.json(products);
    } catch (err) {
        console.log("Error at searchFiler", err);
    }
};

const handleStar = (req, res, stars) => {
    // Using Aggregation
    Product.aggregate([
        {
            // adding elements in the existing model
            $project: {
                // to access each existing elements
                // title: '$title'    or  description: '$description'

                // to access entire document
                document: "$$ROOT",

                // adding new element
                floorAverage: {
                    // here $floor = Math.ceiling and $avg = averge (mongoose method)
                    $floor: { $avg: "$ratings.star" },
                },
            },
        },
        { $match: { floorAverage: stars } },
    ])
        .limit(12)
        .exec((err, aggregates) => {
            if (err) console.log("Aggregate Error", err);
            Product.find({ _id: aggregates })
                .populate("category", "_id name")
                .populate("subs", "_id name")
                .populate({
                    path: "ratings.postedBy",
                    select: "_id name",
                })
                .exec((err, products) => {
                    if (err) console.log("Product Aggregate Error", err);
                    res.json(products);
                });
        });
};

const handleSub = async (req, res, sub) => {
    let products = await Product.find({ subs: sub })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate({
            path: "ratings.postedBy",
            select: "_id name",
        })
        .exec();

    res.json(products);
};

const handleShipping = async (req, res, shipping) => {
    let products = await Product.find({ shipping })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate({
            path: "ratings.postedBy",
            select: "_id name",
        })
        .exec();

    res.json(products);
};

const handleColor = async (req, res, color) => {
    let products = await Product.find({ color })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate({
            path: "ratings.postedBy",
            select: "_id name",
        })
        .exec();

    res.json(products);
};

const handleBrand = async (req, res, brand) => {
    let products = await Product.find({ brand })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate({
            path: "ratings.postedBy",
            select: "_id name",
        })
        .exec();

    res.json(products);
};

exports.searchFilters = async (req, res) => {
    const { query, price, category, stars, sub, shipping, color, brand } =
        req.body;

    if (query) {
        // console.log('search using text at searchFilters', query);
        await handleQuery(req, res, query);
    }

    if (price !== undefined) {
        // console.log('search using price at searchFilters', price);
        await handlePrice(req, res, price);
    }

    if (category) {
        // console.log('search using category at searchFilters', category);
        await handleCategory(req, res, category);
    }

    if (stars) {
        // console.log("search using stars at searchFilters", stars);
        handleStar(req, res, stars);
    }

    if (sub) {
        // console.log("search using sub at searchFilters", sub);
        await handleSub(req, res, sub);
    }

    if (shipping) {
        // console.log("search using shipping at searchFilters", shipping);
        await handleShipping(req, res, shipping);
    }

    if (color) {
        // console.log("search using color at searchFilters", color);
        await handleColor(req, res, color);
    }

    if (brand) {
        // console.log("search using brand at searchFilters", brand);
        await handleBrand(req, res, brand);
    }
};
