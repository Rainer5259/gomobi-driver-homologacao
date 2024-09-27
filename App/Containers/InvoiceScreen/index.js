// Modules
import React, {Component} from 'react';
import {BackHandler, Text, View, Image, StatusBar} from 'react-native';
import Toast from 'react-native-root-toast';
import Geolocation from '@react-native-community/geolocation';
import {connect} from 'react-redux';
import {Platform} from 'react-native';
import {SafeAreaView} from 'react-native';
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';

// Components
import ActionButton from '../../Components/ActionButton';
import Loader from '../../Components/Loader';
import Payment from '../../Components/Payment';

// Locales
import {strings} from '../../Locales/i18n';

// Services
import ProviderApi from '../../Services/Api/ProviderApi';
import {handlerException} from '../../Services/Exception';

// Store
import {requestClear} from '../../Store/actions/request';

// Themes
import {Images} from '../../Themes';

// Util
import * as parse from '../../Util/Parse';

// Styles
import styles from './styles';
import { PAYMENT_MODE_MONEY } from '../../Util/Constants';

class InvoiceScreen extends Component {
	constructor(props) {
		super(props);

		this.api = new ProviderApi();

		this.state = {
			isLoading: true,
			requestID: 0,
			lastLat: null,
			lastLong: null,
			service_text_button: strings('invoice.finish'),
		};
	}

