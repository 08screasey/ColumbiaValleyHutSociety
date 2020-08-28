const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const verifyUser = require("../middleware/VerifyUser");
const Comment = require("../models/Comment.model");
const User = require("../models/User.model");
const News = require("../models/News.model");

router.put("/:id", auth, verifyUser, (req, res) => {
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

router.delete("/:postId/:commentId", auth, verifyUser, (req, res) => {
	News.findById(req.params.postId)
		.populate("comments")
		.exec((err, news) => {
			const comment = Comment.findOne({ _id: req.params.commentId });
			if (err) {
				res.status(500).send("Unable to locate news article.");
			} else if (
				req.user.id !== comment.userId &&
				req.user.id !== process.env.CVHS_ADMIN_ID
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

module.exports = router;