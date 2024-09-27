import { SET_SERVICE, SET_INDEX, SET_TYPEID, SET_CATEGORYID, SET_CATEGORIES, CLEAR_ESTIMATIVE } from '../actions/actionTypes';

const initialState = {
    services: [],
	serviceList: [],
	clickedIndex: null,
	clickedTypeId: null,
	clickedCategoryId: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_SERVICES':
            return {
                ...state,
                services: action.payload
            }
		case 'SET_SERVICE_LIST':
			return {
				...state,
				serviceList: action.payload
			}
		case SET_SERVICE:
			return {
				...state,
				services: action.payload
			}
		case SET_INDEX:
			return {
				...state,
				clickedIndex: action.payload
			}
		case SET_TYPEID:
			return {
				...state,
				clickedTypeId: action.payload
			}
		case SET_CATEGORYID:
			return {
				...state,
				clickedCategoryId: action.payload
			}
		case SET_CATEGORIES:
			return {
				...state,
				categories: action.payload
			}
		case CLEAR_ESTIMATIVE:
			return {
				...state,
				services: [],
			}
        default:
            return state
    }
}