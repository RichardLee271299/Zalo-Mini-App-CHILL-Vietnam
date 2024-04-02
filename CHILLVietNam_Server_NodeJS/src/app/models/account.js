const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const account = new Schema({
    
    username: {type: String, require: true},
    phone: String,

}
, {timestamps: true});

module.exports = mongoose.model('account', account);
