const mongoose = require("mongoose");
const express = require("express");
require('dotenv').config()
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const orderRoutes = require("./routes/orderRoutes");
const Razorpay = require('razorpay');
const shortid = require("shortid");
const { body } = require("express-validator");

const razorpay = new Razorpay({
    key_id: 'rzp_test_Yax8ezEYaakoPh',
    key_secret: 'pm4VDkI4BfOiz1ezWfjTlO8r'
})

mongoose.connect("mongodb+srv://nitik:nitik123@cluster0.cbrwj.mongodb.net/events", {

    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true

}).then(() => {
    console.log("DB connected")
}).catch(err => {
    console.log(err);
})

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.post('/api/razorpay', async(req, res) => {
    const { products } = req.body;
    let total = 0;
    products.map(evnts => {
        total += evnts.price
    })

    const payment_capture = 1;
    const amount = total * 100;

    const currency = "INR"
    const options = {
        amount: amount,
        currency,
        receipt: shortid.generate(),
        payment_capture
    }
    try {
        const response = await razorpay.orders.create(options)


        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        })
    } catch (error) {
        console.log(error)
    }
})
app.post("/api/verification", (req, res) => {
    let body = req.body.order_id + "|" + req.body.payment_id;

    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', 'pm4VDkI4BfOiz1ezWfjTlO8r')
        .update(body.toString())
        .digest('hex');


    if (expectedSignature === req.body.signature) {
        return res.json({ "status": "success" })
    }
    return res.json({ "status": "error" })

});
app.use('/api', authRoutes);
app.use('/api', eventRoutes);
app.use('/api', orderRoutes);
const PORT = 8800;
app.listen(PORT, () => {
    console.log("Connected");
})