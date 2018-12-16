import { FETCH_USER, AUTH_USER, AUTH_ERROR, MOUNT_TOKEN } from '../actions';

const initialState = {
  authenticated: null,
  errorMessage: null,
  user: null
}

export default function(state = initialState, action ) {
  switch(action.type) {
    case FETCH_USER:
      return {
        ...state,
        user: action.payload || null
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
    case MOUNT_TOKEN:
      return {
        ...state,
        authenticated: action.payload
      }
    default:
      return state;
  }
}
