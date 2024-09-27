//@flow
import { SETTINGS_UPDATED, CLICKER_UPDATED } from '../Util/Constants'

const initialState = {
	settings: [],
	clicker: 'primary'
};

export const settingsReducer = (state = initialState, action) => {
	switch (action.type) {
		case SETTINGS_UPDATED:
			return {
				...state,
				settings: action.settings
			};
		case CLICKER_UPDATED:
            return {
                ...state,
                clicker: action.clicker
            }
		default:
			return state;
	}
};
