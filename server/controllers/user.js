const mongoose = require("mongoose");
const User = require("../models/users");
const Product = require("../models/products");
const Coupon = require("../models/coupon");
const Cart = require("../models/cart");
const Order = require("../models/order");
const uniqid = require('uniqid');

exports.userCart = async (req, res) => {
    const { cart } = req.body;
    let products = [];

    // const users =

    const user = await User.findOne({ email: req.user.email }).exec();

    // check if cart is already existed with logged-in user
    let cartExistedByThisUser = await Cart.findOne({
        orderedBy: user._id,
    }).exec();

    if (cartExistedByThisUser) {
        cartExistedByThisUser.remove();
        console.log("removed from cart");
    }

    for (let i = 0; i < cart.length; i++) {
        let object = {};

        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        // get price for creating total
        let { price } = await Product.findById(cart[i]._id).select("price").exec();
        object.price = price;

        products.push(object);
    }
    // console.log("All Products at cart", products);

    try {
        let cartTotal = 0;

        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }

        let newCart = await new Cart({
            products,
            cartTotal,
            orderedBy: user._id,
        }).save();

        // console.log("All items in new Cart with added total amount", newCart);

        res.json({ ok: true });
    } catch (err) {
        console.log("error at product loading in cart", err);
    }
};

exports.getUserCart = async (req, res) => {
    // let id = mongoose.Types.ObjectId(user._id);

    const user = await User.findOne({ email: req.user.email });

    // if(id.match(/^[0-9a-fA-F]{24}$/)) {
    //     // Yes, it's a valid ObjectId, proceed with `findById` call.
    // }

    let cart = await Cart.findOne({ orderedBy: user._id })
        .populate({
            path: "products.product",
            select: "_id title price totalAfterDiscount",
        })
        .exec();

    if (cart) {
        const { products, cartTotal, totalAfterDiscount } = cart;
        res.json({ products, cartTotal, totalAfterDiscount });
    }
};

exports.emptyCart = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();

    res.json(cart);
};

exports.saveAddress = async (req, res) => {
    const userAddress = await User.findOneAndUpdate(
        { email: req.user.email },
        { address: req.body.address }
    ).exec();

    res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
    const { coupon } = req.body;
    // console.log('Coupon body', coupon);

    const validCoupon = await Coupon.findOne({ name: coupon }).exec();
    if (validCoupon === null) {
        return res.json({
            err: "This coupon is not valid",
        });
    }
    // console.log('Valid Coupon', validCoupon);

    const user = await User.findOne({ email: req.user.email }).exec();

    let { cartTotal } = await Cart.findOne({ orderedBy: user._id })
        .populate("products.product", "_id title price")
        .exec();

    // console.log("cartTotal", cartTotal, "discount", validCoupon.discount);

    let totalAfterDiscount = (
        cartTotal -
        (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    // console.log('After discount', totalAfterDiscount);

    Cart.findOneAndUpdate(
        { orderedBy: user._id },
        { totalAfterDiscount },
        { new: true }
    ).exec();

    res.json(totalAfterDiscount);
};

exports.createOrder = async (req, res) => {
    const { paymentIntent } = req.body.stripeResponse;

    const user = await User.findOne({ email: req.user.email }).exec();

    let { products } = await Cart.findOne({ orderedBy: user._id }).exec();

    let newOrder = await new Order({
        products,
        paymentIntent,
        orderedBy: user._id,
    }).save();

    // decrement Quantity, increment sold
    let bulkOption = products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });

    let updatedProductQuantity = await Product.bulkWrite(bulkOption, {});

    res.json({ ok: true });
};

exports.createCashOrder = async (req, res) => {
    const { COD, couponApplied } = req.body;

    if (!COD) return res.status(400).send("Cash Order Failed");

    // if COD is true create order for caah on delivery

    const user = await User.findOne({ email: req.user.email }).exec();

    let userCart = await Cart.findOne({ orderedBy: user._id }).exec();


    let finalAmount = 0;

    if (couponApplied && userCart.totalAfterDiscount) {
        finalAmount = userCart.totalAfterDiscount * 100;
    }
    else {
        finalAmount = userCart.cartTotal * 100;
    }

    let paymentIntent = {
        paymentIntent: {
            id: uniqid(),
            amount: finalAmount,
            currency: 'inr',
            status: "Cash On Delivery",
            created: Date.now(),
            payment_method_types: ["cash"],
        }
    };

    let newOrder = await new Order({
        products: userCart.products,
        paymentIntent,
        // paymentIntent: {
        //     paymentIntent: {
        //         id: uniqid(),
        //         amount: finalAmount,
        //         currency: 'inr',
        //         status: "Cash On Delivery",
        //         created: Date.now(),
        //         payment_method_types: ["cash"],
        //     }
        // },
        orderedBy: user._id,
        orderStatus: "Cash On Delivery",
    }).save();
    console.log("Unique Id in user ", uniqid());
    // decrement Quantity, increment sold
    let bulkOption = userCart.products.map((item) => {
        return {
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } },
            },
        };
    });

    let updatedProductQuantity = await Product.bulkWrite(bulkOption, {});

    res.json({ ok: true });
};

exports.orders = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    const userOrders = await Order.find({ orderedBy: user._id })
        .populate("products.product")
        .populate("paymentIntent")
        .exec();
    console.log(
        "User orders at purchase history backend",
        userOrders.paymentIntent
    );

    res.json(userOrders);
};

exports.addToWishlist = async (req, res) => {
    let { productId } = req.body;

    const user = await User.findOneAndUpdate(
        { email: req.user.email },
        { $addToSet: { wishlist: productId } },
    ).exec();

    console.log("added to wishlist", user);
    res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
    const list = await User.findOne({ email: req.user.email })
        .select("wishlist")
        .populate("wishlist")
        .exec();
    console.log("My list of wishlist", list);
    res.json(list);
};

exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    // console.log('req body ', req.params);
    // return;
    const user = await User.findOneAndUpdate(
        { email: req.user.email },
        { $pull: { wishlist: productId } }
    ).exec();

    res.json({ ok: true });

};
