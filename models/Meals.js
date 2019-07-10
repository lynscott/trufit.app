const mongoose = require('mongoose');
const { Schema } = mongoose;

const mealSchema = new Schema({
  items: [Schema.Types.Mixed], //{ items[{}]}
  time: Date, 
  completions: [Date],
  calories: Number,
  creator: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('meal', mealSchema);