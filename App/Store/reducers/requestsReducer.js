import {
	SET_DESTINATION,
	SET_SOURCE,
	CLEAR_ADRESSES,
	SET_STOP,
	REMOVE_STOP,
	CLEAR_STOPS
} from '../actions/actionTypes';

const initialState = {
   myRequestsView: {},
   source_address: null,
   destination_address: null,
   stops: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_MY_REQUEST_VIEW':
            return {
                ...state,
                myRequestsView: action.payload
            }
		case SET_SOURCE:
			return {
				...state,
				source_address: action.payload
			}
		case SET_DESTINATION:
			return {
				...state,
				destination_address: action.payload
			}
		case CLEAR_ADRESSES:
			return {
				...state,
				source_address: null,
				destination_address: null
			}
		case SET_STOP:
			return {
				...state,
				stops: action.payload,
			}
		case REMOVE_STOP:
			return {
				...state,
				stops: action.payload,
			}
		case CLEAR_STOPS:
			return {
				...state,
				stops: [],
			}
        default:
            return state
    }
}