import _ from 'lodash'
import {
    FETCH_WORKOUTS,
    TOGGLE_WORKOUT_MODE,
    SEND_TRACKER_DATA_SUCCESS
} from '../actions'

const initState = {
    workoutActive: false
}

export default function(state = initState, action) {
    switch (action.type) {
        case TOGGLE_WORKOUT_MODE:
            return {
                ...state,
                workoutActive: !state.workoutActive
            }

        default:
            return state
    }
}
