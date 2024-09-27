const initialState = {
    report: {},
}


export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_REPORT_VIEW':
            return {
                ...state,
                report: action.payload
            }
        default:
            return state
    }
}