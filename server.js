const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sgMail = require('@sendgrid/mail');
const path = require("path");
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

app.use("/api/users", require("./routes/users"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/news", require("./routes/news"));
app.use("/api/huts", require("./routes/huts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/contact", require('./routes/contact'));

const PORT = process.env.PORT || 8000;

if(process.env.NODE_ENV === "production"){
	app.use(express.static('client/build'));
	app.get("*", (req,res)=>{
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
	})
}

app.listen(PORT, process.env.IP, () => {
	console.log("server up");
});
