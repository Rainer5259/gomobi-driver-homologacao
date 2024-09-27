//@flow
import { PROVIDER_PROFILE_UPDATED } from '../Util/Constants'

const initialState = {
	providerProfile: {},
	isAvailable: false
};

export const providerProfileReducer = (state = initialState, action) => {
	switch (action.type) {
		case PROVIDER_PROFILE_UPDATED:
			return {
				...state,
				providerProfile: action.providerProfile
			};
		default:
			return state;
	}
};
