import { FETCH_USER_AUTHENTICATING, FETCH_USER, AUTH_USER, AUTH_ERROR, MOUNT_TOKEN, FETCH_PROFILE, UPDATE_PROFILE, USER_SIGNUP, RESET_SIGNUP_FAIL } from '../actions'

const initialState = {
  token: null,
  errorMessage: null,
  user: null,
  userProfile: null,
  signUp: false,
  signUpFail: false,
  isAuthenticating: true

}

export default function(state = initialState, action ) {
  switch(action.type) {
    case FETCH_USER_AUTHENTICATING:
      return {
        ...state,
        isAuthenticating: true
      }
    case FETCH_USER:
      return {
        ...state,
        isAuthenticating: false,
        user: action.payload || null,
      }
    case USER_SIGNUP:
      return {
        ...state,
        signUp:true,
      }
    case AUTH_USER:
      return {
        ...state,
        user: action.user,
        token: action.payload,
        signUp: true
      }
    case AUTH_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
        signUpFail:true
      }
    case MOUNT_TOKEN:
      return {
        ...state,
        token: action.payload
      }
    case FETCH_PROFILE:
      return {
        ...state,
        userProfile: action.payload.profile
      }
    case UPDATE_PROFILE:
      return {
        ...state,
        userProfile : action.payload
      }
    case RESET_SIGNUP_FAIL:
      return {
        ...state,
        signUpFail: false
      }
    case 'SIGNOUT_SUCCESS':
      return{
        userProfile:null,
        user:null
      }
    default:
      return state
  }
}
