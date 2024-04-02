const express = require('express');
const path = require('path')
const multer = require('multer');
const multerOnlyText = multer().array();
const route = express.Router();
const postController = require('../app/controllers/postController');

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

route.get('/add', postController.add);
route.post('/store',upload.single('thumb'),postController.store)
route.get('/:id/edit', postController.edit);
route.delete('/:id/remove', postController.remove);
route.put('/:id',multerOnlyText,postController.update);
route.get('/', postController.show);

module.exports = route;
