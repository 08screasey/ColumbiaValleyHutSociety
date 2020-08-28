const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const News = require("./models/news.model");
const Moment = require("moment");
const MomentRange = require("moment-range");
const Booking = require("./models/bookings.model");
const Hut = require("./models/Hut.model");
const Comment = require("./models/comment.model");
const User = require("./models/User.model");
const cors = require("cors");
const paypal = require("paypal-rest-sdk");
const auth = require("./middleware/auth");
const sgMail = require("@sendgrid/mail");
const verifyUser = require("./middleware/VerifyUser");
const moment = MomentRange.extendMoment(Moment);

app.use(bodyParser.json());
app.use(cors());

const newsRoutes = express.Router();
const commentRoutes = express.Router();
const bookingRoutes = express.Router();
const hutRoutes = express.Router();
app.use("/bookings", bookingRoutes);
app.use("/news", newsRoutes);
app.use("/huts", hutRoutes);
app.use("/comments", commentRoutes);

mongoose.connect(
	"mongodb+srv://screasey:njL0gYvK1lfSiWMb@cvhscluster-jxhhj.mongodb.net/test?retryWrites=true&w=majority",
	{ useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("connected to database");
});

paypal.configure({
	mode: "sandbox", //sandbox or live
	client_id:
		"AcpVrNSnkzIKYfkYidDROb4mi3J51puEKMnmpomsxdbVO-KRyYY45yPCd2-lYkx8NJDDoF2x49KQQTKN",
	client_secret:
		"EKy3FPw9wjIGiIZlVcFGvWR2uaMwLDJuqWLRIZVKZW-_de4pTvlViFPOshpxk3GuVeq3kLz1JB7TNksh",
});

sgMail.setApiKey(
	"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"
);

//SendGrid email API key: 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
//SendGrid node API key:

//Routes to fetch News articles

newsRoutes.get("/", (req, res) => {
	News.find()
		.populate("comments")
		.exec((err, news) => {
			if (err) {
				res.status(503).send("Unable to locate update posts.");
			} else {
				const sortedNews = news.sort((a, b) => b.date - a.date);
				res.status(200).json(sortedNews);
			}
		});
});

newsRoutes.route("/").post((req, res) => {
	News.create(req.body, (err, news) => {
		if (err) {
			res.status(503).send("There was an issue creating new update.");
		} else {
			res.status(200).send(news);
		}
	});
});

newsRoutes.delete("/:id", auth, (req, res) => {
	if (req.user.id !== "5f32e85f17bc722350c0bdca") {
		res.status(401).send("Not Authorized to delete updates.");
	} else {
		Comment.find({ articleId: req.params.id }, (err, comments) => {
			comments.forEach((comment) => {
				User.findById(comment.userId, (err, user) => {
					user.comments.pull({ _id: comment._id });
					user.save();
					comment.remove();
				});
			});
			News.findByIdAndRemove(req.params.id, (err, news) => {
				if (err) {
					res.status(500).send("Unable to delete post.");
				} else {
					res.status(200).send("Post successfully deleted.");
				}
			});
		});
	}
});

newsRoutes.put("/:id", auth, (req, res) => {
	if (req.user.id !== "5f32e85f17bc722350c0bdca") {
		res.status(401).send("Not Authorized to edit updates.");
	}
	console.log(req.body);

	News.findByIdAndUpdate(
		req.params.id,
		req.body.post,
		{ new: true },
		(err, news) => {
			console.log(news);
			if (err || !news) {
				res.status(500).send("Post was not updated. Please try again.");
			} else {
				res.status(200).send(news);
			}
		}
	);
});

//Routes for access to comments, posting and deleting.

commentRoutes.put("/:id", auth, verifyUser, (req, res) => {
	Comment.create(
		{ ...req.body, articleId: req.params.id },
		(err, comment) => {
			if (err) {
				res.status(500).send("Error creating comment");
			} else {
				News.findOne({ _id: req.params.id }, (err, news) => {
					news.comments.push(comment);
					news.save((err, news) => {
						if (err) {
							res.status(500).send(
								"Unable to save comment to article"
							);
						} else {
							User.findById(req.user.id, (err, user) => {
								if (err) {
									res.status(500).send(
										"unable to store comment in user profile",
										err
									);
								} else {
									user.comments.push(comment);
									user.save((err) => {
										if (err) {
											res.status(500).send(
												"there was an error saving this user"
											);
										} else {
											res.status(200).json({
												comment: comment,
												message:
													"Comment successfully submitted",
											});
										}
									});
								}
							});
						}
					});
				});
			}
		}
	);
});

