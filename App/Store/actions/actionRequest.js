import { SET_SOURCE, SET_DESTINATION, CLEAR_ADRESSES, SET_STOP, REMOVE_STOP, CLEAR_STOPS } from './actionTypes'

export const changeMyRequestView = values => {
    return {
        type: 'CHANGE_MY_REQUEST_VIEW',
        payload: values
    }
}

export const setSource = value => {
    return dispatch => {
        dispatch({
            type: SET_SOURCE,
            payload: value
        })
    }
}

export const setDestination = value => {
    return dispatch => {
        dispatch({
            type: SET_DESTINATION,
            payload: value
        })
    }
}

export const clearAddresses = value => {
    return dispatch => {
        dispatch({
            type: CLEAR_ADRESSES,
            payload: value
        })
    }
}

export const setStop = value => {
	return dispatch => {
		dispatch({
			type: SET_STOP,
			payload: value
		});
	}
}

export const removeStop = value => {
	return dispatch => {
		dispatch({
			type: REMOVE_STOP,
			payload: value
		});
	}
}

export const clearStops = value => {
	return dispatch => {
		dispatch({
			type: CLEAR_STOPS,
			payload: value
		});
	}
}