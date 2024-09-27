"use strict"

// Modules
import React, { Component } from "react"

import {
  ScrollView,
  Text,
  View,

  PermissionsAndroid
} from "react-native"


// Themes
import { BootstrapColors } from "../../Themes/WhiteLabelTheme/WhiteLabel"

// Redux
import { connect } from "react-redux"

// Styles

import MapView, { Callout, Marker } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions'
import getDirections from 'react-native-google-maps-directions'
import Geocoder from 'react-native-geocoding';

import * as constants from "../../Util/Constants";
import { styles } from "./styles"
import Geolocation from "@react-native-community/geolocation"

class PageToUseToTest extends Component {
  constructor(props) {
    super(props)
    this.state = {

      origin: { latitude: -26.8732, longitude: -49.1116 },
      destination: { latitude: -26.8975, longitude: -49.2317 },
      originText: '',
      destinationText: '',
      markerDirection: 0,
      markerCoordinate: { latitude: -26.8732, longitude: -49.1116 },

    };

  }

  async requestLocationPermission() {
    try {

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'App Location Permission',
          'message': 'Maps App needs access to your map ' +
            'so you can be navigated.'
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
        return true;

      } else {
        console.log("location permission denied");
        return false;
      }

    } catch (err) {
      console.warn(err)
    }

  }

  getLocation = () => {
    Geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      let markerCoordinate = {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };

      this.setState({
        markerCoordinate
      });

      this.mapView.animateToRegion(markerCoordinate, 1500)
    });
  };

  async componentDidMount() {
    let isGranted = await this.requestLocationPermission();

    if (isGranted) {
      this.getLocation();
    }

    this.getLocation();

    this.watchId = Geolocation.watchPosition(
      (position) => {
        const newCoordinate = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Atualiza a direção do marcador e, por consequência, a orientação do mapa
        this.updateMarkerDirection(newCoordinate);
        this.setMarkerCoordinate(newCoordinate);

        this.mapView.animateCamera({
          pitch:70,

          heading: this.state.markerDirection
        });
      },
      (error) => console.log('Erro ao obter localização:', error),
      { enableHighAccuracy: true, distanceFilter: 10 } // Opções de configuração, ajuste conforme necessário
    );
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchId);
  }

  handleGetGoogleMapDirections = () => {

    const data = {

      source: this.state.origin,
      destination: this.state.destination,
      params: [
        {
          key: "travelmode",
          value: "driving"
        }
      ]

    };

    getDirections(data)

  };


  calculateDirection = (from, to) => {
    const angle = Math.atan2(to.longitude - from.longitude, to.latitude - from.latitude) * (180 / Math.PI);
    return (angle + 360) % 360;
  };

  updateMarkerDirection = (newCoordinate) => {
    const newDirection = this.calculateDirection(this.state.markerCoordinate, newCoordinate);
    this.setMarkerDirection(newDirection);
  };

  onRegionChange(newRegion) {

    this.mapView.animateCamera({
          pitch: 70,
          center: newRegion.coords,
          heading: this.state.markerDirection
        });
  }

  handleMarkerPress = () => {
    // Atualize a rotação do marcador, por exemplo, adicionando 45 graus a cada vez que o marcador é pressionado.
    this.setState({ 
      markerRotation: this.state.markerRotation + 45 })
  };

  setMarkerCoordinate(markerCoordinate) {
    this.setState({ markerCoordinate })

  }

  setMarkerDirection(markerDirection) {
    this.setState({ markerDirection })
  }


  render() {
    return (
      <View style={styles.container} backgroundColor={BootstrapColors.white}>

        <MapView

          ref={map => this.mapView = map}
          style={styles.map}

          region={{
            latitude: (this.state.origin.latitude + this.state.destination.latitude) / 2,
            longitude: (this.state.origin.longitude + this.state.destination.longitude) / 2,
            latitudeDelta: Math.abs(this.state.origin.latitude - this.state.destination.latitude) + Math.abs(this.state.origin.latitude - this.state.destination.latitude) * .1,
            longitudeDelta: Math.abs(this.state.origin.longitude - this.state.destination.longitude) + Math.abs(this.state.origin.longitude - this.state.destination.longitude) * .1,
          }}

          loadingEnabled={true}
          toolbarEnabled={true}
          zoomControlEnabled={true}
          showsCompass={true}
          pitchEnabled={false}
          rotateEnabled={false}

        >

          <Marker
            coordinate={this.state.destination}
            onPress={this.handleMarkerPress.bind(this)}
          >
            <Callout onPress={this.handleGetGoogleMapDirections}>
              <Text>Press to Get Direction</Text>
            </Callout>
          </Marker>

          <Marker
            coordinate={this.state.markerCoordinate}
          >
            <Callout>
              <Text>This is where you are nowwww</Text>
            </Callout>
          </Marker>


          <MapViewDirections
            origin={this.state.origin}
            destination={this.state.destination}
            apikey={constants.GOOGLE_MAPS_KEY}
            strokeWidth={4}
            onReady={() => console.log(`onready`)}
            onStart={() => console.log(`onstart`)}
          />

        </MapView>

      </View>
    );
  }
}

const mapStateToProps = state => (
  {

  }
)

const mapDispatchToProps = dispatch => (
  {

  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageToUseToTest)
