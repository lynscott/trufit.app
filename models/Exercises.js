const mongoose = require('mongoose');
const { Schema } = mongoose;

const excerciseSchema = new Schema({
  exercises: [Object],
});

module.exports = mongoose.model('exercises', excerciseSchema);
