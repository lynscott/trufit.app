import { FETCH_USER, AUTH_USER } from '../actions';

const initialState = {
  authenticated: null
}

export default function(state = initialState, action ) {
  switch(action.type) {
    case FETCH_USER:
      return action.payload || false;
    case AUTH_USER:
      return {
        ...state,
        authenticated:
      }
    default:
      return state;
  }
}
