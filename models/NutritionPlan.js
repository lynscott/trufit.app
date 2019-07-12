const mongoose = require('mongoose');
const { Schema } = mongoose;

const nutritionSchema = new Schema({
  day: String, //Optional
  name: String,
  created_date: Date,
  completions: [Date],
  type: String,
  scheduleData: [Schema.Types.Mixed],
  items: [{ type: Schema.Types.ObjectId, ref: 'Meal' }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  cheats: [Schema.Types.Mixed] //{date, items:[{}]}
});

module.exports = mongoose.model('nutrition_plan', nutritionSchema);