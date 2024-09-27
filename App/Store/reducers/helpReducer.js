const initialState = {
    financialHelp: {},
}


export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_FINANCIAL_HELP':
            return {
                ...state,
                financialHelp: action.payload
            }
        default:
            return state
    }
}