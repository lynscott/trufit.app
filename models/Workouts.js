const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutSchema = new Schema({
  category: String,
  exercise: String,
  sets: Number,
  reps: Number,
  time: String,
});

mongoose.model('plans', workoutSchema);