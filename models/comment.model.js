
const mongoose = require("mongoose");

let Comment = new mongoose.Schema({
	date: { type: Date, default:Date.now},
		author: String,
		content: String,
		userId:String,
		articleId:String
		});

module.exports = mongoose.model("Comment", Comment);
