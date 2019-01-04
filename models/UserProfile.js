const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');

// const planSchema = require('./Plans');

const userProfileSchema = new Schema ({
//   googleID: String,
  affirmation: String,
  messages: String,
  events: String,
  progressPics: [String],
  macros: Number,
  trainingTracker: Number,
  nutritionTracker: [String],
  email: {type:String, unique:true, lowercase:true},
  _user: { type: Schema.Types.ObjectId, ref: 'User' }
});