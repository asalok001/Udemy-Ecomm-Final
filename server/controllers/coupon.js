const Coupon = require('../models/coupon');


exports.create = async (req, res) => {

    try {
        // console.log('request body ', req.body.coupon);
        const { name, expiry, discount } = req.body.coupon;

        res.json(await new Coupon({ name, expiry, discount }).save());

    } catch (err) {
        console.log('Error at coupon create()', err);
    }
};

exports.remove = async (req, res) => {
    try {
        res.json(await Coupon.findOneAndRemove(req.params.couponId).exec());
    } catch (err) {
        console.log('Error at coupon remove()', err);
    }
};

exports.list = async (req, res) => {
    try {
        res.json(await Coupon.find({}).sort({ createdAt: -1 }).exec());
    } catch (err) {
        console.log('Error at coupon list()', err);
    }
};