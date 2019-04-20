const mongoose = require('mongoose');
const { Schema } = mongoose;

const initialState = {
  nutrition: { name: 'Total', serving:'', serving_label:'', calories: 0, fats: 0, protein: 0, carb: 0 }
}

const userProfileSchema = new Schema ({
//   googleID: String,
  affirmation: {type:String, default:"Hey there! I'm your affirmation text! Double tap me and enter something as a reminder why you won\'t quit!"},
  messages: {type:[String], default:[]},
  events: {type:[String], default:[]},
  progressPics: {type:[String], default:[]},
  weighIns: {type:[Object], default:[]},
  macros: {type:Object, default:{}},
  baseSomaType: {type:Object},
  calories: String,
  currentGoal: {type:Object, default:{text:'Choose a Goal', value:0}},
  trainingTracker: Number,
  nutritionSchedule: [Schema.Types.Mixed],
  nutritionItems: {type:Array, default:[{ name: 'Total', serving:'', serving_label:'', calories: 0, fats: 0, protein: 0, carb: 0 }]},
  email: {type:String, unique:true, lowercase:true},
  _user: { type: Schema.Types.ObjectId, ref: 'User' }
},{ usePushEach: true });

mongoose.model('profile', userProfileSchema);