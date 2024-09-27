import { SET_SERVICE, SET_INDEX, SET_TYPEID, SET_CATEGORYID, SET_CATEGORIES, CLEAR_ESTIMATIVE } from './actionTypes';

export const changeServices = values => {
    return {
        type: 'CHANGE_SERVICES',
        payload: values
    }
}

export const setServiceList = values => {
    return {
        type: 'SET_SERVICE_LIST',
        payload: values
    }
}

export const setService = value => {
	return dispatch => {
		dispatch({
			type: SET_SERVICE,
			payload: value
		});
	}
}
  
export const setClickedIndex = value => {
	return dispatch => (
		dispatch({
			type: SET_INDEX,
			payload: value
		})
	)
}
  
export const setClickedTypeId = value => {
	return dispatch => {
		dispatch({
			type: SET_TYPEID,
			payload: value
		})
	}
}
  
export const setClickedCategoryId = value => {
	return dispatch => {
		dispatch({
			type: SET_CATEGORYID,
			payload: value
		})
	}
}
  
export const setCategories = value => {
	return dispatch => {
		dispatch({
			type: SET_CATEGORIES,
			payload: value
		})
	}
}

export const clearServices = value => {
	return dispatch => {
		dispatch({
			type: CLEAR_ESTIMATIVE,
			payload: value
		});
	}
}