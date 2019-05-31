import {FETCH_EXERCISES, FETCH_WORKOUTS} from '../actions'

const initialState = {
    exercises: [],
    workouts:[]
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
  case FETCH_WORKOUTS:
    return {
        ...state,
        workouts:action.payload
    }
  default:
    return state
  }
  
}