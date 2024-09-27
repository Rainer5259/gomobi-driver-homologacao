// Modules
import React from 'react'
import MapViewDirections from 'react-native-maps-directions'

// Util
import * as constants from '../../Util/Constants'

const Directions = ({ destination, origin, onReady, strokeColor }) => (
    <MapViewDirections
        origin={origin}
        destination={destination}
        onReady={onReady}
        apikey={constants.GOOGLE_MAPS_KEY}
        strokeWidth={3}
        strokeColor={strokeColor}

    />
);

export default Directions;
