import {
    SET_TOGGLESWITCH,
    ACTIVE_DESTINATION,
    ACTIVE_FULLADDRESS,
    ACTIVE_LATITUDE,
    ACTIVE_LONGITUDE
} from '../actions/actionTypes'

export const settoggleSwitch = value => {
    return {
        type: SET_TOGGLESWITCH,
        payload: value
    }
}
export const activeDestination = value => {
    return {
        type: ACTIVE_DESTINATION,
        payload: value
    }
}
export const setFullAddress = value => {
    return {
        type: ACTIVE_FULLADDRESS,
        payload: value
    }
}
export const setLatitude = value => {
    return {
        type: ACTIVE_LATITUDE,
        payload: value
    }
}
export const setLongitude = value => {
    return {
        type: ACTIVE_LONGITUDE,
        payload: value
    }
}