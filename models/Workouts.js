const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSchema = new Schema({
  type: String,
  title: String,
  exercises: [Schema.Types.Mixed],
  workoutID: String,
});

mongoose.model('workouts', workoutSchema);