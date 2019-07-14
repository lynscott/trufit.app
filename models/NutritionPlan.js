const mongoose = require('mongoose');
const { Schema } = mongoose;

const nutritionSchema = new Schema({
  day: String, //Optional
  name: String,
  created_date: Date,
  log: [Schema.Types.Mixed],
  type: String,
  scheduleData: [Schema.Types.Mixed],
  items: [{ type: Schema.Types.ObjectId, ref: 'Meal' }],
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  cheats: [Schema.Types.Mixed] //{date, items:[{}]}
}, { usePushEach: true });

module.exports = mongoose.model('nutrition_plan', nutritionSchema);