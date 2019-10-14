import { combineReducers } from 'redux'
import TypesReducer from './typesReducer'
import ActiveType from './activetypeReducer'
import GoalsReducer from './goalReducer'
import ActivePlan from './activeplanReducer'
import AuthReducer from './authReducer'
import PlanReducer from './planReducer'
import AdminReducer from './adminReducer'
import NutritionReducer from './nutritionReducer'
import LayoutReducer from './layoutReducer'
import EmailReducer from './emailReducer'
import {reducer as formReducer } from 'redux-form'
import { connectRouter } from 'connected-react-router'

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  types: TypesReducer,
  goals: GoalsReducer,
  activeType: ActiveType,
  activePlan: ActivePlan,
  form: formReducer,
  auth: AuthReducer,
  plans: PlanReducer,
  admin: AdminReducer,
  nutrition: NutritionReducer,
  layout: LayoutReducer,
  emails: EmailReducer
})

export default rootReducer
