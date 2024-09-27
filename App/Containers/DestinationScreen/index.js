// Modules
import React, { Component } from "react";
import {
  Text,
	View,
	BackHandler,
	TouchableOpacity,
	Switch,
	Platform,
} from "react-native";
import Toast from "react-native-root-toast";
import PlacesAutoComplete from 'react-native-autocomplete';
import Geolocation from "react-native-geolocation-service";
import { connect } from "react-redux";

// Components
import Loader from "../../Components/Loader";
import Toolbar from "../../Components/Toolbar";
import TitleHeader from "../../Components/TitleHeader";

// Locales
import { strings } from "../../Locales/i18n";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";

// Store
import {
  settoggleSwitch,
	activeDestination,
	setFullAddress,
	setLatitude,
	setLongitude,
} from "../../Store/actions/actionDestination";
import { clickerAction } from "../../Store/actions/actionSettings";

// Themes
import { PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Util
import * as constants from '../../Util/Constants';
import * as parse from "../../Util/Parse";
import DefaultHeader from "../../Components/DefaultHeader";
import Button from "../../Components/RoundedButton";

class DestinationScreen extends Component {
	constructor(props) {
		super(props);
		this.api = new ProviderApi();
		this.state = {
			isLoading: false,
			fullAddress: "",
			latitude: 0,
			longitude: 0,
			complete: false,
			ontoggleSwitch: this.props.toggleSwitch,
		};
	}

	/**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const { navigate } = this.props.navigation;
		return navigate;
	}

	componentDidMount() {
		Geolocation.getCurrentPosition((position) => {
			const { latitude, longitude } = position.coords;
			this.setState({ latitude, longitude });
		});

		this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			this.props.navigation.goBack();
			return true;
		});
	}

	componentWillUnmount() {
		if (this.backHandler) {
			this.backHandler.remove();
		}
	}

	destinationPost() {
		this.setState({
			isLoading: true,
		});
		this.api
			.postDestination(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				this.state.fullAddress,
				this.state.ontoggleSwitch,
				this.state.latitude,
				this.state.longitude
			)
			.then((result) => {
				const resultJson = result.data;
				if (parse.isSuccess(resultJson, this.returnConstNavigate()) == true) {
					this.props.settoggleSwitch(this.state.ontoggleSwitch);
					this.props.setFullAddress(this.state.fullAddress);
					this.props.setLatitude(this.state.latitude);
					this.props.setLongitude(this.state.longitude);
					this.setState({
						fullAddress: "",
						address: "",
						city: "",
						placeID: "",
						address_latitude: 0,
						address_longitude: 0,
						placesArray: [],
						complete: false,
						isLoading: false,
					});

					parse.showToast(strings("destination.success"), Toast.durations.LONG);
					this.props.navigation.goBack();
				} else {
					this.setState({
						isLoading: false,
					});
				}
			})
			.catch((erro) => {
				parse.showToast(strings("error.try_later"), Toast.durations.LONG);
				this.props.navigation.goBack();
				this.setState({
					isLoading: false,
				});
			});
	}

	async onSetToggle() {
		try {
			this.setState({
				ontoggleSwitch: !this.state.ontoggleSwitch,
				isLoading: true,
			});

			this.props.settoggleSwitch(!this.state.ontoggleSwitch);

			if (
				(this.props.fullAddress != null &&
					this.props.latitude != null &&
					this.props.longitude != null) ||
				!this.state.ontoggleSwitch == false
			) {
				var fullAddress = this.props.fullAddress;
				var ontoggleSwitch = !this.state.ontoggleSwitch;
				var latitude = this.props.latitude;
				var longitude = this.props.longitude;

				this.api
					.postDestination(
						this.props.providerProfile._id,
						this.props.providerProfile._token,
						fullAddress,
						ontoggleSwitch,
						latitude,
						longitude
					)
					.then((result) => {
						this.setState({
							isLoading: false,
						});
					})
					.catch((erro) => {
						this.setState({
							isLoading: false,
						});
					});
			} else {
				this.setState({
					isLoading: false,
				});
			}
		} catch (error) {
			parse.showToast(strings("error.try_later"), Toast.durations.LONG);
			this.props.navigation.goBack();
		}
	}

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
			complete: true,
		});

		this.props.activeDestination(values.main_text + ", " + values.secondary_text);

		this.refs.placesAutoComplete.ChangeShowAddresseList(false)
	}

	render() {
		const { goBack } = this.props.navigation;

		return (
			<>
        <View style={{ marginTop: Platform.OS === "android" ? 0 : 25 }}>
          <DefaultHeader
            loading={this.state.isLoading}
            loadingMsg={strings("load.Loading")}
            btnBackListener={() => goBack()}
            title={strings('destination.destination')}
          />
          <Text style={{ fontWeight: "900", paddingHorizontal: 25 }}>
            {strings("destination.atived")}
          </Text>
        </View>

				<View
					keyboardShouldPersistTaps="handled"
					keyboardDismissMode="on-drag"
        >

					<View>
						<PlacesAutoComplete
							ref='placesAutoComplete'
							getDataAutocomplete={value => this.chooseAutoComplete(value)}
							route={`${constants.BASE_URL}${constants.GET_PLACES_AUTOCOMPLETE}`}
							params={{ id: this.props.providerProfile._id, token: this.props.providerProfile._token, latitude: this.state.latitude, longitude: this.state.longitude, lang: 'pt-br' }}
						/>
					</View>
				</View>
				<View style={{ paddingHorizontal: 25}}>

					{this.props.destinationActive != null &&
						this.props.destinationActive != "" && (
							<View>
								<View
									header
									bordered
									style={{
                     backgroundColor: 'gray',
                     paddingVertical: 16,
                     paddingHorizontal: 8,
                     borderTopStartRadius: 4,
                     borderTopEndRadius: 4
                  }}>
									<View
										style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                     }}
									>
										<Text style={{ fontSize: 16, fontWeight: '900', color: 'white' }}>
											{strings("destination.destinationSelect")}
										</Text>

										<Switch
											rackColor={{ false: '#767577', true: '#81b0ff' }}
											thumbColor={this.state.ontoggleSwitch ? '#fff' : '#f4f3f4'}
											style={{}}
											value={this.state.ontoggleSwitch}
											onValueChange={() => this.onSetToggle()}
										/>
									</View>

								</View>
								<View style={{
                    backgroundColor: '#f2f2f2',
                    paddingVertical: 20,
                    paddingHorizontal: 8,
                    borderWidth: 1,
                    borderColor: 'grey',
                    borderBottomStartRadius: 4,
                    borderBottomEndRadius: 4
                  }}>
									<Text>{this.props.destinationActive}</Text>
								</View>
							</View>
						)}


					{this.state.complete && (
						<View style={{ marginTop: 20 }}>
              <Button
                onPress={() => this.destinationPost()}
                text={strings("destination.ok")}
              />
						</View>
					)}
				</View>

			</>
		);
	}
}

const mapStateToProps = (state) => {
	const { providerProfile } = state.providerProfile;
	const {
		toggleSwitch,
		destinationActive,
		fullAddress,
		latitude,
		longitude,
	} = state.destinationReducer;
	const { clicker } = state.settingsReducer;

	return {
		providerProfile,
		toggleSwitch,
		destinationActive,
		fullAddress,
		latitude,
		longitude,
		clicker,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		settoggleSwitch: (value) => dispatch(settoggleSwitch(value)),
		activeDestination: (value) => dispatch(activeDestination(value)),
		setFullAddress: (value) => dispatch(setFullAddress(value)),
		setLatitude: (value) => dispatch(setLatitude(value)),
		setLongitude: (value) => dispatch(setLongitude(value)),
		clickerAction: (value) => dispatch(clickerAction(value)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DestinationScreen);
