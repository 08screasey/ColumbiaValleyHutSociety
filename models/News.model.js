const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let News = new Schema({
    header: { type: String },
    content: { type: String },
    date: { type: Date, default: Date.now },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
});

module.exports = mongoose.model('News', News);
