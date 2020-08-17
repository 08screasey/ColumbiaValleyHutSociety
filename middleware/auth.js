const jwt = require("jsonwebtoken"); 
const User = require("../models/User.model");

const auth = (req, res, next) => {
	const token = req.header("x-auth-token");

	if (!token) {
		res.status(401).send("No Token, authorization denied");
	}
	try {
		const decoded = jwt.verify(token, "myJwtSecret");
		req.user = decoded;
					next();
	
	} catch (e) {
		res.status(401).send("Token not valid");
	}
};

module.exports = auth;
