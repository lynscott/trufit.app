const mongoose = require('mongoose');
const { Schema } = mongoose;

const initialState = {
  nutrition: { name: 'Total', serving:'', serving_label:'', calories: 0, fats: 0, protein: 0, carb: 0 }
}

const userProfileSchema = new Schema ({
//   googleID: String,
  affirmation: {type:String, default:'Enter some text as a reminder why you won\'t quit!'},
  messages: {type:[String], default:[]},
  events: {type:[String], default:[]},
  progressPics: {type:[String], default:[]},
  weighIns: {type:[Object], default:[]},
  macros: {type:[Number], default:[]},
  calories: String,
  trainingTracker: Number,
  nutritionSchedule: {type:Schema.Types.Mixed, default:[{time:String, items:[Object]}]},
  nutritionItems: {type:Array, default:[{ name: 'Total', serving:'', serving_label:'', calories: 0, fats: 0, protein: 0, carb: 0 }]},
  email: {type:String, unique:true, lowercase:true},
  _user: { type: Schema.Types.ObjectId, ref: 'User' }
},{ usePushEach: true });

mongoose.model('profile', userProfileSchema);