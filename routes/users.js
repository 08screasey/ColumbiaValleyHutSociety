const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const User = require("../models/User.model");
const sgMail = require('@sendgrid/mail');
const verifyUser = require('../middleware/VerifyUser');

const sendVerificationEmail = (user) => {
	sgMail.setApiKey("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");
						const msg = {
						  to: user.email,
						  from: 'columbiavalleyhutsociety@gmail.com',
						  template_id: "d-273e372d2ab94ebbb6695a80af6949f4",
						  dynamic_template_data:{
						  	link:`http://localhost:3000/verify/${user.password}`,
						  	firstName:user.firstName
						  }
						};
						return sgMail.send(msg)
}


router.post("/register", (req, res) => {
	const { firstName, lastName, email, password, phone } = req.body;
	if (!firstName || !lastName || !email || !password || !phone) {
		return res.status(400).send("Please enter all fields");
	}

	User.findOne({ email })
		.populate('comments')
		.populate('reservations')
		.then((user) => {
			if (user) {
				res.status(400).send("User already exists");
			}
			const newUser = new User({
				firstName,
				lastName,
				password,
				email,
				phone,
				reservations:[],
				comments:[],
				active:false
			});

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) {
						console.log(err);
						throw err;
					}
					newUser.password = hash;
					newUser.save().then((user) => {
						sendVerificationEmail(user).then(()=>{

							jwt.sign(
							{ id: user._id },
							"myJwtSecret",
							{ expiresIn: 3600 },
							(err, token) => {
								if (err) {
									throw err;
								}

								res.json({
									token,
									userData: {
										_id: user._id,
										firstName: user.firstName,
										lastName: user.lastName,
										email: user.email,
										comments:user.comments,
										reservations:user.reservations,
										phone:user.phone,
										active: user.active
									},
								});
							}
						);

						}).catch(err=>{
							res.status(500).send("Unable to send verification email.")
						})
					
						

					});
				});
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(400).send("Unable to create JSON Web Token.");
		});
});

router.post("/login", (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).send("Please enter all fields");
	}

	User.findOne({ email })
		.populate('comments')
		.populate('reservations')
		.then((user) => {
			console.log("user found", user)
			if (!user) {
				res.status(400).send("User does not exist");
			}

			bcrypt.compare(password, user.password).then((isMatch) => {
				if (!isMatch) {
					return res
						.status(400)
						.send("Invalid Credentials");
				}
				jwt.sign(
					{ id: user._id }, 
					"myJwtSecret",
					{ expiresIn: 3600 },
					(err, token) => {
						if (err) {
							throw err;
						}

						res.json({
							token,
							userData: {
								_id: user._id,
								firstName: user.firstName,
								lastName: user.lastName,
								email: user.email,
								comments:user.comments,
								reservations:user.reservations,
								phone:user.phone,
								active:user.active
							},
						});
					}
				);
			});
		})
		.catch((err) => {
			console.log(err);
			resstatus(400).send("Unable to create JSON Web Token");
		});
});

router.post('/verify', (req,res)=>{
	User.findOne({password:req.body.hash}, (err,user)=>{
		if(!user || err){
			res.status(400).send("Unable To Find User")
		}else if(user && user.active === true ){
			res.status(200).send("Account already verified")
		}else{
			user.active = true;
			user.save((err)=>{
				if(err){
					res.status(500).send("Unable to verify account. Please try again")
				}else{
					res.status(200).send("Account successfully verified");
				}
			})
		}
	})
})

router.get('/verify/:userId', auth, (req,res)=>{
	User.findById(req.params.userId, (err, user)=>{
		if(err){
			res.status(400).send("Cannot verify user.")
		}else{
			sendVerificationEmail(user)
			.then(()=>{
				res.status(200).send("Verification email successfully re-sent")
			})
			.catch(err=>{
				res.status(500).send("Unable to send email at this time")
			})
		}
	})
})

router.get("/data", auth, (req, res) => {
	User.findById(req.user.id)
		.select("-password")
		.populate('comments')
		.populate('reservations')
		.exec((err,user) => err ? res.status(400).send("Could not find user with id " + req.user.id) : res.json(user))
});

module.exports = router;
