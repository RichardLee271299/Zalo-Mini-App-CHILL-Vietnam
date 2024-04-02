const express = require('express');
const route = express.Router();
const loginrController = require('../app/controllers/loginController');

route.get('/', loginrController.show);
route.post('/', loginrController.login);

module.exports = route;