	/**
	 * Pt-BR
	 * Recupera todas as informações relevantes da tela anterior, como provider e request_id
	 *
	 * EN
	 * Retrieves all relevant information from the previous screen, such as provider and request_id
	 *
	 */
	componentDidMount() {
		this.backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				return true;
			}
		);

		if (this.props.navigation.state.params) {
			this.provider = this.props.navigation.state.params.provider;
			var request_id = this.props.navigation.state.params.request_id;

			this.setState({
				requestID: request_id,
			});
		}

		this.position();
	}

	position() {
		try {
			Geolocation.getCurrentPosition(
				(position) => {
					const {latitude, longitude} = position.coords;

					this.setState({
						lastLat: latitude || this.state.lastLat,
						lastLong: longitude || this.state.lastLong,
						isLoading: false,
					});
				},
				(error) => {
          handlerException('InvoiceScreen', error);

					Geolocation.getCurrentPosition(
						(position) => {
							const {latitude, longitude} = position.coords;

							this.setState({
								lastLat: latitude || this.state.lastLat,
								lastLong: longitude || this.state.lastLong,
								isLoading: false,
							});
						},
						{
							enableHighAccuracy:
								Platform.OS == 'ios' ? false : false,
							timeout: 1000,
						}
					);
				},
				{
					enableHighAccuracy: Platform.OS == 'ios' ? false : true,
					timeout: 1000,
				}
			);

			this.setState({
				isLoading: false,
			});
		} catch (error) {
      handlerException('InvoiceScreen', error);

			this.setState({
				isLoading: false,
			});
		}
	}

	positionSynchronous() {
		return new Promise((resolve, reject) => {
			Geolocation.getCurrentPosition(
				(position) => {
					if ((position.coords.latitude, position.coords.longitude))
						resolve({
							lat: position.coords.latitude,
							lgt: position.coords.longitude,
						});
					else reject();
				},
				(error) => {
					Geolocation.getCurrentPosition((position) => {
						if (
							(position.coords.latitude,
							position.coords.longitude)
						)
							resolve({
								lat: position.coords.latitude,
								lgt: position.coords.longitude,
							});
						else reject();
					});
				}
			);
		});
	}

	/**
	 * Show alert of Invalid Token and call Logout function
	 */
	doLogout() {
		Alert.alert(
			strings('invalidToken.invalid'),
			strings('invalidToken.invalid_message'),
			[{text: strings('general.OK'), onPress: () => this.logout()}],
			{cancelable: false}
		);
	}

	/**
	 * Clear data and call logout function.
	 */
	logout() {
		const {navigate} = this.props.navigation;

		provider_id = this.props.providerProfile._id;
		provider_token = this.props.providerProfile._token;
		this.props.providerProfile = null;
		parse.logout(provider_id, provider_token, navigate);
	}

	/**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const {navigate} = this.props.navigation;
		return navigate;
	}

	apiRequestCompleted(lastLatitude, lastLongitude) {
		this.setState({
			isLoading: true,
		});
		const {navigate} = this.props.navigation;
		this.api
			.RequestCompleted(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				this.state.requestID,
				lastLatitude,
				lastLongitude
			)
			.then(async (response) => {
				var responseJson = response.data;

				if (parse.isSuccess(responseJson, this.returnConstNavigate())) {
					await this.props.onRequestClear();

					this.setState({
						isLoading: false,
					});

					navigate('ServiceFinishedScreen', {
						provider: this.provider,
						request_id: this.state.requestID,
					});
				} else {
					this.setState({
						isLoading: false,
					});

					if (responseJson.error_code == 406) {
						this.doLogout();
					}
				}
			})
			.catch((error) => {
				this.setState({isLoading: false});
				parse.showToast(
					strings('error.try_again'),
					Toast.durations.LONG
				);
				handlerException('RequestCompleted ', error);
			});
	}

	onRightSlide() {
		if (this.state.lastLat && this.state.lastLong) {
			this.apiRequestCompleted(this.state.lastLat, this.state.lastLong);
		} else {
			this.getLocationSynchronously();
		}
	}

	getLocationSynchronously() {
		try {
			var that = this;
			this.positionSynchronous()
				.then(function (location) {
					that.apiRequestCompleted(location.lat, location.lgt);
				})
				.catch(() => {
					this.position();
					parse.showToast(
						strings('error.location_error'),
						Toast.durations.LONG
					);
				});
		} catch (error) {
			handlerException('getLocationSynchronously', error);
		}
	}

	/**
	 * Get total formatted
	 */
	getTotalFormatted() {
		if (this.props.bill && this.props.bill.total_formatted)
			return this.props.bill.total_formatted;
		else if (this.props.bill && this.props.bill.total)
			return this.props.bill.total;
		else return 0;
	}

	renderActionButton = () => {
		const {button_slider} = this.props.settings;
		if (button_slider) {
			return (
				<RNSlidingButton
					style={styles.slideButton}
					height={40}
					onSlidingSuccess={this.onRightSlide.bind(this)}
					slideDirection={SlideDirection.RIGHT}>
					<View style={styles.containerContentSlidingButton}>
						<View
							style={{
								flex: 0.1,
								marginLeft: 10,
								flexDirection: 'row',
							}}>
							<Image
								source={Images.icon_arrow_right_white}
								style={styles.icon_arrow_right_white}
							/>
							<Image
								source={Images.icon_arrow_right_white}
								style={styles.icon_arrow_right_white}
							/>
						</View>

						<Text numberOfLines={1} style={styles.titleText}>
							{this.state.service_text_button}
						</Text>
					</View>
				</RNSlidingButton>
			);
		}

		return (
			<View style={{elevation: 10, position: 'relative'}}>
				<ActionButton
					text={this.state.service_text_button}
					onPressSync={this.onRightSlide.bind(this)}
				/>
			</View>
		);
	};

	render() {
		return (
			<>
				<StatusBar
					backgroundColor="transparent"
					barStyle="dark-content"
				/>
				<SafeAreaView style={styles.container}>
					<Loader
						loading={this.state.isLoading}
						message={strings('load.Loading')}
					/>
					<Image source={Images.wallet_card} style={styles.image} />
					<View style={styles.info}>
						{ this.props?.bill?.payment_mode >= 0  ? ( <>
							{this.props.bill.total_formatted || 
								this.props.bill.total ? (
								<View style={styles.boxInfo}>
									<Text style={styles.valueCollected}>
										{this.props.bill.payment_mode == PAYMENT_MODE_MONEY
											? strings('invoice.valueCollected')
											: strings('invoice.totalValue')}
									</Text>
									<Text style={styles.valueCollected}>
										{this.getTotalFormatted()}
									</Text>
								</View>
							): null}

							{this.props.bill.fixed_cost > 0 ? (
								<View style={styles.boxInfo}>
									<Text style={styles.invoiceText}>
										{strings('invoice.fixed_cost')}
									</Text>
									<Text style={styles.invoiceText}>
										{this.props.bill.fixed_cost_formatted}
									</Text>
								</View>
							): null}

							{this.props.bill.provider_value_formatted ? (
								<View style={styles.boxInfo}>
									<Text style={styles.invoiceText}>
										{strings('invoice.value')}
									</Text>
									<Text style={styles.invoiceText}>
										{this.props.bill.provider_value_formatted}
									</Text>
								</View>
							): null}
						</>) : null}

						<View style={styles.boxInfo}>
							<Text style={styles.invoiceText}>
								{strings('invoice.paymentForm')}
							</Text>
							<Payment
								id={
									this.props.bill &&
									this.props.bill.payment_mode
										? this.props.bill.payment_mode
										: 2
								}
								qrCode={this.props.bill.qr_code_url}
								payment_nomenclatures={
									this.props.payment_nomenclatures
								}
							/>
						</View>
					</View>

					{this.renderActionButton()}
				</SafeAreaView>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {providerProfile} = state.providerProfile;
	const {settings, payment_nomenclatures} = state.settingsReducer;
	const {request, user, bill} = state.request;

	return {
		providerProfile,
		request,
		user,
		bill,
		settings,
		payment_nomenclatures,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onRequestClear: () => dispatch(requestClear()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceScreen);
