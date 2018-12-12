import { FETCH_USER, AUTH_USER, AUTH_ERROR } from '../actions';

const initialState = {
  authenticated: null,
  errorMessage: null
}

export default function(state = initialState, action ) {
  switch(action.type) {
    case FETCH_USER:
      return {
        ...state,
        authenticated: action.payload || null
      }
    case AUTH_USER:
      return {
        ...state,
        authenticated: action.payload
      }
    case AUTH_ERROR:
      return {
        ...state,
        errorMessage: action.payload
      }
    default:
      return state;
  }
}
