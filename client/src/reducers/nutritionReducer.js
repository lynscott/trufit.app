import {FOOD_SEARCH, FOOD_SELECTED, FETCH_MEALS, FOOD_FOUND,
  FETCH_NUTRITION_PLANS, SEARCH_LOADING } from '../actions'

const initialState = {
    searchList: [],
    foodSelected: null,
    userMeals: [],
    userNutritionPlans: [],
    foodLoading: false,
    foodFound: false,
    
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
    case 'UPDATE_MEAL'://TODO: Implement
      return {
        ...state,
        newMeal: action.payload
      }
    case FETCH_NUTRITION_PLANS:
      return {
        ...state,
        userNutritionPlans: action.payload
      }
    case SEARCH_LOADING:
      return {
        ...state,
        foodLoading: true
      }
      case FOOD_FOUND:
      return {
        ...state,
        foodLoading: false,
        foodFound:true,
        foodSelected: action.payload
      }
  default:
    return state
  }
  
}