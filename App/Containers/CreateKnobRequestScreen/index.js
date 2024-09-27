// Modules
import React, { Component } from "react";
import { ScrollView } from "react-native";
import { BackHandler } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Image, SafeAreaView, View } from "react-native";
import {
  Alert,
	FlatList,
	Modal,
	Text,
	TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import Toast from "react-native-root-toast";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import Geolocation from "@react-native-community/geolocation";
import reactNativeProviderBubble from "react-native-provider-bubble";

// Components
import TitleHeader from "../../Components/TitleHeader";
import CompleteOrder from "../../Components/CompleteOrder";
import DefaultHeader from "../../Components/DefaultHeader";

// Locales
import { strings } from "../../Locales/i18n";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";

// Themes
import image from "../../Themes/WhiteLabelTheme/Images";
import { formStructConfig } from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Util
import * as parse from "../../Util/Parse";

// Store
import { requestUpdated, setReceiveNotice } from "../../Store/actions/request";
import {
  setClickedCategoryId,
	setClickedIndex,
	setClickedTypeId,
	setService,
	clearServices,
} from "../../Store/actions/actionServices";
import { setAvailable } from "../../Store/actions/providerProfile";
import {
	setStop,
	removeStop,
	clearStops,
	clearAddresses
} from '../../Store/actions/actionRequest';

// Services
import { handlerException } from "../../Services/Exception";
import { configBgLocation } from "../../Services/configBgLocation";

let t = require("tcomb-form-native-codificar");
let Form = t.form.Form;

const stylesheet = formStructConfig(t.form.Form.stylesheet);
const stylesheetSelected = formStructConfigSelected(t.form.Form.stylesheet);

// Styles
import styles, { formStructConfigSelected } from "./styles";
class CreateKnobRequestScreen extends Component {
  constructor(props) {
		super(props);

		this.api = new ProviderApi();

		this.state = {
			current_address: null,
			destination_address: strings("knob_request.destination_address"),
			polyline: null,
			hasEstimative: false,
			value: {
				name: "",
				phone: "",
			},
			maskPhone: "(99) 99999-9999",
			selectedPayment: {
				id: 1,
				name: this.props.payment_nomenclatures['name_payment_money'],
				flag: image.iconMoney,
			},
			modalPayment: false,
		};

		this.willFocus = this.props.navigation.addListener("willFocus", () => {
			if (this.props.address.source_address) {
				this.setState({
					current_address: this.props.address.source_address[0]._address,
					lastLat: this.props.address.source_address[0]._latitude,
					lastLong: this.props.address.source_address[0]._longitude,
				});
			}

			this.setState({
				destination_address: this.props.address.destination_address
					? this.props.address.destination_address[0]._address
					: strings("knob_request.destination_address"),
			});

			this.getEstimate();
		});
	}

	getEstimate() {
		try {
			this.getEstimativeAndPolyline();
		} catch (err) {
			this.setState({
				isLoading: false,
			});
		}
	}

	componentWillUnmount() {
		this.willFocus.remove();

		this.props.clearStops();

		if (this.backHandler) {
			this.backHandler.remove();
		}
	}

	componentDidMount() {
		try {
			this.getMyLocation();

			this.backHandler = BackHandler.addEventListener(
				"hardwareBackPress",
				() => {
					this.cancelKnobRequest();
					return true;
				}
			);

			this.getPayment();

			this.setDriverNotAvailable();
		} catch (error) { }
	}

	setDriverNotAvailable() {
		try {
			this.props.setAvailable(0);

			reactNativeProviderBubble.stopService();
		} catch (error) {
      handlerException('CreateKnobRequestScreen ', error);
		}
	}

	cancelKnobRequest() {
		Alert.alert(
			strings("alert.cancel_request"),
			strings("alert.cancel_request_message"),
			[
				{
					text: strings("general.no_tinny"),
					onPress: () => function () { },
					style: "cancel",
				},
				{
					text: strings("general.yes_tinny"),
					onPress: () => this.goBack(),
				},
			],
			{ cancelable: true }
		);
	}

	goBack() {
		this.props.clearAddresses();
		this.props.clearServices();
		this.props.clearStops();
		this.props.navigation.goBack();
	}

	/**
	 * Get my Location
	 */
	getMyLocation() {
		try {
			Geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;

					let region = {
						latitude: latitude,
						longitude: longitude,
						latitudeDelta: 0.015,
						longitudeDelta: 0.015,
					};

					this.updateAddress(region, latitude, longitude);

					this.setState({
						region,
					});
				},
				(error) => {
					Geolocation.getCurrentPosition((position) => {
						const { latitude, longitude } = position.coords;

						let region = {
							latitude: latitude,
							longitude: longitude,
							latitudeDelta: 0.015,
							longitudeDelta: 0.015,
						};

						this.setState({
							region,
						});

						this.updateAddress(region, latitude, longitude);
					});
				},
				{
					enableHighAccuracy: Platform.OS == "ios" ? false : true,
					timeout: 1000,
				}
			);
		} catch (error) { }
	}

	/**
	 * Get Address Information from Latitude and Longitude.
	 * @param {region} region
	 * @param {number} lastLat
	 * @param {number} lastLong
	 */
	async updateAddress(region = null, lastLat, lastLong) {
		try {
			const response = await this.api.GetAddressFromLatLng(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				lastLat,
				lastLong,
				this.props.settings.clicker
			);

			var result = response.data;

			result = result.data;

			this.setState({
				isLoading: false,
				region: region || this.state.region,
				lastLat: lastLat || this.state.lastLat,
				lastLong: lastLong || this.state.lastLong,
				current_address: result.address,
			});
		} catch (err) {
			this.setState({ isLoading: false });
			parse.showToast(strings("error.try_again"), Toast.durations.SHORT);
		}
	}

	/**
	 * Navigate to another Screen.
	 *
	 * @param {string} screen
	 * @param {string} type Type of Address (source, destination, home or work)
	 */
	navigateToScreen(screen, type) {
		const { navigate } = this.props.navigation;

		this.setState({ typeOfField: type });

		if (screen == "SetAddressScreen") {
			navigate(screen, {
				getAddressData: null,
				latitude: this.state.latitude,
				longitude: this.state.longitude,
				provider: this.props.providerProfile,
				address_type: type,
			});
		} else {
			navigate(screen);
		}
	}


	/**
	 * Faz a estimativa da corrida maçaneta.
	 */
	async getEstimativeAndPolyline() {
		try {
			if (
				this.state.current_address != null &&
				this.props.address.destination_address != null
			) {

				this.setState({ isLoading: true });

				await this.formatStops();

				const response = await this.api.getEstimateAndPolyline(
					this.props.providerProfile._id,
					this.props.providerProfile._token,
					this.state.lastLat,
					this.state.lastLong,
					this.props.address.destination_address[0]._latitude,
					this.props.address.destination_address[0]._longitude,
					null,
					this.props.stops && this.props.stops
				);

				const estimated = response.data;

				if (!estimated.success) {
					this.setState({
						isLoading: false,
						hasEstimative: false,
					});

					parse.showToast(
						strings("requests.handling_estimate_error"),
						Toast.durations.LONG
					);
				} else {
					this.setState({
						isLoading: false,
						time: estimated.time,
						distance: estimated.distance,
						polyline: estimated.polyline,
						hasEstimative: true,
					});

					const vehiclesType = this.props.serviceList;

					const filteredVehicles = estimated.services.map((service, _index) => {
						const foundType = vehiclesType.find(
							(type) => type.id === service.type_id
						);

						const foundCategory = foundType.categories.find(
							(category) => category.id === service.category_id
						);

						return {
							...service,
							gender_restriction: foundType.gender_restriction,
							is_clicked: foundType.is_default === 1 && !foundCategory ? 1 : 0,
							distance: estimated.formatted_distance,
							time: estimated.formatted_time,
							name: foundCategory
								? foundType.name + " " + foundCategory.name
								: foundType.name,
							icon:
								foundCategory && foundCategory.icon
									? foundCategory.icon
									: foundType.icon,
						};
					});

					const gender = `only_${this.props.providerProfile._gender}`;
					const restrictVehicles = filteredVehicles.filter(
						(restrict) =>
							restrict.gender_restriction === "none" ||
							restrict.gender_restriction === gender
					);

					this.props.setService(restrictVehicles);
				}
			}
		} catch (error) {
			this.setState({
				isLoading: false,
			});
		}
	}


	/**
	 * Recupera os tipos de dados do formulário de dados pessoais do cliente.
	 * @param {region} region
	 * @param {number} lastLat
	 * @param {number} lastLong
	 */
	getClientType() {
		var clientType = t.struct({
			name: t.String,
			phone: t.String,
		});

		return clientType;
	}

	getOptionsInput() {
		let optionsInput = {
			fields: {
				name: {
					stylesheet: this.state.isFocusedName
						? stylesheetSelected
						: stylesheet,
					error: strings("register.empty_first_name"),
					hasError: this.state.error_name,
					label: strings("register.first_name"),
				},
				phone: {
					stylesheet: this.state.isFocusedPhone
						? stylesheetSelected
						: stylesheet,
					maxLength: 15,
					error: this.state.error_phone,
					hasError: this.state.phone_error,
					keyboardType: "numeric",
					label: strings("register.phone"),
					mask:
						this.props.settings.language !== "ao" ? this.state.maskPhone : null,
				},
			},
		};

		return optionsInput;
	}

	onChange(value) {
		this.setState({ value });
	}


	/**
	 * Valida se o usuário digitou um nome válido
	 */
	checkName() {
		if (
			this.state.value.name != null &&
			this.state.value.name != undefined &&
			this.state.value.name != ""
		) {
			this.setState({
				error_name: false,
			});

			return true;
		} else {
			this.setState({
				error_name: true,
			});

			return false;
		}
	}

	/**
	 * Formata o telefone para padrão pt-br e pt-ao
	 */
	formatPhone() {
		return this.props.settings.language !== "ao"
			? "+55" + this.state.value.phone.replace(/[^\d]+/g, "")
			: this.state.value.phone.replace(/[^\d]+/g, "");
	}

	/**
	 * Remove todas as paradas que não foram devidamente preenchidas
	 */
	async formatStops() {
		let stops = this.props.stops;

		for (var i = stops.length - 1; i >= 0; i--) {
			if (stops[i].latitude == 0) {
				stops.splice(i, 1);
			}
		}

		this.props.setStop(stops);
	}

	/**
	 * Cria uma corrida maçaneta
	 */
	async requestKnobRequest() {
		try {
			this.setState({ isLoading: true });

			let isNameValid = this.checkName();
			let phone = this.formatPhone();

			if (!isNameValid) {
				this.setState({
					isLoading: false,
					error_name: true
				});

				return;
			}

			await this.formatStops();

			await this.api.createKnobRequest(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				this.state.distance,
				this.state.time,
				this.state.polyline,
				this.state.lastLat,
				this.state.lastLong,
				this.props.address.destination_address[0]._latitude,
				this.props.address.destination_address[0]._longitude,
				this.props.clickedTypeId,
				this.props.clickedCategoryId,
				this.state.selectedPayment.id,
				this.state.current_address,
				this.state.destination_address,
				this.state.value.name,
				phone,
				this.props.stops && this.props.stops
			);

			await this.acceptService();
		} catch (error) {
			this.setState({ isLoading: false });
		}
	}

	async acceptService() {
		try {
			this.setState({
				isLoading: true,
			});

			const response = await this.api.GetRequestInProgressId(
				this.props.providerProfile._id,
				this.props.providerProfile._token
			);

			const { data: result } = response;

			if (!parse.isSuccess(result)) {
				this.setState({ isLoading: false }, () => {
					parse.showToast(strings("error.try_again"), Toast.durations.LONG)
				});
			}

			await this.props.onRequestUpdated(result);
			await this.props.onSetReceiveNotice(true);
			await this.props.clearAddresses();
			await this.props.clearServices();

			configBgLocation(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				this.props.settings.update_location_interval,
				this.props.settings.update_location_fast_interval,
				this.props.settings.distance_filter,
				this.props.settings.disable_elasticity,
				this.props.settings.heartbeat_interval,
				this.props.settings.stop_timeout,
				result.request_id
			);

			reactNativeProviderBubble.startService();

			this.setState({ isLoading: false });

			this.props.navigation.navigate("ServiceUserBoardScreen", {
				request_id: result.request_id,
			});
		} catch (error) {
			this.setState({ isLoading: false });
			parse.showToast(strings("error.try_again"), Toast.durations.LONG);
		}
	}

	/**
	 * @param {Object} param
	 * @param {number} param.index
	 * @param {object} param.service_item
	 * @param {number} param.service_item.type_id
	 * @param {number} param.service_item.category_id
	 * @param {object} param.services
	 */
	getClickedVehicle({ index, service_item, services }) {
		this.setState({ clickedVehicleType: true });

		this.props.setClickedIndex(index);
		this.props.setClickedCategoryId(service_item.category_id);
		this.props.setService(services);
		this.props.setClickedTypeId(service_item.type_id);
	}

	getPayment() {
		let payment = [];

		payment.push(
			{
				id: 1,
				name: this.props.payment_nomenclatures['name_payment_money'],
				flag: image.iconMoney,
			},
			{
				id: 3,
				name: this.props.payment_nomenclatures['name_payment_machine'],
				flag: image.iconMachine,
			}
		);

		this.setState({
			payment: payment,
		});
	}

	modalPayment(value) {
		this.setState({
			modalPayment: value,
		});
	}

	selectedPayment(value) {
		this.setState({
			selectedPayment: value,
			modalPayment: false,
		});
	}

	setStopAddress(id) {
		const { navigate } = this.props.navigation;

		navigate("SetAddressScreen", {
			stopId: id,
			latitude: this.state.latitude,
			longitude: this.state.longitude,
			provider: this.props.providerProfile,
			address_type: 'stop',
		});
	}

	setStop() {
		const address = {
			id: Math.random(),
			address: "",
			latitude: 0,
			longitude: 0
		};

		this.props.setStop([...this.props.stops, address]);

		this.setState({
			refresh: !this.state.refresh
		})

		this.getEstimate();
	}

	removeStop(id) {
		const index = this.props.stops.findIndex((value) => { return value.id === id });
		let newStop = this.props.stops;
		newStop.splice(index, 1);

		this.props.setStop(newStop);

		this.setState({
			refresh: !this.state.refresh
		});

		this.getEstimate();
	}

	render() {
		const renderItem = ({ item }) => {
			return (
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<TouchableOpacity
						onPress={() =>
							this.setStopAddress(item.id)
						}
						style={styles.touchStop}
					>
						<Text numberOfLines={1}>{item.address ? item.address : strings('fill_address.stop_location')}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => this.removeStop(item.id)}
						style={styles.addStop}
					>
						<AntDesign
							name="minus"
							size={30}
							color="#000"
						/>
					</TouchableOpacity>
				</View>
			);
		};

		return (
			<KeyboardAvoidingView style={{ flex: 1 }} enabled>
				<SafeAreaView
					style={styles.container}
					keyboardShouldPersistTaps="handled"
				>
					<ScrollView>
            <DefaultHeader
							loading={this.state.isLoading}
							loadingMsg={strings("load.Loading")}
              btnBackListener={() => this.cancelKnobRequest()}
              title={strings('knob_request.new_knob_request')}
              subtitle={strings("knob_request.insert_address")}
            />

						<View style={styles.containerAddress}>
							<View style={{ flex: 1}}>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
									}}
								>
									<TouchableOpacity
										onPress={() =>
											this.navigateToScreen("SetAddressScreen", "source")
										}
										style={[styles.touchSource, { flex: 0.9 }]}
									>
										<Text numberOfLines={1}>
											{this.state.current_address
												? this.state.current_address
												: strings("knob_request.source_address")}
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										onPress={() => null}
										style={styles.addStop}
									>
									</TouchableOpacity>
								</View>

								<FlatList
									data={this.props.stops}
									renderItem={renderItem}
									keyExtractor={item => `${item.id}`}
									extraData={this.state.refresh}
								/>

								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
									}}
								>
									<TouchableOpacity
										onPress={() =>
											this.navigateToScreen("SetAddressScreen", "destination")
										}
										style={[styles.touchDestino, { flex: 0.9 }]}
									>
										<Text numberOfLines={1}>
											{this.state.destination_address}
										</Text>
									</TouchableOpacity>

									{this.props.stops && this.props.stops.length < 3 && (
										<TouchableOpacity
											onPress={() => this.setStop()}
											style={styles.addStop}
										>
											<AntDesign
												name="plus"
												size={30}
												color="#000"
											/>
										</TouchableOpacity>
									)}
								</View>
							</View>
						</View>

						{this.state.hasEstimative && (
							<>
								<View style={{ paddingHorizontal: 25 }}>
									<Text style={[styles.userDataText, { marginBottom: 20 }]}>
										{strings("knob_request.insert_user_data")}
									</Text>

									<Form
										ref={(ref) => (this._refForm = ref)}
										type={this.getClientType()}
										options={this.getOptionsInput()}
										value={this.state.value}
										onChange={this.onChange.bind(this)}
									/>
								</View>

								<View style={styles.areaBottomEstimative}>
									<CompleteOrder
										service={this.props.services}
										getClickedVehicle={(index, service_item, services) =>
											this.getClickedVehicle(index, service_item, services)
										}
									/>

									<View style={{ marginHorizontal: 25 }}>
										<TouchableOpacity
											style={styles.paymentContainer}
											onPress={() => this.modalPayment(true)}
										>
											<Image
												source={this.state.selectedPayment.flag}
												resizeMode="contain"
												style={styles.flag}
											/>
											<Text
												style={{
													marginHorizontal: 20,
													fontSize: 20,
													fontWeight: "bold",
												}}
											>
												{this.state.selectedPayment.name}
											</Text>
										</TouchableOpacity>
									</View>

									<View style={styles.button_knob_request}>
										<TouchableOpacity
											onPress={() => this.requestKnobRequest()}
											style={styles.button}
										>
											<Text
												style={{
													color: "white",
													fontSize: 18,
													fontWeight: "bold",
												}}
											>
												{strings("knob_request.create_knob_request")}
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							</>
						)}

						<Modal
							visible={this.state.modalPayment}
							useNativeDriver
							backdropColor="#FBFBFB"
							backdropOpacity={1}
							animationType="fade"
							transparent={false}
							onRequestClose={() => {
								this.modalPayment(false);
							}}
						>
							<SafeAreaView style={{ flex: 1 }}>
								<AntDesign
									name="close"
									size={25}
									color="#000"
									onPress={() => this.modalPayment(false)}
									style={{ marginHorizontal: 25, paddingVertical: 25 }}
								/>

								<TitleHeader
									text={strings("knob_request.payment_methods")}
									align="flex-start"
								/>

								<FlatList
									data={this.state.payment}
									extraData={this.state.payment}
									keyExtractor={(item) => item.id.toString()}
									renderItem={({ item }) => (
										<TouchableOpacity
											key={item.id}
											style={styles.paymentCardModal}
											activeOpacity={0.6}
											onPress={() => this.selectedPayment(item)}
										>
											<Image style={styles.flag} source={item.flag} />
											<Text
												style={[
													styles.textMessage,
													{ color: item.disabled ? "#C3C3C3" : "#222" },
												]}
											>
												{item.name}
											</Text>
											{this.state.selectedPayment.id == item.id && (
												<View style={styles.iconCheck}>
													<Feather name="check" size={18} color={"white"} />
												</View>
											)}
										</TouchableOpacity>
									)}
								/>
							</SafeAreaView>
						</Modal>
					</ScrollView>
				</SafeAreaView>
			</KeyboardAvoidingView>
		);
	}
}

