
import mass_pic from '../img/mass.png';
import shred_pic from '../img/Shredded.png';
import tone_pic from '../img/Redefined.png';
export default function() {
  var shred = 'Program designed for maximum weight loss. Includes tailored nutrition and workout guides with cardio recommendations'
  var mass = 'Program designed for maximum lean mass gains. Includes tailored nutrition and workout guides with cardio recommendations'
  var tone = 'Program designed for muscle toning and fat loss. Includes tailored nutrition and workout guides with cardio recommendations'
  return [
    {name : 'Shredded - Fat Loss Plan', info : shred, img : shred_pic },
    {name : 'Muscle Up - Mass Gain Plan', info : mass, img : mass_pic},
    {name : 'Tone - Body Recomposition Plan', info : tone, img : tone_pic}
  ]
}
