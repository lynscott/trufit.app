/** @format */

const mongoose = require("mongoose")
const {Schema} = mongoose

const logSchema = new Schema({
    item: [Schema.Types.Mixed],
    date: Date,
    meal: {type: Schema.Types.ObjectId, ref: "Meal"},
    _user: {type: Schema.Types.ObjectId, ref: "User"}
})

module.exports = mongoose.model("food_log", logSchema)
