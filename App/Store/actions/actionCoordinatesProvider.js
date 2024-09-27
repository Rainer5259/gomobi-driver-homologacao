export const changeCoordinatesProvider = (region, latitude, longitude) => {
    return {
        type: 'SET_COORDINATES',
        region,
        latitude,
        longitude
    }
}