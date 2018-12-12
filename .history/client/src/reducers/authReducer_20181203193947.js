import { FETCH_USER, AUTH_USER } from '../actions';

const initialState = {
  authenticated: null,
  errorMessage: null
}

export default function(state = initialState, action ) {
  switch(action.type) {
    case FETCH_USER:
      return action.payload || false;
    case AUTH_USER:
      return {
        ...state,
        authenticated: action.payload
      }
    default:
      return state;
  }
}
