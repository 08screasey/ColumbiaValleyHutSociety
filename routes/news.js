const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const News = require("../models/News.model");
const Comment = require("../models/Comment.model");
const User = require("../models/User.model");

router.get("/", (req, res) => {
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

router.route("/").post((req, res) => {
	News.create(req.body, (err, news) => {
		if (err) {
			res.status(503).send("There was an issue creating new update.");
		} else {
			res.status(200).send(news);
		}
	});
});

router.delete("/:id", auth, admin, (req, res) => {
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
					res.status(200).send(news);
				}
			});
		});
	
});

router.put("/:id", auth, admin, (req, res) => {
	News.findByIdAndUpdate(
		req.params.id,
		req.body.post,
		{new:true},
		(err, news) => {
			if (err || !news) {
				res.status(500).send("Post was not updated. Please try again.");
			} else {
				res.status(200).send(news);
			}
		}
	);
});

module.exports = router;
