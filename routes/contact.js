const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

router.post("/", (req, res) => {
	const msg = {
		to: "columbiavalleyhutsociety@gmail.com",
		from: "columbiavalleyhutsociety@gmail.com",
		template_id: "d-c7d398179d514341b08183c9ffcee7a9",
		dynamic_template_data: {
			name: req.body.name,
			subject:req.body.subject,
			content:req.body.content,
			email:req.body.email
		},
	};
	sgMail.send(msg).then(response=>{
		res.status(200).send("Successfully Sent")
	},err=>{
		console.log(err.response.body)
		res.status(400).send("Unable to send mail")
	});
});

module.exports = router