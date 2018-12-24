import { FETCH_USER, AUTH_USER, AUTH_ERROR, MOUNT_TOKEN } from '../actions'

const initialState = {
  token: null,
  errorMessage: null,
  user: null
}

export default function(state = initialState, action ) {
  switch(action.type) {
    case FETCH_USER:
      return {
        ...state,
        user: action.payload || null,
      }
    case AUTH_USER:
      return {
        ...state,
        user: action.user,
        token: action.payload
      }
    case AUTH_ERROR:
      return {
        ...state,
        errorMessage: action.payload
      }
    case MOUNT_TOKEN:
      return {
        ...state,
        token: action.payload
      }
    default:
      return state
  }
}
