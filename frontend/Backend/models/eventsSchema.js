var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types
var eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true

    },
    location: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true

    },
    numberofstudents: {
        type: Number,
        required: true
    },
    event_manager: {
        type: ObjectId,
        ref: "User",

    },
    datetime: {
        type: Date,
        required: true

    },
    enrolledStudents: [{
        type: ObjectId,
        ref: "User"
    }]



})
module.exports = mongoose.model("Events", eventSchema);