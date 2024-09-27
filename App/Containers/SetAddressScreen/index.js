// Modules
import React, { Component } from "react";
import { SafeAreaView } from "react-native";
import ProviderApi from "../../Services/Api/ProviderApi";
import {
  Text,
  View,
  BackHandler,
  TouchableOpacity,
  Platform,
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import Icons from 'react-native-vector-icons/Entypo';
import PlacesAutoComplete from 'react-native-autocomplete';
import Geolocation from '@react-native-community/geolocation';

// Components
import Loader from '../../Components/Loader';
import Toolbar from '../../Components/Toolbar';

// Locales
import { strings } from '../../Locales/i18n';

// Services
import {handlerException} from '../../Services/Exception';

// Store
import { clickerAction } from '../../Store/actions/actionSettings';
import { setSource, setDestination } from '../../Store/actions/actionRequest';
import {
	setStop,
} from '../../Store/actions/actionRequest';

//Utils
import * as parse from '../../Util/Parse';
import * as constants from '../../Util/Constants';

// Styles
import styles from './styles';
class SetAddressScreen extends Component {
	constructor(props) {
		super(props);

		this.api = new ProviderApi();

		this.state = {
			fullAddress: '',
			address: '',
			placeID: '',
			latitude: 0,
			longitude: 0,
			address_latitude: null,
			address_longitude: null,
			user: null,
			isLoading: false,
			id: null,
			token: null,
			clicker: this.props.clicker,
		};

		this.loading_message = strings('load.Loading');

		this.didFocus = this.props.navigation.addListener('didFocus', async () => {
			if (this.props.navigation.state.params.setOnMap && this.props.navigation.state.params.setOnMapData) {
				await this.chooseAddressWithGeocode(this.props.navigation.state.params.setOnMapData)
			}
		});
	}

	/**
	 * get information from autocomplete.
	 *
	 * @param {string} address
	 * @param {string} city
	 * @param {string} placeID
	 * @param {float}  latitude
	 * @param {float}  longitude
	 * @param {string} clicker
	 */
	chooseAutoComplete(values) {
		this.props.clickerAction(values.clicker);

		this.setState({
			fullAddress: values.main_text + ', ' + values.secondary_text,
			address: values.main_text,
			city: values.secondary_text,
			placeID: values.place_id,
			address_latitude: values.latitude,
			address_longitude: values.longitude,
			clicker: values.clicker,
		});

		this.refs.placesAutoComplete.ChangeShowAddresseList(false)
	}

	/**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const { navigate } = this.props.navigation;

		return navigate;
	}

	/**
	 * Send information to Previous Screen
	 */
	async sendDataToPreviousScreen() {
		this.setState({ isLoading: true });

		if (this.state.placeID) {
			try {
				const response = await this.api.GetAddressFromPlaceIdLib(
					this.state.user._id,
					this.state.user._token,
					this.state.placeID,
					this.state.clicker,
					this.state.fullAddress,
				);

				let result = response.data;
				if (parse.isSuccess(result, this.returnConstNavigate())) {
					this.setState({
						address_latitude: result.data.latitude,
						address_longitude: result.data.longitude,
					});

					this.goToPreviousScreen(this.state.fullAddress, this.state.type);

					this.setState({ isLoading: false });
				} else {
					this.setState({ isLoading: false });
				}
			} catch (error) {
        handlerException('SetAddressScreen.sendDataToPreviousScreen', error);
				this.setState({ isLoading: false });
			}
		} else {
			this.setState({ isLoading: false });
			this.goToPreviousScreen(this.state.fullAddress, this.state.type);
		}
	}

	UNSAFE_componentWillUnmount() {
		    if(this.backHandler){
      this.backHandler.remove();
    }
		this.didFocus.remove();
	}

	componentDidMount() {
		Geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords;
				this.setState({ latitude, longitude });
			},
			error => {
				Geolocation.getCurrentPosition(position => {
					const { latitude, longitude } = position.coords;
					this.setState({ latitude, longitude });
				});
			},
			{
				enableHighAccuracy: Platform.os != 'ios' ? true : false,
				timeout: 1000,
			},
		);

		this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			this.props.navigation.goBack();
			return true;
		});

		if (this.props.navigation.state.params) {
			var lat = this.props.navigation.state.params.latitude;
			var long = this.props.navigation.state.params.longitude;
			var user = this.props.navigation.state.params.provider;
			var type = this.props.navigation.state.params.address_type;
			var hasEdit = this.props.navigation.state.params.hasEdit;

			this.setState({
				user: user,
				type: type,
				hasEdit: hasEdit,
				id: user._id,
				token: user._token,
				isLoading: false
			});

		}

		if (this.props.navigation.state.params.address_type && this.props.navigation.state.params.address_type == "stop") {
			this.setState({
				stopId: this.props.navigation.state.params.stopId,
				type: this.props.navigation.state.params.address_type,
			})
		}

		if (this.address) {
			this.address.focus();
		}
	}

	/**
	 * Go to previous screen with Selected Data.
	 *
	 * @param {string} fullAddress
	 */
	async goToPreviousScreen(fullAddress, type) {
		let address = [
			{
				_address: fullAddress,
				_latitude: this.state.address_latitude,
				_longitude: this.state.address_longitude,
			},
		];

		if (type === 'destination') {
			this.props.setDestination(address);

			this.props.navigation.goBack();
		} else if (type === 'source') {
			this.props.setSource(address);

			this.props.navigation.goBack();
		} else if (type == 'stop') {
			const addressObject = {
				address: fullAddress,
				latitude: Number.parseFloat(this.state.address_latitude),
				longitude: Number.parseFloat(this.state.address_longitude),
			};

			const index = this.props.stops.findIndex((value) => { return value.id === this.state.stopId });
			let newStop = this.props.stops;
			newStop[index] = addressObject;

			this.props.setStop(newStop);

			this.props.navigation.goBack();
		}

		this.setState({ isLoading: false });
	}

	async updateAddress() {
		try {
			this.setState({ isLoading: true })

			if (this.state.latitude && this.state.longitude) {
				const { data } = await this.api.GetAddressFromLatLng(
					this.state.user._id,
					this.state.user._token,
					this.state.latitude,
					this.state.longitude,
					this.props.clicker
				);

				const value = data.data
				this.chooseAddressWithGeocode(value)

				this.setState({ isLoading: false})
			}
		} catch (error) {
      handlerException('SetAddressScreen.updateAddress', error);
			this.setState({ isLoading: false})
		}
  	}

	/**
	 * get information from autocomplete.
	 *
	 * @param {string} address
	 * @param {string} city
	 * @param {string} placeID
	 */
	async chooseAddressWithGeocode(values) {
		if (this.refs.placesAutoComplete) await this.refs.placesAutoComplete.setAddressText(values.address);

		this.props.clickerAction(values.clicker);

		this.setState({
			fullAddress: values.address,
			address: values.address,
			city: values.street_name,
			placeID: values.place_id,
			address_latitude: values.latitude,
			address_longitude: values.longitude,
			clicker: values.clicker,
		});

		this.setState({ isLoading: false})
	}

	setAddressOnMap() {
		const { navigate } = this.props.navigation;
		navigate('SetAddressOnMapScreen', this.props.navigation.state.params);
	}

	render() {
		const fullAddress = this.state.fullAddress;

		return (
			<SafeAreaView style={styles.parentContainer}>
				<View>
					<Toolbar
						back={true}
						handlePress={() => this.props.navigation.goBack()}
					/>
				</View>

				<Loader loading={this.state.isLoading} message={this.loading_message} />

				<View
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="on-drag"
					style={styles.viewPrincipal}
				>
					<View style={styles.boxSetAddress}>
						<PlacesAutoComplete
							ref='placesAutoComplete'
							getDataAutocomplete={value => this.chooseAutoComplete(value)}
							route={`${constants.BASE_URL}${constants.GET_PLACES_AUTOCOMPLETE}`}
							params={{ id: this.state.id, token: this.state.token, latitude: this.state.latitude, longitude: this.state.longitude, lang: 'pt-br' }}
						/>
					</View>

					<View style={styles.areaConfirmAddress}>
						<TouchableOpacity style={styles.useMyAddress} onPress={() => { this.updateAddress() }}>
							<Icons name="location" size={20} color="#333" />
							<Text> {strings("fill_address.use_my_location")} </Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.useMyAddress} onPress={() => {this.setAddressOnMap()}}>
							<Icons name="location-pin" size={20} color="#333" />
							<Text> {strings("fill_address.set_address_on_map")} </Text>
						</TouchableOpacity>

						<TouchableOpacity
							activeOpacity={0.6}
							disabled={fullAddress === '' ? true : false}
							style={styles.btnOk}
							onPress={() => this.sendDataToPreviousScreen()}
						>
							<Text style={styles.txtBtnStyle}>
								{strings('fill_address.select_address')}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = state => {
	const { stops } = state.requestsReducer;

	return {
		stops
	};
};

const mapDispatchToProps = dispatch => {
	return {
		clickerAction: value => dispatch(clickerAction(value)),
		setDestination: value => dispatch(setDestination(value)),
    	setSource: value => dispatch(setSource(value)),
		setStop: value => dispatch(setStop(value)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SetAddressScreen);
