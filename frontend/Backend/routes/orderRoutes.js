var express = require("express");
var router = express.Router();
const { check, validationResult } = require('express-validator');

const { getUserById } = require('../controllers/user');
const { createOrder } = require('../controllers/orders');
router.param("userId", getUserById);
router.post('/order/create/:userId', createOrder);



module.exports = router;