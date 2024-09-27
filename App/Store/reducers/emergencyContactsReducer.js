const initialState = {
  emergencyContacts: {},
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SAVE_EMERGENCY_CONTACTS':
            return {
                ...state,
                emergencyContacts: action.payload
            }
        default:
            return state
    }
}
