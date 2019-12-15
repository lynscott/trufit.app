/** @format */

const mongoose = require("mongoose")
const {Schema} = mongoose

const mealSchema = new Schema({
    items: [Schema.Types.Mixed], //{ items[{}]}
    time: Date,
    log: {type: Object, default: {}},
    calories: Number,
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    name: String
})

module.exports = mongoose.model("meal", mealSchema)