const mapStateToProps = (state) => {
	const { request } = state.request;
	const { settings, payment_nomenclatures } = state.settingsReducer;
	const {
		services,
		clickedIndex,
		clickedTypeId,
		clickedCategoryId,
		categories,
	} = state.servicesReducer;

	const { stops } = state.requestsReducer;

	return {
		providerProfile: state.providerProfile.providerProfile,
		settings,
		address: state.requestsReducer,
		serviceList: state.servicesReducer.serviceList,
		services: state.servicesReducer.services,
		request,
		services,
		clickedIndex,
		clickedTypeId,
		clickedCategoryId,
		categories,
		payment_nomenclatures,
		stops
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		clearAddresses: (value) => dispatch(clearAddresses(value)),
		onRequestUpdated: (request) => dispatch(requestUpdated(request)),
		setService: (value) => dispatch(setService(value)),
		setClickedIndex: (value) => dispatch(setClickedIndex(value)),
		setClickedCategoryId: (value) => dispatch(setClickedCategoryId(value)),
		setClickedTypeId: (value) => dispatch(setClickedTypeId(value)),
		clearServices: (value) => dispatch(clearServices(value)),
		setAvailable: (value) => dispatch(setAvailable(value)),
		onSetReceiveNotice: data => dispatch(setReceiveNotice(data)),

		setStop: value => dispatch(setStop(value)),
		removeStop: value => dispatch(removeStop(value)),
		clearStops: value => dispatch(clearStops(value))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateKnobRequestScreen);
