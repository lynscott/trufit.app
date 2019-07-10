import {FOOD_SEARCH, FOOD_SELECTED, FETCH_MEALS } from '../actions'

const initialState = {
    searchList: [],
    foodSelected: null,
    userMeals: [],
    userNutritionPlans: []
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
    case FETCH_MEALS:
      return {
        ...state,
        userMeals: action.payload
      }
    case 'UPDATE_MEAL':
      return {
        ...state,
        newMeal: action.payload
      }
  default:
    return state
  }
  
}