const BookingModel = require('../models/booking')
class bookingController
{

    show(req,res)
    {
        BookingModel.find({})
        .then(bookings => {
            const bookingObj = bookings.map(item => item.toObject())
            res.render('booking', {bookings: bookingObj})
        })
        .catch(err => {
            res.send(500).message(err)
        })
    }
}
module.exports = new bookingController