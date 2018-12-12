const mongoose = require('mongoose');
const { Schema } = mongoose;

const planSchema = require('./Plans');

const userSchema = new Schema ({
  googleID: String,
  facebookID: String,
  name: String,
  img: String,
  gender: String,
  currentWeight: Number,
  email: {type:String, unique:true, lowercase:true},
  passowrd: String,
  date: Date,
  plans: [String],
  provider: String
});

mongoose.model('users', userSchema);
