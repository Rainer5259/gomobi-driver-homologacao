import React, { Component } from 'react';

import { connect } from 'react-redux';

// import Geolocation from 'react-native-geolocation-service';
import { Region } from './configBgLocation';

import { changeCoordinatesProvider } from '../Store/actions/actionCoordinatesProvider';
import { GeolocationService } from "react-native-geolocation-service";
import { strings } from "../Locales/i18n";
import { Alert, BackHandler } from "react-native";

class CoordinatesProvider extends Component {
    constructor(props) {
        super(props)
        this.state = {
            latitude: 0,
            longitude: 0,
            update_location_fast_interval: 10,
            controll: true,
            watchId: 0
        }
    }

    async GeolocationPosition() {
        if(this.state.watchId === 0 && this.props.gpsStatus){
            const watchId = GeolocationService.watchLocation(
                (position) => {
                    let latitude = position.coords.latitude
                    let longitude = position.coords.longitude
                    let region = {
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: this.props?.region?.latitudeDelta || 0.00922 * 1.5,
                        longitudeDelta: this.props?.region?.longitudeDelta || 0.00421 * 1.5,
                    };
                    if (this.state.latitude != latitude || this.state.longitude != longitude) {
                        this.setState({
                            latitude,
                            longitude,
                        })
                        this.props.changeCoordinatesProvider(region, latitude, longitude)
                    }
                },
                {
                  text: strings("map_screen.active_gps_msg"),
                  yes: strings("map_screen.active_gps"),
                  no: strings("map_screen.running_out_of"),
                }
            );
            this.setState({watchId})
        }
    }

    async checkMockLocation() {
        GeolocationService.getCurrentLocation((position) => {
            if(position.mocked){
                Alert.alert(
                    strings("map_screen.mock_location_detected"),
                    strings("map_screen.dont_use_mock_location"),
                    [
                        { text: strings("map_screen.ok"), onPress: () => {
                            BackHandler.exitApp();
                        } }
                    ]
                );
            }
        })
    }

    componentDidMount() {
        if (this.props.settings != null && this.props.settings != undefined) {
            if (this.props.settings.update_location_fast_interval != undefined &&
                this.props.settings.update_location_fast_interval != null) {
                this.setState({
                    update_location_fast_interval: this.props.settings.update_location_fast_interval
                })
            }
        }

        setTimeout(() => {
            this.intervalPosition()
        }, 100)
    }

    /**
     * Função para recuperar a posição
     * Primeiro - Chama o Region que e fornecido pelo configBgLocation, que por sua ver vem do location
     * Caso o Location sofrer algum erro ou nao for iniciado, a posição e recuperada do GeolocationPosition
     */
    intervalPosition() {
        this.GeolocationPosition()
        if(this.props.gpsStatus) this.checkMockLocation()

        setInterval(() => {
            if(this.props.gpsStatus) this.checkMockLocation()
            Region().then(coords => {
                if (coords != undefined && coords != null && this.props.gpsStatus) {
                    GeolocationService.stopObservingLocation()

                    this.setState({watchId: 0})

                    if (this.state.latitude != coords.latitude || this.state.longitude != coords.longitude) {
                        this.setState({
                            latitude: coords.latitude,
                            longitude: coords.longitude,
                        })
                        this.props.changeCoordinatesProvider(coords, coords.latitude, coords.longitude)
                    }
                } else {
                  GeolocationService.stopObservingLocation()
                  this.GeolocationPosition()
                }
            })
        }, this.state.update_location_fast_interval * 1000)
    }

    render() {
        return null;
    }
}

const mapStateToProps = state => {
    const { settings } = state.settingsReducer
    const { gpsStatus } = state.BgGeolocationReducer
    const { region } = state.CoordinatesProviderReducer

    return {
        settings,
        gpsStatus,
        region
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeCoordinatesProvider: (region, latitude, longitude) => dispatch(changeCoordinatesProvider(region, latitude, longitude))
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CoordinatesProvider);
