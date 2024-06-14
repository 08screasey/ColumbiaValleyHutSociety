const mongoose = require('mongoose');

let Booking = new mongoose.Schema({
    dates: [{ type: String }],
    userData: {
        name: String,
        email: String,
        userId: String,
        mobile: String,
    },
    hut: String,
    price: String,
    paymentId: String,
});

module.exports = mongoose.model('Booking', Booking);
