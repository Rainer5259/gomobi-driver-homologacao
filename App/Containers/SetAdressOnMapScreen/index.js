// Modules
import React, {Component} from 'react';
import {
  AppState,
  Text,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native';
import MapView from 'react-native-maps';
import Toast from 'react-native-root-toast';
import Geolocation from '@react-native-community/geolocation';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import { connect } from 'react-redux';

// Components
import Loader from '../../Components/Loader';
import Toolbar from '../../Components/Toolbar';

// Locales
import {strings} from '../../Locales/i18n';

// Services
import ProviderApi from '../../Services/Api/ProviderApi';
import {handlerException} from '../../Services/Exception';

//Store
import { setDestination } from '../../Store/actions/actionRequest';

// Themes
import icons from '../../Themes/WhiteLabelTheme/Images';
import mapStyle from '../../Themes/mapStyle';

// Util
import * as constants from '../../Util/Constants';
import * as parse from '../../Util/Parse';

// Styles
import styles from './styles';

class SetAddressOnMapScreen extends Component {
	constructor(props) {
		super(props);
		this.user;
		this.api = new ProviderApi();

		this.state = {
			user: null,
			region: null,
			latitude: 0,
			longitude: 0,

			address: '',
			street_name: '',
			place_id: null,

			markerUser: [],
			isLoading: true,
			isLoad: true,

			info: [],

			appState: AppState.currentState,
		};

		this.loading_message = strings('load.Loading');
	}

	/**
	 * Component will be Mounted, so create Listener and Watcher
	 */
	componentDidMount() {
		this.getMyLocation();
		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.goBack();
			return true;
		});
	}

	/**
	 * Get my Location
	 */
	getMyLocation() {
		try {
			Geolocation.getCurrentPosition(position => {
				let region = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
						latitudeDelta: 0.015,
				longitudeDelta: 0.015,
				};

				this.setState({
					region,
					longitude: region.latitude,
					longitude: region.longitude,
				});

				this.getNewSourceAddressFromMap(region);
			},
			error => {
				Geolocation.getCurrentPosition(position => {
					let region = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						latitudeDelta: 0.015,
						longitudeDelta: 0.015,
					};
					this.setState({
						region,
						longitude: region.latitude,
						longitude: region.longitude,
					});

					this.map.animateToRegion(region, 600);
					this.getNewSourceAddressFromMap(region);
				});
			},
				{
					enableHighAccuracy: true,
					timeout: 1000,
				},
			);
		} catch (error) {
      handlerException('SetAddresOnMapScreen.getMyLcation', error);
		}
	}

	/**
	 * Component will be Unmounted, so close Listener and Watcher
	 */
	UNSAFE_componentWillUnmount() {
		Geolocation.clearWatch(this.watchID);
		    if(this.backHandler){
      this.backHandler.remove();
    }

		if (Platform.OS == constants.ANDROID)
			LocationServicesDialogBox.stopListener();
	}

	getNewSourceAddressFromMap = async region => {
		try {
			this.setState({isLoading: true});
			const user = this.props.navigation.state.params.provider

			if (user) {
				const response = await this.api.GetAddressFromLatLng(
					user._id,
					user._token,
					region.latitude,
					region.longitude,
				);

				if (response.status === 200) {
					const { data } = response;

					this.setState({
						street_name: data.data.street_name,
						place_id: data.data.place_id,
						latitude: data.data.latitude,
						longitude: data.data.longitude,
						address: data.data.address,
					});
				}
			}
			this.setState({isLoading: false});
		} catch (err) {
      handlerException('SetAddressOnMapScreen.getNewSourceAddressFromMap', error);
			parse.showToast(strings('error.try_again'), Toast.durations.SHORT);
			this.setState({isLoading: false});
		}
	};

	/**
	 * Go to previous screen with Selected Data.
	 *
	 * @param {string} fullAddress
	 */
	goToPreviousScreen = async () => {
		const setOnMapData = {
			street_name: this.state.street_name,
			place_id: this.state.place_id,
			latitude: this.state.latitude,
			longitude: this.state.longitude,
			address: this.state.address,
		};

		const user = this.props.navigation.state.params.provider;

		this.props.navigation.navigate('SetAddressScreen', {
			user,
			setOnMap: true,
			setOnMapData
		});
	};

	render() {
		return (
			<SafeAreaView style={styles.parentContainer}>
				<View>
					<Toolbar
					back={true}
					handlePress={() => this.props.navigation.goBack()}
					/>
				</View>

				<Loader
					loading={this.state.isLoading}
					message={strings('load.Loading')}
				/>

				<MapView
					initialRegion={this.state.region}
					style={styles.map}
					showsUserLocation={false}
					followUserLocation={false}
					zoomEnabled={true}
					ref={map => (this.map = map)}
					showsCompass={true}
					pitchEnabled={true}
					customMapStyle={mapStyle}
					onRegionChangeComplete={this.getNewSourceAddressFromMap}
				/>

				<View style={styles.mapMarkerContainer}>
					<Image
						source={icons.map_marker_sm_icon}
						style={{width: 35, height: 35}}
					/>
				</View>

				<View style={styles.areaBottomButton}>
					<Text style={styles.addressText}>{this.state.address}</Text>

					<TouchableOpacity
						activeOpacity={0.6}
						style={styles.btnOk}
						onPress={() => this.goToPreviousScreen()}
					>
						<Text style={styles.txtBtnStyle}>
						{strings('fill_address.select_address')}
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	}
}


const mapStateToProps = state => {
	const { destination_address } = state.requestsReducer;
	return {
		destination_address
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setDestination: value => dispatch(setDestination(value)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SetAddressOnMapScreen);
