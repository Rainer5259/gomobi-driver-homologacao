import { PROVIDER_PROFILE_UPDATED } from '../actions/actionTypes'

const initialState = {
    providerProfile: {
        _id: '',
        _token: '',
        _is_active: ''
    },
    ledger: 0,
    isAvailable: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case PROVIDER_PROFILE_UPDATED:
            return {
                ...state,
                providerProfile: action.providerProfile
            }
        case 'SET_LEDGER':
            return {
                ...state,
                ledger: action.payload
            }
        case "SET_AVAILABLE":
            return {
                ...state,
                isAvailable: action.payload,
            };
        default:
            return state
    }
}

export default reducer