const express = require("express");

const { createOrUpdateUser } = require("../controllers/authController");

const { authCheck } = require("../middleware/auth");
const {
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    applyCouponToUserCart,
    createOrder,
    orders
} = require("../controllers/user");

const router = express.Router();

router.get("/user", createOrUpdateUser);

router.post("/user/cart", authCheck, userCart); // save cart
router.get("/user/cart/", authCheck, getUserCart); //get cart
router.delete("/user/cart/", authCheck, emptyCart); //empty cart
router.post("/user/address/", authCheck, saveAddress); //saving user address

router.post('/user/order', authCheck, createOrder);  //Creating order
router.get('/user/orders', authCheck, orders); // for users purchase history

router.post("/user/cart/coupon", authCheck, applyCouponToUserCart); // saving coupon in cart
module.exports = router;
