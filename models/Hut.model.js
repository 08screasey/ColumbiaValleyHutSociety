const mongoose = require("mongoose");

let TempBookingSchema = new mongoose.Schema({
	dates: [String],
	userId: String,
});

let Hut = new mongoose.Schema({
	name: String,
	bookings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Booking",
		},
	],
	filledDates: [{ type: String }],
	temporaryBookings: [TempBookingSchema],
	price: [Number],
	maxNights: Number,
});

module.exports = mongoose.model("Hut", Hut);
