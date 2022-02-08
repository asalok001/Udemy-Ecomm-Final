const User = require('../models/users');
const Cart = require('../models/cart');
const Product = require('../models/products');
const Coupon = require('../models/coupon');
const { findOne } = require('../models/users');

const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
    let { couponApplied } = req.body;

    // 1- find user
    const user = await User.findOne({ email: req.user.email }).exec();

    // 2 get user cart total
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({ orderedBy: user._id }).exec();
    // console.log('Cart total', cartTotal, 'After Discount', totalAfterDiscount);

    let finalAmount = 0;

    if (couponApplied && totalAfterDiscount) {
        finalAmount = totalAfterDiscount * 100;
    }
    else {
        finalAmount = cartTotal * 100;
    }

    // console.log('Cart total at stripe controller', cartTotal);

    const paymentIntent = await stripe.paymentIntents.create({

        amount: finalAmount,
        currency: 'inr',
    });

    res.json({
        clientSecret: paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable: finalAmount
    });
};
