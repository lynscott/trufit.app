const mongoose = require('mongoose');
const { Schema } = mongoose;

const planSchema = new Schema({
  stats: [Schema.Types.Mixed], //Most likely [{workout_name, start:timestamp, end:timestamp, exercise:{name, weight, reps achieved}},,,{skip:tf, reason}]
  start_date: Date,
  end_date: Date,
  template: { type: Schema.Types.ObjectId, ref: 'PlanTemplate' },
  days: [Schema.Types.Mixed],
  percentage: {type:Number, default:0},
  notes: String,
  active: Boolean
});

module.exports = mongoose.model('plans', planSchema);
