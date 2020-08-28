const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Moment = require("moment");
const MomentRange = require("moment-range");

const cors = require("cors");
const paypal = require("paypal-rest-sdk");
const auth = require("./middleware/auth");
const sgMail = require("@sendgrid/mail");
const verifyUser = require("./middleware/VerifyUser");
require('dotenv').config()
const moment = MomentRange.extendMoment(Moment);

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(
	process.env.DATABASE_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("connected to database");
});

paypal.configure({
	mode: process.env.PAYPAL_ENV,
	client_id:
		process.env.PAYPAL_CLIENT_ID,
	client_secret:
		process.env.PAYPAL_CLIENT_SECRET,
});

sgMail.setApiKey(
	process.env.SENDGRID_API_KEY
);

app.use("/users", require("./routes/users"));
app.use("/bookings", require("./routes/bookings"));
app.use("/news", require("./routes/news"));
app.use("/huts", require("./routes/huts"));
app.use("/comments", require("./routes/comments"));

const PORT = process.env.PORT || 8000

app.listen(PORT, process.env.IP, () => {
	console.log("server up");
});
