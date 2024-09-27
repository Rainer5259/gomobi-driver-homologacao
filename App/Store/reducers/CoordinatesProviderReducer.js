const initialState = {
    region: null,
    latitude: 0,
    longitude: 0
}


export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_COORDINATES':

            return {
                ...state,
                region: action.region,
                latitude: action.latitude,
                longitude: action.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }

        default:
            return state
    }
}