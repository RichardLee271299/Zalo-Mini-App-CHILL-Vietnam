const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booking = new Schema({
    
    name: String,
    phone: String,
    date: String,
    members: String,
    brand: String,
    event: {type: String, default: ""}
}
, {timestamps: true});

module.exports = mongoose.model('booking', booking);
