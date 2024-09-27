//@flow
import { PROVIDER_PROFILE_UPDATED, PROVIDER_STORAGE } from '../Util/Constants';
import ProviderApi from "../Services/Api/ProviderApi";

export const providerAction = {
	refreshProviderProfile
}

/**
 * Action creators that return a function instead of an action.
 * Allow us to refresh provider profile in redux reducer
 * Responsible - Redux Thunk middleware
 *
 * Dispatching to reducer and another function
 * to persist our profile on AsyncStorage
 * @param {ProviderApi} providerProfile (ProviderApi Model)
 */
function refreshProviderProfile(providerProfile) {
	providerProfile.store(PROVIDER_STORAGE);
	return (dispatch) => {
		dispatch({
			type: PROVIDER_PROFILE_UPDATED,
			providerProfile
		})
	}
}
