import {
    SET_TOGGLESWITCH,
    ACTIVE_DESTINATION,
    ACTIVE_FULLADDRESS,
    ACTIVE_LATITUDE,
    ACTIVE_LONGITUDE
} from '../actions/actionTypes'

const initialState = {
    destinationActive: null,
    toggleSwitch: true,
    fullAddress: null,
    latitude: null,
    longitude: null,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOGGLESWITCH:
            return {
                ...state,
                toggleSwitch: action.payload
            }
        case ACTIVE_DESTINATION:
            return {
                ...state,
                destinationActive: action.payload
            }
        case ACTIVE_FULLADDRESS:
            return {
                ...state,
                fullAddress: action.payload
            }
        case ACTIVE_LATITUDE:
            return {
                ...state,
                latitude: action.payload
            }
        case ACTIVE_LONGITUDE:
            return {
                ...state,
                longitude: action.payload
            }
        default:
            return state
    }
}

export default reducer