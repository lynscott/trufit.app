const mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
// mongoose.set('debug', true);



module.exports.User = require("./User");
module.exports.Plans = require("./Plans");
module.exports.Exercises = require("./Exercises");
module.exports.UserProfile = require("./UserProfile");
module.exports.Workouts = require("./Workouts");
module.exports.Meals = require("./Meals");
module.exports.NutritionPlan = require("./NutritionPlan");
module.exports.PlanTemplates = require("./PlanTemplates");
