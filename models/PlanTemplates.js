const mongoose = require('mongoose');
const { Schema } = mongoose;

//For future plans creations from outside sources
const planTemplateSchema = new Schema({
  name: String,
  category: String,
  logo: String,
  workouts: [{ type: Schema.Types.ObjectId, ref: 'Workouts' }],
  pdf: String,
  creator: String,
  created_date: Date,
  description: String,
  updated: Date,
  ratings: [Schema.Types.Mixed],
  difficulty: String,
  video_url: String,
  socials: [Schema.Types.Mixed]
});

module.exports = mongoose.model('plan_templates', planTemplateSchema);
