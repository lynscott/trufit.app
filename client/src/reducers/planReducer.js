import _ from 'lodash';
import { FETCH_PLANS, FETCH_PLAN } from '../actions';

export default function(state = {}, action ) {
  switch(action.type) {
    case FETCH_PLAN:
      return {...state, [action.payload._id]: action.payload };
    case FETCH_PLANS:
      return _.mapKeys(action.payload, '_id');
    default:
      return state;
  }
}
