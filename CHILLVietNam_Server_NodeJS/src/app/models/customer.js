const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customer = new Schema({
    
    _id: String,
    name: String,
    phone: String

}
, {timestamps: true});

module.exports = mongoose.model('customer', customer);
