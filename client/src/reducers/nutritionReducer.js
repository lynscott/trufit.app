import {FOOD_SEARCH, FOOD_SELECTED} from '../actions'

const initialState = {
    searchList: [],
    foodSelected: null
  }

export default function(state = initialState, action) {
  switch(action.type) {
  case FOOD_SEARCH:
    return {
        ...state,
        searchList:action.payload
    }
    case FOOD_SELECTED:
    return {
        ...state,
        foodSelected:action.payload
    }
  default:
    return state
  }
  
}