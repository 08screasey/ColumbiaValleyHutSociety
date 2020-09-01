const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sgMail = require('@sendgrid/mail');
const cors = require("cors");

require('dotenv').config()
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

sgMail.setApiKey(
	process.env.SENDGRID_API_KEY
);

app.use("/users", require("./routes/users"));
app.use("/bookings", require("./routes/bookings"));
app.use("/news", require("./routes/news"));
app.use("/huts", require("./routes/huts"));
app.use("/comments", require("./routes/comments"));
app.use("/contact", require('./routes/contact'));

const PORT = process.env.PORT || 8000

app.listen(PORT, process.env.IP, () => {
	console.log("server up");
});
