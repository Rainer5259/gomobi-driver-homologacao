//@flow
import { SETTINGS_UPDATED } from '../Util/Constants';

export const settingsAction = {
	updateSettingsReducer
}

/**
 * Action creators that return a function instead of an action.
 * Allow us to update certificates in redux reducer
 * Responsible - Redux Thunk middleware
 * @param settings
 */
function updateSettingsReducer(settings) {
	return (dispatch) => {
		dispatch({
			type: SETTINGS_UPDATED,
			settings
		})
	}
}
