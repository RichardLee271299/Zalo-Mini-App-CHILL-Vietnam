const express = require('express');
const route = express.Router();
const homerController = require('../app/controllers/homeController');

route.get('/', homerController.show);

module.exports = route;
