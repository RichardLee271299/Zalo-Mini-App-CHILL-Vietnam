const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const event = new Schema({
    title: String,
    content: String,
    thumb: String,
    time: String,
    date: String,
    price: String,
    address: String,
    barID: String,
}
, {timestamps: true});

module.exports = mongoose.model('event', event);
