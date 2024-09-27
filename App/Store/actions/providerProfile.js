import { PROVIDER_PROFILE_UPDATED } from './actionTypes'

export const providerAction = providerProfile => {
    return {
        type: PROVIDER_PROFILE_UPDATED,
        providerProfile
    }
}

export const changeLedger = value => {
    return {
      type: 'SET_LEDGER',
      payload: value
    }
}

export const setAvailable = (value) => {
  return {
    type: "SET_AVAILABLE",
    payload: value,
  };
};
