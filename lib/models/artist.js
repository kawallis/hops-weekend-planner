const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const beer = require('./beer');

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    songs: [song.schema]
});

module.exports = mongoose.model('Brewery', schema);