/** @format */

const mongoose = require("mongoose")
const {Schema} = mongoose

const nutritionSchema = new Schema(
    {
        name: String,
        created_date: Date,
        // log: [Schema.Types.Mixed], //DEPRECATED:
        type: String,
        schedule: Array,
        // scheduleData: [Schema.Types.Mixed],
        items: [{type: Schema.Types.ObjectId, ref: "Meal"}],
        creator: {type: Schema.Types.ObjectId, ref: "User"},
        cheats: [Schema.Types.Mixed] //{date, items:[{}]}
    },
    {usePushEach: true}
)

module.exports = mongoose.model("nutrition_plan", nutritionSchema)
