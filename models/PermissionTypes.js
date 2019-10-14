const mongoose = require('mongoose');
const { Schema } = mongoose;

const permissionSchema = new Schema({
  name: String,
  allows: String,
});

module.exports = mongoose.model('workouts', permissionSchema);