commentRoutes.delete("/:postId/:commentId", auth, verifyUser, (req, res) => {
	News.findById(req.params.postId)
		.populate("comments")
		.exec((err, news) => {
			const comment = Comment.findOne({ _id: req.params.commentId });
			if (err) {
				res.status(500).send("Unable to locate news article.");
			} else if (
				req.user.id !== comment.userId &&
				req.user.id !== "5f32e85f17bc722350c0bdca"
			) {
				res.status(401).send(
					"You do not have permission to delete this comment"
				);
			}
			news.comments.remove({ _id: req.params.commentId });
			news.save((err) => {
				if (err) {
					res.status(500).send(
						"There was an error pulling the comment"
					);
				} else {
					User.findById(req.user.id)
						.populate("comments")
						.exec((err, user) => {
							if (err) {
								res.status(500).send(
									"There was an error fetching user" +
										req.user.id
								);
							} else {
								user.comments.remove({
									_id: req.params.commentId,
								});
								user.save((err) => {
									if (err) {
										res.status(500).send(
											"Unable to save user, please try again."
										);
									}
									Comment.findByIdAndDelete(
										req.params.commentId,
										(err, comment) => {
											if (err) {
												res.status(500).send(
													"There was an error deleting the comment from the database"
												);
											} else {
												res.status(200).send(
													"Comment successfully deleted"
												);
											}
										}
									);
								});
							}
						});
				}
			});
		});
});

//fetch all bookings

//bookingRoutes.get("/", (req, res) => {
//	Booking.find((err, bookings) => {
//if (err) {
//			res.status(400).send({ error: err });
//} else {
//	res.status(200).send(bookings);
//}
//	});
//});

bookingRoutes.post("/search", auth, (req, res) => {
	console.log(req.body);
	if (req.user.id !== "5f32e85f17bc722350c0bdca") {
		res.status(401).send("Not Authorized");
	} else {
		const locator = {};
		locator[req.body.type] = req.body.query;
		console.log(locator);
		Booking.find(locator, (err, bookings) => {
			if (err) {
				res.status(500).send("Unable to search bookings");
			} else if (!bookings) {
				res.status(400).send("No Bookings Found");
			} else {
				console.log(bookings);
				res.status(200).send(bookings);
			}
		});
	}
});

//admin route for deleting booking
bookingRoutes.delete("/search/:id", auth, (req, res) => {
	if (req.user.id !== "5f32e85f17bc722350c0bdca") {
		res.status(401).send("Permission Denied");
	}
	Booking.findByIdAndRemove(req.params.id, (err, booking) => {
		if (err) {
			console.log("ERROR Locating booking");
			res.status(500).send("Problem locating booking");
		} else {
			var data = {
				amount: {
					total: parseFloat(booking.price) * 0.8,
					currency: "CAD",
				},
			};
			paypal.sale.refund(booking.paymentId, data, function (
				error,
				refund
			) {
				if (error) {
					console.error(JSON.stringify(error));
				} else {
					console.log("Refund Sale Response");
					console.log(JSON.stringify(refund));
					Hut.findOne({ name: booking.hut })
						.populate("bookings")
						.exec((err, hut) => {
							if (err) {
								console.log("ERROR Locating hut");
								res.status(500).send("Problem locating hut");
							} else {
								booking.dates.forEach((date) => {
									hut.filledDates.pull(date);
								});
								hut.bookings.pull({ _id: booking._id });
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
bookingRoutes.put("/search/:id/edit", auth, (req, res) => {
	console.log(req.body);
	if (req.user.id !== "5f32e85f17bc722350c0bdca") {
		res.status(401).send("Permission Denied");
	}
	
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
						console.log(booking.dates, "PRE");
						booking.dates.forEach((date) => {
							hut.filledDates.pull(date);
						});
						booking.dates = req.body.dates;
						req.body.dates.forEach((date) => {
							hut.filledDates.push(date);
						});
						console.log(booking.dates, "POST");
						booking.save();
						hut.save();
						res.status(200).send("Booking successfully updated");
					}

					for (let key in req.body.userData) {
						if (req.body.userData[key] !== booking.userData[key]) {
							booking.userData[key] = req.body.userData[key];
						}
					}
				}
			});
		}
	});
});

//add a temporary reservation to a hut, with 15 minutes setTimeout before removal
bookingRoutes.post("/:hut", auth, verifyUser, (req, res) => {
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
				console.log(hut);
				setTimeout(() => {
					hut.temporaryBookings.id(newBooking._id).remove();
					hut.save();
				}, 900000);
				if (err) {
					res.status(400).send(
						"There was an issue creating your temporary booking"
					);
				} else {
					let price = hut.price[0] * slicedDates.length;
					//Iterate along the recorded prices.
					if (hut.price.length > 1) {
						price = slicedDates.reduce((acc, date, index) => {
							return acc + hut.price[index];
						}, 0);
					}

					console.log(price);

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
											price: "" + price + ".00",
											currency: "CAD",
											quantity: 1,
										},
									],
								},
								amount: {
									currency: "CAD",
									total: "" + price + ".00",
								},
								description: "This is the payment description.",
							},
						],
					};
					console.log(create_payment_json);

					paypal.payment.create(create_payment_json, function (
						error,
						payment
					) {
						if (error) {
							console.log(error);
						} else {
							for (let i = 0; i < payment.links.length; i++) {
								if (payment.links[i].rel === "approval_url") {
									res.status(200).json({
										name: hut.name,
										dates: dates,
										paypalLink: payment.links[i].href,
									});
								}
							}
							console.log("Create Payment Response");
							console.log(payment);
						}
					});
				}
			});
		}
	});
});

