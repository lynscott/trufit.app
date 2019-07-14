import _ from 'lodash'
import { FETCH_PLANS, FETCH_PLAN , FETCH_PLAN_TEMPLATES} from '../actions'

const initState = {
  planTemps: [],
  userPlans: [],
  
}

//_.mapKeys(action.payload, '_id')

export default function(state = initState, action ) {
  switch(action.type) {
    case FETCH_PLAN:
      return {...state, [action.payload._id]: action.payload }
    case FETCH_PLANS:
      return { 
        ...state, 
        userPlans: action.payload
      }
    case FETCH_PLAN_TEMPLATES:
      return {
        ...state,
        planTemps: action.payload
      }
    default:
      return state
  }
}
