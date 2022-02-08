const express = require('express');
const router = express.Router();

const { authCheck, adminCheck } = require('../middleware/auth');

const { create, remove, list } = require('../controllers/coupon');

router.post('/coupons', authCheck, adminCheck, create);
router.get('/coupons', list);
router.delete('/coupons/:couponId', authCheck, adminCheck, remove);

module.exports = router;

