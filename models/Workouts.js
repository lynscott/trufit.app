const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSchema = new Schema({
  type: String,
  title: String,
  exercises: [Schema.Types.Mixed],
  workoutID: String,
});

module.exports = mongoose.model('workouts', workoutSchema);