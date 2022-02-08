const express = require('express');

const router = express.Router();

//middlewares
const { authCheck, adminCheck } = require('../middleware/auth');

//controllers
const { createOrUpdateUser, currentUser } = require('../controllers/authController');

//routes
router.post('/create-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);
router.post('/current-admin', authCheck, adminCheck, currentUser);

module.exports = router;