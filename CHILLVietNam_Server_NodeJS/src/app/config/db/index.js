const mongoose = require('mongoose');
async function connect() {
    try {
        await mongoose.connect('mongodb://chilladmin:VNDCminiapp@localhost:40017/ChillVietNam');
        console.log('Connect Success');
    } catch {
        console.log('Connect Fail');
        res.send(500)
    }
}

module.exports = { connect };