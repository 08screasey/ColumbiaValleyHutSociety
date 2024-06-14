const mongoose = require('mongoose');
const User = require('../models/User.model');

const verifyUser = (req, res, next) => {
    User.findById(req.user.id, (err, user) => {
        if (err || !user) {
            res.status(401).send('you are not the user who wrote this comment');
        } else if (!user.active) {
            res.status(401).send('Activate account to proceed further');
        } else {
            next();
        }
    });
};

module.exports = verifyUser;
