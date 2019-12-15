/** @format */

const mongoose = require("mongoose")
const {Schema} = mongoose

const workoutSchema = new Schema({
    type: String,
    title: String,
    exercises: [Schema.Types.Mixed], //May need to create model
    workoutID: String,
    log: [Schema.Types.Mixed] //Log data with reps/weight/date/difficulty/
})

module.exports = mongoose.model("workouts", workoutSchema)
