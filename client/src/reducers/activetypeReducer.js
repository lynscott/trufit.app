import {TYPE_SELECTED} from '../actions'

let initState = {
  activeType: null
}

export default function(state = '', action) {
  switch(action.type) {
  case TYPE_SELECTED:
    return action.payload
  default:
    //nothin;
  }
  return state;
}
