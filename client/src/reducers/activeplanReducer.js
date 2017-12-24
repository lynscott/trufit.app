import {PLAN_SELECTED} from '../actions';

export default function(state = "", action) {
  switch(action.type) {
  case PLAN_SELECTED:
    return action.payload;
  default:
    //nothing;
  }
  return state;
}