//Finalising booking, first checking if the date is already booked or whether it is in temporary hold with a different user

bookingRoutes.post("/:hut/book", auth, verifyUser, (req, res) => {
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
			let price = hut.price[0] * slicedDates.length;
			//Iterate along the recorded prices.
			if (hut.price.length > 1) {
				price = slicedDates.reduce((acc, date, index) => {
					return acc + hut.price[index];
				}, 0);
			}

			console.log(price);

			const execute_payment_json = {
				payer_id: req.body.paymentInfo.payerId,
				transactions: [
					{
						amount: {
							currency: "CAD",
							total: "" + price + ".00",
						},
					},
				],
			};

			paypal.payment.execute(
				req.body.paymentInfo.paymentId,
				execute_payment_json,
				function (error, payment) {
					if (error) {
						console.log(error.response);
						throw error;
					} else {
						if (
							payment.state === "approved" &&
							payment.transactions &&
							payment.transactions[0].related_resources &&
							payment.transactions[0].related_resources[0].sale
						) {
							console.log(
								"order authorization completed successfully"
							);
							// Capture order id
							const orderData =
								payment.transactions[0].related_resources[0]
									.sale.id;

							console.log(payment);
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
										console.log(booking);
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
																				console.log(
																					msg
																				);
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

hutRoutes.get("/", auth, verifyUser, (req, res) => {
	Hut.find((err, huts) => {
		if (err) {
			res.status(500).send("Encountered a problem fetching cabin data");
		} else {
			res.status(200).send(huts);
		}
	});
});

hutRoutes.get("/:hut", auth, verifyUser, (req, res) => {
	Hut.findOne({ name: req.params.hut }, (err, result) => {
		if (err) {
			res.status(500).send("Encountered a problem fetching cabin data");
		} else {
			const selectedHut = { ...result._doc };
			let unavailableDates = [];
			let sortedDates = [];
			if (selectedHut.filledDates && selectedHut.filledDates.length > 1) {
				unavailableDates.push(...selectedHut.filledDates);
			}
			if (selectedHut.temporaryBookings.length > 0) {
				selectedHut.temporaryBookings.forEach((booking) => {
					unavailableDates = unavailableDates.concat(booking.dates);
				});
			}
			sortedDates = unavailableDates.sort((a, b) => {
				return moment(a) - moment(b);
			});
			selectedHut.filledDates = sortedDates;
			res.status(200).json(selectedHut);
		}
	});
});

hutRoutes.post("/", (req, res) => {
	Hut.create(req.body, (err, hut) => {
		if (err) {
			res.status(500).send("Internal error creating new hut");
		} else {
			res.status(200).send({ "hut created": hut });
		}
	});
});

app.use("/users", require("./routes/users"));

app.listen(8000, () => {
	console.log("server up");
});
