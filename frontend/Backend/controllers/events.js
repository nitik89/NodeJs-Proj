const User = require("../models/userSchema")
const Events = require('../models/eventsSchema');
exports.getAllEventManagers = (req, res) => {

    User.find({ role: 2 }).select("firstname lastname   contact_no  rollno year allocatedEvent").populate("allocatedEvent").exec((err, cat) => {
        if (err) {
            return res.status(400).json({ error: "Not able to find categpries" });
        }






        return res.json(cat);
    })
}

exports.createEvents = (req, res) => {
    console.log(req.body)

    const { name, location, price, numberofstudents, datetime, event_manager } = req.body;
    let date = new Date(datetime);
    const todaydate = date.toISOString();

    const events = new Events({ name, location, price, numberofstudents, datetime: todaydate, event_manager })
    events.save().then(result => {
        if (result) {
            User.findByIdAndUpdate({ _id: event_manager }, { $set: { allocatedEvent: result._id } }, { new: true }).then(updated => {
                return res.json({ msg: "Created event" });
            })

        }

    }).catch(err => {
        console.log(err);
    })
}

exports.getAllEvents = (req, res) => {
    console.log("get all")
    Events.find().lean().populate("event_manager").exec((err, cat) => {
        if (err) {
            return res.status(400).json({ error: "Not able to find categpries" });
        }

        const data = cat.map(evnts => {
            const date = new Date(evnts.datetime);
            const hrs = date.getUTCHours();

            return {...evnts, hrs };
        })


        return res.json(data);
    })
}

exports.getEventById = (req, res) => {
    const event_id = req.params.id;
    console.log(event_id);
    Events.findOne({ _id: event_id }).lean().populate("event_manager").exec((err, event) => {
        if (err) {
            return res.status(400).json({ error: "Not able to find the event" })
        }
        const { datetime } = event;
        const date = new Date(datetime);
        const hrs = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const fulldate = hrs + ":" + minutes;
        const data = {...event, fulldate }
        return res.json(data);

    })
}

exports.getAllStudents = (req, res) => {

    User.find({ events: { $gt: [] } }).select("firstname lastname   contact_no  rollno year events").populate({ path: "events", select: "name event_manager", populate: { path: "event_manager", model: "User", select: "firstname lastname" } }).sort("firstname").exec((err, cat) => {
        if (err) {
            return res.status(400).json({ error: "Not able to find categpries" });
        }



        console.log(cat);
        return res.json(cat);
    })
}