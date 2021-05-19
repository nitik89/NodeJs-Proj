var express = require("express");
var router = express.Router();
const { check, validationResult } = require('express-validator');
const { signup, signin, eventmanager, getUserById, isAdmin } = require('../controllers/auth');



router.post('/signup', signup);
router.post(
    "/signin", [
        check("email", "Email is required").isEmail(),
        check("password", "Password field is required").isLength({ min: 1 })
    ],
    signin
);
router.post('/eventmanagersignin', isAdmin, eventmanager);
module.exports = router;