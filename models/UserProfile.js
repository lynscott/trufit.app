/** @format */

const mongoose = require("mongoose")
const {Schema} = mongoose

const userProfileSchema = new Schema(
    {
        affirmation: {
            type: String,
            default: ""
        },
        messages: [Schema.Types.Mixed],
        events: {type: [String], default: []},
        progressPics: {type: [String], default: []},

        weighIns: [Schema.Types.Mixed],
        macros: {type: Object, default: {}},
        calorieGoal: String,
        tbw: Number,
        currentGoal: Number,
        currentWeight: Number,
        neat: Number,
        priorExp: Number,
        hoursActive: Number,
        goal: Number,

        activeTrainingPlan: {type: Schema.ObjectId, ref: "Plans"},
        activeNutritionPlan: {type: Schema.ObjectId, ref: "NutritionPlan"},
        _user: {type: Schema.Types.ObjectId, ref: "User"},

        trainingPlans: [{type: Schema.ObjectId, ref: "Plans"}],
        foodLogs: [{type: Schema.ObjectId, ref: "FoodLog"}]
    },
    {usePushEach: true}
)

module.exports = mongoose.model("profile", userProfileSchema)
