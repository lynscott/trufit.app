import { FETCH_USER, AUTH_USER } from '../actions';

const initialState = {
  authenticated: ''
}

export default function(state = initialState, action ) {
  switch(action.type) {
    case FETCH_USER:
      return action.payload || false;
    case AUTH_USER:
      return 
    default:
      return state;
  }
}
