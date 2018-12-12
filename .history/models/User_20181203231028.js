const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');

const planSchema = require('./Plans');

const userSchema = new Schema ({
  googleID: String,
  facebookID: String,
  name: String,
  img: String,
  gender: String,
  currentWeight: Number,
  email: {type:String, unique:true, lowercase:true},
  password: String,
  date: Date,
  plans: [String],
  provider: String
});


// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this;
  console.log(user.password)
  console.log(user, 'user model')
  if (!user.password) {return next('No password present')}


  // generate a salt then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, userPassword ,callback) {
  console.log(bcrypt.compareSync(candidatePassword, userPassword))
  bcrypt.compare(candidatePassword, userPassword, function(err, isMatch) {
    if (err) { return callback(err); }
    console.log(candidatePassword, userPassword)
    callback(null, isMatch);
  });
}

mongoose.model('users', userSchema);
