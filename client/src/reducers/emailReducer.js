import {REQUEST_PENDING, REQUEST_SUCCESS} from '../actions'

const initialState = {
    pendingBetaRequest: false,
    successBetaRequest: false,
    // errorMessage: null,
  }

export default function(state = initialState, action) {
  switch(action.type) {
  case REQUEST_PENDING:
    return {
        ...state,
        pendingBetaRequest:true
    }
  case REQUEST_SUCCESS:
    return {
        ...state,
        successBetaRequest:true
    }
  default:
    return state
  }
  
}