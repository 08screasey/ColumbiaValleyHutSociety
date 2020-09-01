const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const verifyUser = require("../middleware/VerifyUser");
const Booking = require("../models/Booking.model.js");
const Hut = require("../models/Hut.model.js");
const User = require("../models/User.model.js");
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const paypal = require("paypal-rest-sdk");
const priceCalc = require("../utilityFunctions/priceCalc");
const sgMail = require('@sendgrid/mail');

paypal.configure({
	mode: process.env.PAYPAL_ENV,
	client_id:
		process.env.PAYPAL_CLIENT_ID,
	client_secret:
		process.env.PAYPAL_CLIENT_SECRET,
});

router.post("/search", auth, (req, res) => {
	if (req.user.id !== process.env.CVHS_ADMIN_ID) {
		res.status(401).send("Not Authorized");
	} else {
		const locator = {};
		locator[req.body.type] = req.body.query;
		Booking.find(locator, (err, bookings) => {
			if (err) {
				res.status(500).send("Unable to search bookings");
			} else if (!bookings) {
				res.status(400).send("No Bookings Found");
			} else {

				res.status(200).send(bookings);
			}
		});
	}
});

//admin route for deleting booking
router.delete("/search/:id", auth, admin, (req, res) => {
	Booking.findById(req.params.id, (err, booking) => {
		if (err) {
			res.status(500).send("Problem locating booking");
		} else {
			var data = {
				amount: {
					total: (parseFloat(booking.price) * 0.8).toFixed(2),
					currency: "CAD",
				},
			};
			paypal.sale.refund(booking.paymentId, data, function (
				error,
				refund
			) {
				if (error) {
					res.status(501).send("Could Not process refund.")
				} else {
					
					Hut.findOne({ name: booking.hut })
						.populate("bookings")
						.exec((err, hut) => {
							if (err) {
								
								res.status(500).send("Problem locating hut");
							} else {
								booking.dates.forEach((date) => {
									hut.filledDates.pull(date);
								});
								hut.bookings.pull({ _id: booking._id });
								booking.remove();
								hut.save();
								res.status(200).send(
									"Booking successfully cancelled"
								);
							}
						});
				}
			});
		}
	});
});

//admin route for editing booking
router.put("/search/:id/edit", auth, admin, (req, res) => {
	Booking.findById(req.params.id, (err, booking) => {
		if (err || !booking) {
			res.status(404).send("Booking not found.");
		} else {
			Hut.findOne({ name: booking.hut }, (err, hut) => {
				if (err || !hut) {
					res.status(404).send("Hut not found.");
				} else {
					let flagged = false;
					req.body.dates.forEach((date) => {
						if (flagged) {
							return;
						} else {
							flagged =
								hut.filledDates.indexOf(date) !== -1 &&
								booking.dates.indexOf(date) === -1;
						}
					});

					if (flagged) {
						res.status(401).send("Date has already been booked.");
					} else {
						booking.dates.forEach((date) => {
							hut.filledDates.pull(date);
						});
						booking.dates = req.body.dates;
						req.body.dates.forEach((date) => {
							hut.filledDates.push(date);
						});
						for (let key in req.body.userData) {
						if (req.body.userData[key] !== booking.userData[key]) {
							booking.userData[key] = req.body.userData[key];
							}
						}
						booking.price = priceCalc(hut.price, req.body.dates);
						booking.save();
						hut.save();
						res.status(200).send("Booking successfully updated");
					}

					
				}
			});
		}
	});
});

//add a temporary reservation to a hut, with 15 minutes setTimeout before removal
router.post("/:hut", auth, verifyUser, (req, res) => {
	Hut.findOne({ name: req.params.hut }, (err, hut) => {
		//checking whether date is already on hold or booked
		const range = moment.range(req.body.date1, req.body.date2);
		const dates = Array.from(range.by("day")).map((date) =>
			moment(date).format("ddd MMM DD YYYY")
		);
		const slicedDates = dates.slice();
		if (dates.length > hut.maxNights) {
			res.status(400).send("Too many dates selected!");
		}
		let flagged = false;
		slicedDates.forEach((date) => {
			hut.temporaryBookings.forEach((booking) => {
				if (
					!flagged &&
					booking.dates.indexOf(date) !== -1 &&
					booking.userId !== req.body.userId
				) {
					flagged = true;
				} else {
					return;
				}
			});
			if (!flagged && hut.filledDates.indexOf(date) !== -1) {
				flagged = true;
			} else {
				return;
			}
		});
		//if it was flagged as already booked send error message, otherwise add a temp booking
		if (flagged) {
			res.status(400).send(
				"One or more of the selected dates has already been booked"
			);
		} else {
			const newBooking = hut.temporaryBookings.create({
				dates: slicedDates,
				userId: req.body.userId,
			});
			hut.temporaryBookings.push(newBooking);
			hut.save((err, hut) => {
				
				setTimeout(() => {
					hut.temporaryBookings.id(newBooking._id).remove();
					hut.save();
				}, 900000);
				if (err) {
					res.status(400).send(
						"There was an issue creating your temporary booking"
					);
				} else {

					let price = priceCalc(hut.price, slicedDates);

					var create_payment_json = {
						intent: "sale",
						payer: {
							payment_method: "paypal",
						},
						redirect_urls: {
							return_url:
								"http://localhost:3000/reservations/success",
							cancel_url:
								"http://localhost:3000/reservations/cancel",
						},
						transactions: [
							{
								item_list: {
									items: [
										{
											name: `${req.params.hut}: ${req.user.id}`,
											sku: "item",
											price: price,
											currency: "CAD",
											quantity: 1,
										},
									],
								},
								amount: {
									currency: "CAD",
									total: price ,
								},
								description: "This is the payment description.",
							},
						],
					};
					

					paypal.payment.create(create_payment_json, function (
						error,
						payment
					) {
						if (error) {
							
						} else {
							for (let i = 0; i < payment.links.length; i++) {
								if (payment.links[i].rel === "approval_url") {
									res.status(200).json({
										name: hut.name,
										dates: dates,
										price:price,
										paypalLink: payment.links[i].href,
									});
								}
							}
						}
					});
				}
			});
		}
	});
});

