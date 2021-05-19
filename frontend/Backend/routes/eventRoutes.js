var express = require("express");
var router = express.Router();
const { check, validationResult } = require('express-validator');


const { getAllEventManagers, createEvents, getAllEvents, getEventById, getAllStudents } = require('../controllers/events');

router.get('/alleventManagers', getAllEventManagers);
router.get('/getEvents', getAllEvents);
router.get('/getEvent/:id', getEventById);
router.get('/allstudents', getAllStudents)
router.post('/addEvent', createEvents);

module.exports = router;