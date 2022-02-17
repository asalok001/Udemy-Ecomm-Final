const Order = require("../models/order");

exports.orders = async (req, res) => {
    let allOrders = await Order.find({})
        .sort("-createdAt")
        .populate("products.product")
        .exec();

    res.json(allOrders);
};

exports.orderStatus = async (req, res) => {
    let { orderId, orderStatus } = req.body;
    console.log(req.body);


    let orderStatusUpdated = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true }
    ).exec();

    res.json(orderStatusUpdated);
};
