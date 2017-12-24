import { combineReducers } from 'redux';
import TypesReducer from './typesReducer';
import ActiveType from './activetypeReducer';
import GoalsReducer from './goalReducer';
import ActivePlan from './activeplanReducer';
import AuthReducer from './authReducer';
import PlanReducer from './planReducer';
import {reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  types: TypesReducer,
  goals: GoalsReducer,
  activeType: ActiveType,
  activePlan: ActivePlan,
  form: formReducer,
  auth: AuthReducer,
  plans: PlanReducer,
});

export default rootReducer;
