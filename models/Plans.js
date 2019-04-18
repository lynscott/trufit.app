const mongoose = require('mongoose');
const { Schema } = mongoose;

const planSchema = new Schema({
  planName: String,
  category: String,
  logo: String,
  template: Object,
  workouts: String,
  pdf: String
});

mongoose.model('plans', planSchema);
