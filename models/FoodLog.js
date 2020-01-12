/** @format */

const mongoose = require("mongoose")
const {Schema} = mongoose

const logSchema = new Schema({
    items: [Schema.Types.Mixed],
    date: Date,
    _user: {type: Schema.Types.ObjectId, ref: "User"}
})

module.exports = mongoose.model("food_log", logSchema)
