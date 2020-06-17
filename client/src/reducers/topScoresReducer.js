const initialState = {
    topScores: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_SCORES':
            return {
                ...state,
                scores: action.scores
            }

        default:
            return state
    }
}
