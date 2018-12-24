const mongoose = require('mongoose');
const { Schema } = mongoose;

const excerciseSchema = new Schema({
  exercises: [Object],
});

mongoose.model('exercises', excerciseSchema);