//Finalising booking, first checking if the date is already booked or whether it is in temporary hold with a different user

router.post("/:hut/book", auth, verifyUser, (req, res) => {
	let slicedDates = req.body.dates.map((date) => {
		return moment(date).format("ddd MMM DD YYYY");
	});

	Hut.findOne({ name: req.params.hut }, (err, hut) => {
		//checking whether date is already on hold or booked
		let flagged = false;
		slicedDates.forEach((date) => {
			hut.temporaryBookings.forEach((booking) => {
				if (
					!flagged &&
					booking.dates.indexOf(date) !== -1 &&
					booking.userId !== req.body.userData.userId
				) {
					flagged = true;
				} else {
					return;
				}
			});
			if (!flagged && hut.filledDates.indexOf(date) !== -1) {
				flagged = true;
			} else {
				return;
			}
		});
		if (flagged) {
			res.status(400).send(
				"One or more of the selected dates has already been booked"
			);
		} else {
			let price = priceCalc(hut.price, slicedDates)

			const execute_payment_json = {
				payer_id: req.body.paymentInfo.payerId,
				transactions: [
					{
						amount: {
							currency: "CAD",
							total: price,
						},
					},
				],
			};

			paypal.payment.execute(
				req.body.paymentInfo.paymentId,
				execute_payment_json,
				function (error, payment) {
					if (error) {
						throw error;
					} else {
						if (
							payment.state === "approved" &&
							payment.transactions &&
							payment.transactions[0].related_resources &&
							payment.transactions[0].related_resources[0].sale
						) {
							
							// Capture order id
							const orderData =
								payment.transactions[0].related_resources[0]
									.sale.id;
							Booking.create(
								{
									...req.body,
									dates: slicedDates,
									hut: req.params.hut,
									paymentId: orderData,
									price: price,
								},
								(err, booking) => {
									if (err) {
										res.status(500).send(
											"There was an unknown issue creating booking."
										);
									} else {
										
										Hut.findOne(
											{ name: req.params.hut },
											(err, hut) => {
												hut.bookings.push(booking);
												slicedDates.forEach((date) => {
													hut.filledDates.push(
														moment(date).format(
															"ddd MMM DD YYYY"
														)
													);
												});
												hut.save((err, hut) => {
													if (err) {
														res.status(500).send(
															"There was an unknown issue saving booking."
														);
													} else {
														User.findById(
															req.user.id,
															(err, user) => {
																if (err) {
																	res.status(
																		500
																	).send(
																		"Cannot locate user with Id " +
																			req
																				.user
																				.id
																	);
																} else {
																	user.reservations.push(
																		booking
																	);
																	user.save(
																		(
																			err
																		) => {
																			if (
																				err
																			) {
																				res.status(
																					500
																				).send(
																					"Unable to save user " +
																						req
																							.user
																							.id
																				);
																			} else {
																				let hut = booking.hut
																					.replace(
																						"-",
																						" "
																					)
																					.split(
																						""
																					);
																				hut[0] = hut[0].toUpperCase();

																				const msg = {
																					to:
																						booking
																							.userData
																							.email,
																					from:
																						"columbiavalleyhutsociety@gmail.com",
																					template_id:
																						"d-8f5c2ac1d9e84615a1cd14e8eae34479",
																					dynamic_template_data: {
																						_id:
																							"" +
																							booking._id,
																						name:
																							booking
																								.userData
																								.name,
																						date: new Date(
																							booking.dates[0]
																						).toLocaleDateString(),
																						date2: new Date(
																							booking.dates[
																								booking
																									.dates
																									.length -
																									1
																							]
																						).toLocaleDateString(),
																						email:
																							booking
																								.userData
																								.email,
																						mobile:
																							booking
																								.userData
																								.mobile,
																						cabin: hut.join(
																							""
																						),
																					},
																				};
																				sgMail.send(
																					msg
																				);
																				res.status(
																					200
																				).send(
																					{
																						booking: booking,
																						hut: hut,
																					}
																				);
																			}
																		}
																	);
																}
															}
														);
													}
												});
											}
										);
									}
								}
							);
						}
					}
				}
			);
		}
	});
});

module.exports = router;
