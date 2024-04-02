const express = require('express');
const route = express.Router();
const getImageController = require('../app/controllers/getImageController.js');

route.get('/', getImageController.show);

module.exports = route;
