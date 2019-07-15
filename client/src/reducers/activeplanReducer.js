import {PLAN_SELECTED} from '../actions';

export default function(state = null, action) {
  switch(action.type) {
  case PLAN_SELECTED:
    return action.payload;
  default:
    //nothing;
  }
  return state;
}
