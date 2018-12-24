import {FETCH_EXERCISES} from '../actions'

const initialState = {
    exercises: [],
    // errorMessage: null,
    // user: null
  }

export default function(state = initialState, action) {
  switch(action.type) {
  case FETCH_EXERCISES:
    return {
        ...state,
        exercises:action.payload
    }
  default:
    return state
  }
  
}