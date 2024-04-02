const express = require('express');
const route = express.Router();
const eventController = require('../app/controllers/eventController');
const path = require('path')
const multer = require('multer');
const multerOnlyText = multer().array();


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    //   cb(null, './uploads')
        cb(null, path.join(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  var upload = multer({storage: storage })

route.get('/add', eventController.add)
route.post('/store',upload.single('thumb'),eventController.store)
route.get('/:id/edit', eventController.edit)
route.delete('/:id/remove', eventController.remove)
route.put('/:id',multerOnlyText,eventController.update);
route.get('/', eventController.show)

module.exports = route;
