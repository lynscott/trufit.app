import {SET_SIDEBAR_WIDTH } from '../actions'

const initialState = {
    sideBarWidth:0
  }

export default function(state = initialState, action) {
  switch(action.type) {
  case SET_SIDEBAR_WIDTH:
    return {
        ...state,
        sideBarWidth:action.payload
    }
  default:
    return state
  }
  
}