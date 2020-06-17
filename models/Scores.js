/** @format */

const mongoose = require("mongoose")
const {Schema} = mongoose

const anonScoreSchema = new Schema({
    username: {type: String, unique: true, lowercase: true},
    score: Number,
    date: Date,
    country: String,
})

module.exports = mongoose.model("scores", anonScoreSchema)
