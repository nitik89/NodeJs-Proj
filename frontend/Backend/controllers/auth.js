const { validationResult } = require("express-validator");
const User = require("../models/userSchema")
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');



exports.signup = (req, res) => {
    console.log(req.body)


    const { email, firstname, lastname, password, rollno, contact_no, year } = req.body;

    User.findOne({ email: email }, (use) => {
        if (use) {
            return res.status(422).json({ error: "User already exists" });
        }
        let role = 0;

        if (req.body.role) {
            role = req.body.role;
        }
        console.log(role)
        const user = new User({ email, firstname, lastname, password, rollno, contact_no, year, role })
        user.save().then((user, err) => {
            if (user) {

                return res.json({ message: "User is saved to database" });
            } else {
                return res.json({ error: "Error in saving user to database" })
            }

        }).catch(err => {
            console.log(err)
        })

    })
}




exports.signin = (req, res) => {

    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {

        if (err || !user) {
            return res.status(400).json({ error: "User does not exists" })
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({ error: "Email and password do not match" })
        }
        const token = jwt.sign({ _id: user._id }, "nnnn");

        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });
        req.auth = user;

        //send response to the front 

        const { _id, firstname, lastname, email, role, allocatedEvent } = user;
        return res.json({ token, user: { _id, firstname, lastname, email, role, allocatedEvent } });
    })


}

exports.isSignedIn = expressJwt({
    secret: "nnnn",
    userProperty: "auth" //this will put an req.auth with an id
})


exports.isAdmin = (req, res, next) => {
    if (req.profile.role !== 1) {
        return res.status(403).json({ error: "You are not the admin,Access Denied" })
    }
    next();
}
exports.isEventManager = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({ error: "You are not the admin,Access Denied" })
    }
    next();
}

exports.eventmanager = (req, res) => {
    const { email, firstname, lastname, password, rollno, contact_no, year } = req.body;

    User.findOne({ email: email }, (use) => {
        if (use) {
            return res.status(422).json({ error: "User already exists" });
        }
        const user = new User({ email, firstname, lastname, password, rollno, contact_no, year, role: 2 })
        user.save().then((user, err) => {
            if (user) {
                return res.json({ message: "User is saved to database" });
            } else {
                return res.json({ error: "Error in saving user to database" })
            }

        }).catch(err => {
            console.log(err)
        })

    })

}