const express = require('express');
const route = express.Router();
const apiClientsController = require('../app/controllers/apiClientController');

route.get('/posts', apiClientsController.allpost);
route.post('/booking', apiClientsController.booking);
route.get('/events', apiClientsController.events);
route.get('/customer/:id',apiClientsController.getcustomer)
route.post('/customer', apiClientsController.savecustomer);
route.get('/eventdetail/:id', apiClientsController.eventdetail);
route.get('/featuredposts', apiClientsController.featuredposts);
route.get('/recommendedposts',apiClientsController.recommendedpost);
route.get('/postdetail/:id', apiClientsController.postdetail);
route.get('/sendtoken', apiClientsController.sendtoken);
route.post('/zalowebhook', apiClientsController.zalowebhook)

//OUTDATE
route.get('/recommendedpost/detail/:id', apiClientsController.recommendpostdetail)
route.get('/featuredpost/detail/:id', apiClientsController.featuredpostdetail)

module.exports = route;
