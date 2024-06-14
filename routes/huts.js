const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const verifyUser = require('../middleware/VerifyUser');
const Hut = require('../models/Hut.model.js');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

router.get('/', auth, verifyUser, (req, res) => {
    Hut.find((err, huts) => {
        if (err) {
            res.status(500).send('Encountered a problem fetching cabin data');
        } else {
            res.status(200).send(huts);
        }
    });
});

router.get('/:hut', auth, verifyUser, (req, res) => {
    Hut.findOne({ name: req.params.hut }, (err, result) => {
        if (err) {
            res.status(500).send('Encountered a problem fetching cabin data');
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

router.post('/', (req, res) => {
    Hut.create(req.body, (err, hut) => {
        if (err) {
            res.status(500).send('Internal error creating new hut');
        } else {
            res.status(200).send({ 'hut created': hut });
        }
    });
});

module.exports = router;
