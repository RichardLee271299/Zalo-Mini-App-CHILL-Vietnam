const express = require('express');
const route = express.Router();
const bookingController = require('../app/controllers/bookingController');

route.get('/', bookingController.show);


module.exports = route;
