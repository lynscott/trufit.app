import {TYPE_SELECTED} from '../actions';

export default function(state = "", action) {
  switch(action.type) {
  case TYPE_SELECTED:
    return action.payload;
  default:
    //nothin;
  }
  return state;
}
