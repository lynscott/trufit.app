const mongoose = require('mongoose');
const { Schema } = mongoose;

const planSchema = new Schema({
  planName: String,
  dateStarted: Date,
  datePurchased: Date,
  weight: Number,
  height: Number,
  age: Number,
  body_fat: Number,
  activity_mod: Number,
  _user: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('plans', planSchema);
