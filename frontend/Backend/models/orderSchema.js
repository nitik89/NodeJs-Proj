var mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;


const ProductCartSchema = new mongoose.Schema({
    event: {
        type: ObjectId,
        ref: "Events"
    },
    name: String,
    count: Number,
    price: Number
})
const ProductCart = mongoose.model("ProductCart", ProductCartSchema);
const OrderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    transaction_id: {},
    amount: { type: Number },

    status: {
        type: String,
        default: "Recieved",
        enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]

    },

    user: {
        type: ObjectId,
        ref: "User"
    }

}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
module.exports = { Order, ProductCart }