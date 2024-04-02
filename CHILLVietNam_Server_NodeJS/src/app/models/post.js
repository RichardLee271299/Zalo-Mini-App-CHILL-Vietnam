const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const post = new Schema({
    
    title: String,
    content: String,
    thumb: String,
    price: String,
    address:String,
    isFeatured: Boolean

}
, {timestamps: true});

module.exports = mongoose.model('post', post);
