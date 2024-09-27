// Modules
import React, {Component} from 'react';
import {
	Dimensions,
	Text,
	View,
	Image,
	BackHandler,
	Platform,
	TouchableOpacity,
	Alert,
	Animated,
	TouchableHighlight,
	Vibration,
	Share,
	StatusBar,
	SafeAreaView,
} from 'react-native';
import debounce from 'lodash/debounce';
import Sound from 'react-native-sound';
import Toast from 'react-native-root-toast';
import prompt from 'react-native-prompt-android';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNProviderBubble from 'react-native-provider-bubble';
import RideChat from 'react-native-chat/src/components/RideButton';
import BalanceButton from 'react-native-finance/src/BalanceButton';
import GLOBAL from 'react-native-finance/src/Functions/Global';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import BackgroundGeolocation from 'react-native-background-geolocation';
import MapView, {Marker as RNMMarker, Polyline} from 'react-native-maps';
import {connect} from 'react-redux';
import { showLocation} from 'react-native-map-link';
import {PanicButton} from 'react-native-panic';
import {NavigationActions, StackActions} from 'react-navigation';
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

// Actions
import {permissionsAction} from '../../Actions/permissions.action';

// Components
import Loader from '../../Components/Loader';
import Payment from '../../Components/Payment';
import ActionButton from '../../Components/ActionButton';

// generatedMapStyle
import {styledMap} from '../../../generatedMapStyle';

// Helpers
import {convertPolyline} from '../../Helpers/requestHelper';

// Images
import shield from '../../Images/Icons/shield.png';

// Models
import Marker from '../../Models/Marker';

// Locales
import {currentLanguage, currentLocale, strings} from '../../Locales/i18n';

// Services
import ProviderApi from '../../Services/Api/ProviderApi';
import {handlerException} from '../../Services/Exception';
import {configBgLocation, BgLocationClear} from '../../Services/configBgLocation';

// Store
import {
	requestUpdated,
	requestFinish,
	requestClear,
	setBill,
} from '../../Store/actions/request';
import {changeLedger} from '../../Store/actions/providerProfile';
import { changeCoordinatesProvider } from '../../Store/actions/actionCoordinatesProvider';

// Themes
import {Images} from '../../Themes';
import {PrimaryButton, WBASE_URL, WPROJECT_NAME} from '../../Themes/WhiteLabelTheme/WhiteLabel';
import images from '../../Themes/WhiteLabelTheme/Images';

// Util
import * as parse from '../../Util/Parse';
import Connection from '../../Util/Connection';
import * as constants from '../../Util/Constants';

// Styles
import styles, { RouteInfoView } from './styles';
import Modal from '../../Components/Modal';
import DefaultHeader from '../../Components/DefaultHeader';
import Button from '../../Components/RoundedButton';
import { isAppInstalled } from '../../Components/react-native-open-maps/src/utils';

const offsetHeight = 200;
const viewHeight = -Dimensions.get('window').height + offsetHeight;

class ServiceUserBoardScreen extends Component {
	constructor(props) {
		super(props);
		this.translateY = new Animated.Value(0);
		this.user;
		this.request = null;
		this.map = null;
    this._balance = React.createRef();

		this.willFocus = this.props.navigation.addListener(
			'willFocus',
			async () => {
				constants.currentScreen = 'ServiceUserBoardScreen';

				clearInterval(constants.markerInterval);

				this.getRequestDetails();

				let request = this.props.request;

				if (request?.request_id) {
					await this.subscribeSocket(request.request_id);
				}

				this.getDistanceAndTimeToArrive();

        this._balance.current.loadBalance()
			}
		);

		this.willBlur = this.props.navigation.addListener('willBlur', () => {
			this.unsubscribeSocket();
			clearInterval(this.intervalUpdateGetRequestDetails);
			clearInterval(this.intervalUpdateDistanceAndTimeToArrive);
		});

		this.api = new ProviderApi();

		const {init_time, init_dist} = this.initTravelInfo(this.props.request);

		this.state = {
			region: null,
      modal: {
        show: false,
        value: true,
        pendingLocations: []
      },
			isLoading: true,
			markerUser: [],
			polyline: [],
			service_text_button: strings(
				'ServiceUserBoardScreen.service_text_button_started'
			),
			titleDes: '',
			latitudeDes: 0,
			longitudeDes: 0,
			longitude: 0,
			arrived: false,
			started: false,
			point: [],
			is_chat_enabled: this.props.settings.is_chat_enabled,
			time_to_arrive: init_time,
			distance_to_arrive: init_dist,
			sound: '',
			loading_message: strings('load.Loading'),
			infoVehicleWinch: false,
			ledger_id: this.props.providerProfile._ledger_id,
			panic_button_enabled_provider:
				this.props.settings.panic_button_enabled_provider,
			waiting_ride: true,
		};

		this.updateRouteAndMap = 0;

		constants.currentScreen = 'ServiceUserBoardScreen';
	}

	getDistanceAndTimeToArrive() {
		this.intervalUpdateDistanceAndTimeToArrive = setInterval(() => {
			if (this.props.request?.request_id) {
				this.api
					.getDistanceAndTimeToArrive(
						this.props.providerProfile._id,
						this.props.providerProfile._token,
						this.props.request.request_id
					)
					.then(() => {})
					.catch((erro) => {
						handlerException(
							'ServiceUserBoardScreen.getDistanceAndTimeToArrive:',
							erro
						);
					});
			}
		}, 30000);
	}

	/**
	 * Get initial travel info
	 * @param {object} request
	 */
	initTravelInfo(request) {
		try {
			if (typeof request != 'object')
				return {
					init_time: '',
					init_dist: '',
				};

			return {
				init_time: 0,
				init_dist: 0,
			};
		} catch (error) {
			handlerException('ServiceUserBoardScreen.initTravelInfo', error);
		}
	}

	isConnected() {
		return Connection();
	}
	/**
	 * Play the sound request
	 */
	playSoundRequest() {
		try {
			Vibration.vibrate();
			if (this.state.sound) {
				this.state.sound.play(() => {});
			}
		} catch (error) {
			handlerException('ServiceUserBoardScreen.playSoundRequest', error);
		}
	}

	// You must remove listeners when your component unmounts
	componentWillUnmount() {
		if (this.backHandler) {
			this.backHandler.remove();
		}

		this.willBlur?.remove();
		this.willFocus?.remove();

		if (this.intervalUpdateGetRequestDetails) {
			clearInterval(this.intervalUpdateGetRequestDetails);
		}

		if (this.intervalUpdateDistanceAndTimeToArrive) {
			clearInterval(this.intervalUpdateDistanceAndTimeToArrive);
		}
	}

	/**
	 *
	 * @param {*} prevProps
	 * @param {*} prevState
	 * @param {*} snapshot
	 * Toda vez que o this.props.latitude ou longitude atualiza e chama essa função,
	 * fazendo atualizar a posição do provider em tela e atualiza a latitude e longitude para as funções
	 */
	componentDidUpdate(prevProps, prevState, snapshot) {
		if (
			this.state.lastLat != prevProps.latitude &&
			this.state.lastLong != prevProps.longitude &&
			!this.state.isLoading
		) {
			var markerUser = this.createUserMarker(
				100,
				strings('map_screen.current_location'),
				prevProps.latitude,
				prevProps.longitude
			);

			this.setState({
				markerUser: markerUser,
				region: prevProps.region,
				lastLat: prevProps.latitude,
				lastLong: prevProps.longitude,
				latitude: prevProps.latitude,
				longitude: prevProps.longitude,
				isLoading: false,
			});
		}
	}

	componentDidMount() {
		this.cordenadas();
		this.getPaymentSettings();
		this.setBackHandler();
		this.setInitialInfo();
		this.requestStatus();
		this.stopPendingVibration();
		this.debounce();
    this.initFinanceLib();
	}

  initFinanceLib() {
    GLOBAL.appUrl = constants.BASE_URL;
    GLOBAL.lang = currentLanguage;
    GLOBAL.locale = currentLocale;
    GLOBAL.color = PrimaryButton;

    GLOBAL.type = constants.TYPE_PROVIDER;
    GLOBAL.id = this.props.providerProfile._id;
    GLOBAL.token = this.props.providerProfile._token;
    GLOBAL.ledger_id = this.props.providerProfile._ledger_id;

    GLOBAL.defaultHeader = DefaultHeader;
    GLOBAL.defaultButton = Button;
  }

	debounce() {
		this.onRightSlide = debounce(this.onRightSlide.bind(this), 350);
	}

	stopPendingVibration() {
		try {
			Vibration.cancel();
		} catch (error) {
			handlerException('ServiceUserBoardScreen.stopPendingVibration', error);
		}
	}

	setInitialInfo(sound) {
		try {
			var sound = this.getSound();

			this.setState({
				sound,
				polyline: this.props.request?.provider_to_source,
				emergency_button_enabled:
					this.props.settings.emergency_button_enabled,
				is_tracking_enabled: this.props.settings.is_tracking_enabled,
			});
		} catch (error) {
			handlerException('ServiceUserBoardScreen.setInitialInfo', error);
		}
	}

	setBackHandler() {
		try {
			this.backHandler = BackHandler.addEventListener(
				'hardwareBackPress',
				() => {
					Alert.alert(
						strings('map_screen.exit_app'),
						strings('map_screen.exit_app_msg'),
						[
							{
								text: strings('general.no_tinny'),
								onPress: () => () => function () {},
								style: 'cancel',
							},
							{
								text: strings('general.yes_tinny'),
								onPress: () => BackHandler.exitApp(),
							},
						],
						{cancelable: true}
					);
					return true;
				}
			);
		} catch (error) {
			handlerException('ServiceUserBoardScreen.setBackHandler', error);
		}
	}

	getSound() {
		try {
			var sound = '';

			sound = new Sound('beep.wav', Sound.MAIN_BUNDLE, () => {});
			this.setState({
				sound,
			});

			return sound;
		} catch (error) {
			handlerException('ServiceUserBoardScreen.getSound', error);
		}
	}

	getPaymentSettings() {
		try {
			if (
				this.props.settings.show_payment_type_to_called_provider !=
					undefined &&
				this.props.show_payment_type_to_called_provider != null
			) {
				this.setState({
					show_payment_type_to_called_provider:
						this.props.show_payment_type_to_called_provider,
				});
			}
		} catch (error) {
			handlerException(
				'ServiceUserBoardScreen.getPaymentSettings',
				error
			);
		}
	}

	verifyTitleHttp(destAddress) {
		try {
			if (destAddress !== undefined && destAddress != null) {
				if (destAddress.length > 0) {
					return destAddress;
				}
			}
			return this.state.titleDes;
		} catch (error) {
			handlerException('ServiceUserBoardScreen.verifyTitleHttp', error);
		}
	}

	/**
	 * Seta posição do provider quando abre a tela
	 */
	cordenadas() {
		try {
			this.setState({
				isLoading: true,
				loading_message: strings('load.LoadingMap'),
			});

			var markerUser = this.createUserMarker(
				100,
				strings('map_screen.current_location'),
				this.props.latitude,
				this.props.longitude
			);

			this.setState({
				isLoading: false,
				loading_message: strings('load.Loading'),
				markerUser: markerUser,
				region: this.props.region,
				latitude: this.props.latitude,
				longitude: this.props.longitude,
			});

			if (this.map != null) {
				this.map.animateToRegion(this.props.region, 1500);
			}
		} catch (error) {
			handlerException('ServiceUserBoardScreen.cordenadas', error);
		}
	}

	regionAnimated() {
		try {
			if (this.map != null) {
				this.setState({
					controll: false,
				});
				this.map.animateToRegion(this.props.region, 1500);
			}
		} catch (error) {
			handlerException('ServiceUserBoardScreen.regionAnimated', error);
		}
	}

	/**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const {navigate} = this.props.navigation;
		return navigate;
	}

	/**
	 * Function to make a call to user
	 */
	callUser() {
		try {
			if (Platform.OS == constants.ANDROID) {
				permissionsAction.requestCallPermission().then((result) => {
					if (result) {
						RNImmediatePhoneCall.immediatePhoneCall(
							this.props.user.phone
						);
					}
				});
			} else {
				RNImmediatePhoneCall.immediatePhoneCall(this.props.user.phone);
			}
		} catch (error) {
			handlerException('ServiceUserBoardScreen.callUser', error);
		}
	}

	/**
	 * Function to send a message to user
	 */
	messageUser() {
		alert('SENDING A MESSAGE TO NUMBER ' + this.props.user.phone);
	}

	/**
	 * Show Alert to Cancel the Request
	 */
	cancelRequestAlert() {
		Alert.alert(
			strings('ServiceUserBoardScreen.cancel_request_title'),
			null,
			[
				{
					text: strings('general.no'),
					onPress: () => function () {},
					style: 'cancel',
				},
				{
					text: strings('general.yes'),
					onPress: () => this.showAlertToGetReason(),
				},
			],
			{cancelable: false}
		);
	}

	/**
	 * showAlertToGetReason
	 */
	showAlertToGetReason() {
		if (Platform.OS == constants.ANDROID) {
			prompt(
				strings('ServiceUserBoardScreen.cancel_reason_title'),
				strings('ServiceUserBoardScreen.cancel_reason_message'),
				[
					{
						text: strings('general.cancel'),
						onPress: () => function () {},
						style: 'cancel',
					},
					{
						text: strings('general.OK'),
						onPress: (reason) => this.cancelRequest(reason),
					},
				],
				{
					type: 'default',
					cancelable: false,
					defaultValue: '',
					placeholder: '',
				}
			);
		} else if (Platform.OS == constants.IOS) {
			Alert.prompt(
				strings('ServiceUserBoardScreen.cancel_reason_title'),
				strings('ServiceUserBoardScreen.cancel_reason_message'),
				[
					{
						text: strings('general.cancel'),
						style: 'cancel',
					},
					{
						text: strings('general.OK'),
						onPress: (reason) => this.cancelRequest(reason),
					},
				],
				'plain-text',
				'',
				'default'
			);
		}
	}

	/**
	 * Cancel the request
	 */
	cancelRequest(reason) {
		this.setState({isLoading: true});

		if (reason == null || reason == undefined || reason == '') {
			parse.showToast(
				strings('error.insert_reason_cancellation'),
				Toast.durations.SHORT
			);
			this.setState({isLoading: false});
		} else if (
			this.props.providerProfile != null &&
			this.props.providerProfile._id != null
		) {
			var cancelRequest = this.api.CancelRequestByProvider(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				this.props.request
					? this.props.request.request_id
					: this.props.navigation.state.params.request_id,
				reason
			);

			cancelRequest
				.then((response) => {
					this.setState({isLoading: false});

					var cancel = response.data;

					if (cancel.success) {
						this.prepareToGoToMainScreen();
						return;
					}
				})
				.catch((error) => {
					this.setState({isLoading: false});
					parse.showToast(
						strings('error.try_again'),
						Toast.durations.LONG
					);
					this.prepareToGoToMainScreen();
				});
		} else {
			parse.showToast(strings('error.try_again'), Toast.durations.LONG);
			this.setState({isLoading: false});
		}
	}

	/**
	 * Unsubscribe from active socket and delete Request Model
	 * To go to MainScreen
	 */
	prepareToGoToMainScreen() {
		constants.serviceRequestScreen = false;
		constants.hasService = false;
		RNProviderBubble.finishRequest();
		this.navigateToScreen('MainScreen');
	}

	/**
	 * Navigate to another screen
	 * @param {String} screen
	 */
	navigateToScreen(screen) {
		try {
			const {navigate} = this.props.navigation;
			this.unsubscribeSocket();

			if (this.intervalUpdateGetRequestDetails) {
				clearInterval(this.intervalUpdateGetRequestDetails);
			}

			if (this.intervalUpdateDistanceAndTimeToArrive) {
				clearInterval(this.intervalUpdateDistanceAndTimeToArrive);
			}
			/**
			 * Navigate to another Screen.
			 * First parameter: Screen to be initialized passed in "screen" variable
			 * Second parameter: Information sent from CurrentScreen to NextScreen.
			 * Use "this.props.navigation.state.params.loginBy" to use data on the other Screen
			 */

			/**
			 * Navigate to MainScreen and reset the cache
			 */
			if (screen == 'MainScreen') {
				this.props.onRequestClear();

				this.props.navigation.dispatch(
					StackActions.reset({
						index: 0,
						key: null,
						actions: [
							NavigationActions.navigate({
								routeName: screen,
								params: {
									user: this.props.providerProfile,
									screen: 'ServiceUserBoardScreen',
								},
							}),
						],
					})
				);
			} else if (screen == 'MyRequestsScreen') {
				navigate(screen, {screen: 'ServiceUserBoardScreen'});
			} else if (screen == 'ServiceFinishedScreen') {
				navigate(screen, {
					provider: this.props.providerProfile,
					request_id: this.props.request.request_id,
				});
			} else if (screen == 'InvoiceScreen') {
				this.props.navigation.dispatch(
					StackActions.reset({
						index: 0,
						key: null,
						actions: [
							NavigationActions.navigate({
								routeName: screen,
								params: {
									provider: this.props.providerProfile,
									request_id: this.props.request.request_id,
								},
							}),
						],
					})
				);
			} else if (screen == 'PixQrCodeScreen') {
				this.props.navigation.dispatch(
					StackActions.reset({
						index: 0,
						key: null,
						actions: [
							NavigationActions.navigate({
								routeName: screen,
								params: {
									provider: this.props.providerProfile,
									request_id: this.props.request.request_id,
								},
							}),
						],
					})
				);
			} else if (screen == 'InvoiceScreenMoney') {
				navigate(screen, {
					provider: this.props.providerProfile,
					request_id: this.props.request.request_id,
				});
			} else {
				navigate(screen);
			}
		} catch (error) {
      handlerException('ServiceUserBoardScreen.navigateToScreen', error);
		}
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
	 * Check Request Status Received on Socket and update user aplication
	 * if change the screen (resquestInProgress / Main / Invoice) unsubscribe from socket
	 */
	requestStatus() {
		try {
			this.setState({
				isLoading: false,
				loading_message: strings('load.Loading'),
			});

			const request = this.props.request;

			if (request == null) {
				this.setState({
					isLoading: false,
				});

				this.finish();

				return;
			}

			if (request.is_cancelled == 1) {
				this.setState({
					isLoading: false,
				});
				this.playSoundCancellation();
				this.finish();

				return;
			}

			if (request.is_completed == 1) {
				this.finish();

				return;
			}

			if (!request.points && !request.points[0]) {
				this.finish();

				return;
			}

			this.locationPoint(request.is_started);

			this.getStatus(request);

			this.setState({
				titleDes: this.verifyTitleHttp(request.points[0].address),
				time_to_arrive: !request.is_started
					? request.time_to_source
					: request.time_to_destination,
				distance_to_arrive: !request.is_started
					? request.distance_to_source
					: request.distance_to_destination,
			});

			this.verifyWinchRequest(request);
		} catch (error) {
			handlerException('ServiceUserBoardScreen.requestStatus', error);
		}
	}

	getStatus(request) {
		try {
			if (request.is_started == 1) {
				this.setState({
					started: true,
					polyline: request.source_to_destination,
					isLoading: false,
					loading_message: strings('load.Loading'),
					service_text_button:
						request.points[0].action == 'destination'
							? strings(
									'ServiceUserBoardScreen.service_text_button_request_completed'
							  )
							: strings(
									'ServiceUserBoardScreen.service_text_button_next_request_point'
							  ),
				});

				return;
			}

			if (request.is_provider_arrived == 1) {
				this.setState({
					isLoading: false,
					loading_message: strings('load.Loading'),
					service_text_button: strings(
						'ServiceUserBoardScreen.service_text_button_request_started'
					),
				});
				return;
			}

			if (request.is_provider_started == 1) {
				this.setState({
					isLoading: false,
					loading_message: strings('load.Loading'),
					service_text_button: strings(
						'ServiceUserBoardScreen.service_text_button_arrived'
					),
				});
				return;
			}
		} catch (error) {
			handlerException('ServiceUserBoardScreen.getStatus', error);
		}
	}

  /**
  * Opens the Waze app and shows the location based on the latitude and longitude.
  * If the latitude and longitude are not available, it shows the destination latitude and longitude.
  * If the latitude is not available, it shows the title address of the request.
  */
  async openWaze(verifyApp = false) {

        if (verifyApp) {
          const wazeInstalled = await isAppInstalled('waze', { waze: 'waze://' });

          if (!wazeInstalled) {
            return Alert.alert('Ops!', strings('ServiceUserBoardScreen.waze_not_installed'));
          }
        }

    const goingToUsersPlace = verifyApp 
      && this.props.request.is_provider_started == 0 && this.props.request.is_provider_arrived == 0
      || this.props.request.is_provider_started == 1 && this.props.request.is_provider_arrived == 0;

      const latitude = goingToUsersPlace
      ? this.props.request.src_latitude
      : parseFloat(this.props.request.dest_latitude);

    const longitude = goingToUsersPlace
      ? this.props.request.src_longitude
      : parseFloat(this.props.request.dest_longitude);

        showLocation({
          app: 'waze',
          latitude,
          longitude,
          directionsMode: 'car'
        })
      }
    

	verifyWinchRequest(request) {
		try {
			if (this.props.settings.enable_vehicle_information_button) {
				if (
					request.user_vehicle_brand != null &&
					request.user_vehicle_model != null &&
					request.user_vehicle_color != null &&
					request.user_vehicle_number != null
				) {
					if (
						request.user_vehicle_brand.length > 0 ||
						request.user_vehicle_model.length > 0 ||
						request.user_vehicle_color.length > 0 ||
						request.user_vehicle_number.length > 0
					) {
						this.setState({infoVehicleWinch: true});
					}
				}
			}
		} catch (error) {
			handlerException(
				'ServiceUserBoardScreen.verifyWinchRequest',
				error
			);
		}
	}

	finish() {
		this.setState({
			isLoading: true,
		});

		BgLocationClear();

		this.configBgLocation();

		this.unsubscribeSocket();

		this.clearIntervals();

		this.setState({
			isLoading: false,
		});

		this.navigateToScreen('MainScreen');
	}

	clearIntervals() {
		try {
			if (this.intervalUpdateGetRequestDetails) {
					clearInterval(this.intervalUpdateGetRequestDetails);
				}

				if (this.intervalUpdateDistanceAndTimeToArrive) {
					clearInterval(this.intervalUpdateDistanceAndTimeToArrive);
				}
		} catch (error) {
			handlerException('ServiceUserBoardScreen.clearIntervals', error);
		}
	}

	configBgLocation() {
		try {
			configBgLocation(
					this.props.providerProfile._id.toString(),
					this.props.providerProfile._token,
					this.props.settings.update_location_interval,
					this.props.settings.update_location_fast_interval,
					this.props.settings.distance_filter,
					this.props.settings.disable_elasticity,
					this.props.settings.heartbeat_interval,
					this.props.settings.stop_timeout,
					null
				);
		} catch (error) {
			handlerException('ServiceUserBoardScreen.configBgLocation', error);
		}
	}

	locationPoint(started) {
		try {
			let markerPoint = [];
			let titleDes;
			let latitudeDes;
			let longitudeDes;
			if (started == 0) {
				markerPoint.push({
					image: images.user_location,
					id: parseInt(1),
					title: this.props.user.full_name,
					latitude: parseFloat(this.props.user.latitude),
					longitude: parseFloat(this.props.user.longitude),
				});

				titleDes = this.props.request.source;
				latitudeDes = this.props.user.latitude;
				longitudeDes = this.props.user.longitude;
			} else {
				titleDes =
					this.props.request &&
					this.props.request.points &&
					this.props.request.points[0] &&
					this.props.request.points[0].address
						? this.props.request.points[0].address
						: '';
				latitudeDes = parseFloat(this.props.request.dest_latitude);
				longitudeDes = parseFloat(this.props.request.dest_longitude);
			}
			this.setState({
				point: markerPoint,
				titleDes,
				latitudeDes,
				longitudeDes,
			});
		} catch (error) {
			handlerException('ServiceUserBoardScreen.locationPoint', error);
		}
	}

	myLocation() {
		try {
			var markerUser = this.createUserMarker(
				100,
				strings('map_screen.current_location'),
				this.props.latitude,
				this.props.longitude
			);
			this.setState({
				markerUser: markerUser,
			});

			if (this.map != null) {
				this.map.animateToRegion({
          ...this.props.region,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5,
        }, 1500);
			}
		} catch (error) {
			handlerException('ServiceUserBoardScreen.myLocation', error);
		}
	}

	/**
	 * Create Custom marker for User Location.
	 *
	 * @param {number} id
	 * @param {string} title
	 * @param {number} latitude
	 * @param {number} longitude
	 */
	createUserMarker(id, title, latitude, longitude) {
		try {
			let markerUser = [];
			if (latitude !== null || latitude != 'null')
				markerUser.push(
					new Marker(
						parseInt(id),
						title,
						parseFloat(latitude),
						parseFloat(longitude),
						''
					)
				);
			return markerUser;
		} catch (error) {
			handlerException('ServiceUserBoardScreen.createUserMarker', error);
		}
	}

	/**
	 * Subscribe Socket Channel and wait for request update
	 *
	 * @param {Number} request_id | Request ID
	 */
	async subscribeSocket(request_id) {
		try {
			if (constants.socket != null) {
				await constants.socket
					.emit('subscribe', {
						channel: 'request.' + request_id,
					})
					.on('requestUpdate', (channel, data) => {
						/**
						 * Convert Object to Array
						 */

						var socketRequest = data.request;

						if (
							socketRequest.is_started == 0 &&
							this.state.polyline.length == 0
						) {
							this.setState({
								polyline: convertPolyline(
									socketRequest.provider_to_source
								),
							});
						}

						if (details.request.is_completed === 1) {
							parse.showToast(
								strings(
									'ServiceUserBoardScreen.service_finished_by_admin'
								),
								Toast.durations.LONG
							);
							this.prepareToGoToMainScreen();
						} else if (socketRequest.is_cancelled == 1) {
							parse.showToast(
								strings(
									'ServiceUserBoardScreen.service_cancel_user'
								),
								Toast.durations.LONG
							);
							this.playSoundCancellation();
							this.prepareToGoToMainScreen();
						} else {
							let markerPoint = [];
							if (
								this.state.started &&
								this.state.titleDes !=
									socketRequest.dest_address
							) {
								titleDes = socketRequest.dest_address;
								latitudeDes = parseFloat(
									socketRequest.D_latitude
								);
								longitudeDes = parseFloat(
									socketRequest.D_longitude
								);

								this.setState({
									titleDes,
									latitudeDes,
									longitudeDes,
								});
							}
						}
					});
			}
		} catch (error) {
			handlerException('ServiceUserBoardScreen.subscribeSocket', error);
		}
	}

	/**
	 * Function that unsubscribe socket if happen a disconnection and reconect.
	 *
	 * @param {Number} request | Request ID
	 */
	async resubscribeSocket(request) {
		try {
			await this.unsubscribeSocket();
			await this.subscribeSocket(request);
		} catch (error) {
			handlerException('ServiceUserBoardScreen.resubscribeSocket', error);
		}
	}

	/**
	 * Unsubscribe Socket Channel and remove listeners
	 */
	async unsubscribeSocket() {
		try {
			let request = this.props.request?.request_id ? this.props.request.request_id : null;

			if (constants.socket != null) {
				await constants.socket.removeAllListeners('requestUpdate');
				if (request != null && request != null && request != 0) {
					await constants.socket.emit('unsubscribe', {
						channel: 'request.' + request,
					});
				}
			}
		} catch (error) {
      handlerException('ServiceUserBoardScreen.unsubscribeSocket', error);
		}
	}

	/**
	 * JSX para montar o botão de pânico
	 */
	showPanicButton() {
		return (
      <View style={{alignItems: "flex-end"}}>
        <PanicButton
          styles={{position: 'relative', bottom: 0, right: 0, height: 35, width: 35,}}
          requestId={this.props.request.request_id}
          ledgerId={this.state.ledger_id}
          panicButtonUrl={constants.PANIC_BUTTON_URL}
          confirmAlertTitle={strings('panic.confirm_alert_title')}
          confirmAlertMessage={strings('panic.confirm_alert_message')}
          confirmAlertButtonText={strings(
            'panic.confirm_alert_button_text'
          )}
          cancelAlertButtonText={strings(
            'panic.cancel_alert_button_text'
          )}
          successAlertTitle={strings('panic.success_alert_title')}
          successAlertMessage={strings('panic.success_alert_message')}
          successAlertButtonText={strings(
            'panic.success_alert_button_text'
          )}
        />
      </View>
		);
	}

	/**
	 * Alerta antes de enviar mensagem de emergência
	 */
	alertToSendEmergencyContact() {
		if(this.props.emergencyContacts.key === 2 ){
      Alert.alert(
        strings('serviceInProgress.sms_alert_title'),
        strings('serviceInProgress.sms_alert_msg'),
        [
          {
            text: strings('serviceInProgress.sms_alert_cancel'),
            style: 'cancel',
          },
          {
            text: strings('serviceInProgress.sms_alert_ok'),
            onPress: () => this.sendSmsToContacts(),
          },
        ],
        {cancelable: false}
      );
    } else {
      this.sendSmsToContacts()
    }
	}

	/**
	 * Envia mensagem de emergência aos contatos
	 */
	sendSmsToContacts() {
		try {
			this.setState({isLoading: true});

			this.api
				.SendSmsToContacts(
					this.props.providerProfile._id,
					this.props.providerProfile._token,
					this.props.request.request_id
				)
				.then((res) => {
					let response = res.data;

					if (response.success) {
						this.setState({isLoading: false});

						parse.showToast(
							strings('serviceInProgress.sms_success'),
							Toast.durations.SHORT
						);
					} else {
						this.setState({isLoading: false});

						parse.showToast(
							strings('serviceInProgress.sms_fail'),
							Toast.durations.SHORT
						);
					}
				})
				.catch((error) => {
					this.setState({isLoading: false});

					parse.showToast(
						strings('serviceInProgress.sms_fail'),
						Toast.durations.SHORT
					);

          handlerException('ServiceUserBoardScreen.sendSmsToContacts', error);
				});
		} catch (error) {
			handlerException('ServiceUserBoardScreen.sendSmsToContacts');
			this.setState({isLoading: false});
		}
	}

	getRequestDetails() {
		try {
			this.intervalUpdateGetRequestDetails = setInterval(() => {
				this.api.GetProviderRequest(
					this.props.providerProfile._id,
					this.props.providerProfile._token,
					this.props.request?.request_id
				).then((response) => {
					const details = response.data;

					//se nn tem details manda para main screen
					if (!details) {
						return this.prepareToGoToMainScreen();
					}

					//se tem details mas não tem request, manda para main screen
					if (!details.request) {
						return this.prepareToGoToMainScreen();
					}

					//se tem details e request, atualiza a request no redux
					this.props.onRequestUpdated(details);

					//verifica se existe o campo is_completed pois alguns paineis podem não retornar ele
					if (details.request.is_completed && details.request.is_completed === 1) {
						parse.showToast(
							strings(
								'ServiceUserBoardScreen.service_finished_by_admin'
							),
							Toast.durations.LONG
						);
						return this.prepareToGoToMainScreen();
					}

					if (details.request.is_cancelled === 1) {
						parse.showToast(
							strings(
								'ServiceUserBoardScreen.service_cancel_user'
							),
							Toast.durations.LONG
						);
						this.playSoundCancellation();
						return this.prepareToGoToMainScreen();
					}

					this.setState({
						time_to_arrive: !details.request.is_started
							? details.request.time_to_source
							: details.request.time_to_destination,
						distance_to_arrive: !details.request.is_started
							? details.request.distance_to_source
							: details.request.distance_to_destination,
						polyline: this.state.polyline.length == 0
							? details.request.provider_to_source
							: this.state.polyline
					});

				}).catch((erro) => {
					handlerException('Erro getRequestDetails', erro);
				});
			}, constants.REQUEST_DETAILS_UPDATE_TIME);
		} catch (error) {
			handlerException('ServiceUserBoardScreen.getRequestDetails', error);
		}
	}

	onRightSlide() {
		try {
			this.setState({
				isLoading: true,
			});

			var request = this.props.request;

			if (request.is_provider_started == 0) {
				this.requestProviderStarted();
			} else if (request.is_provider_arrived == 0) {
				this.requestProviderArrived();
			} else if (request.is_started == 0) {
				this.requestStarted();
			} else if (request.is_completed == 0) {
				this.handlePoints();
			}
		} catch (e) {
			handlerException('ServiceUserBoardScreen.onRightSlide', e);
			this.setState({
				isLoading: false,
			});
		}
	}

	/**
	 * Change the service status, informing that the provider has started going to users location.
	 */
  requestProviderStarted() {
    try {
      if (this.props.providerProfile && this.props.providerProfile._id) {
        this.api.ProviderStarted(
            this.props.providerProfile._id,
            this.props.providerProfile._token,
            this.props.request.request_id,
            this.props.latitude,
            this.props.longitude
          ).then((response) => {
            var responseJson = response.data;
            
            if (this.props.request) {
              this.props.request.is_provider_started = 1;
            }

            if (parse.isSuccess(responseJson,this.returnConstNavigate())) {

              if (responseJson.request.is_cancelled == 0) {
                this.setState({
                  service_text_button: strings('ServiceUserBoardScreen.service_text_button_arrived'), 
                  isLoading: false,
                });

                this.openWaze();
              } else {
                this.setState({ isLoading: false, });
                parse.showToast(
                  strings(
                    'ServiceUserBoardScreen.service_cancel_user'
                  ),
                  Toast.durations.LONG
                );
                this.playSoundCancellation();
                this.prepareToGoToMainScreen();
              }
            } else {
              this.setState({ isLoading: false, });

              if (responseJson.error_code == 406) {
                this.doLogout();
              } else {
                this.prepareToGoToMainScreen();
              }
            }
          })
          .catch((error) => {
            this.setState({ isLoading: false });
            parse.showToast(
              strings('error.try_again'),
              Toast.durations.LONG
            );
            handlerException('ProviderStarted ', error);
          });
      } else {
        this.setState({ isLoading: false, });
      }
    } catch (error) {
      handlerException('ServiceUserBoardScreen.ProviderStarted ', error);

      this.setState({ isLoading: false, });
    }
  }

	/**
	 * Change the service status, informing that the provider has arrived to users location.
	 */
	requestProviderArrived() {
		this.setState({
			arrived: true,
		});

		this.api
			.ProviderArrived(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				this.props.request.request_id,
				this.props.latitude,
				this.props.longitude
			)
			.then((response) => {
				var responseJson = response.data;

				if (parse.isSuccess(responseJson, this.returnConstNavigate())) {
					if (responseJson.request.is_cancelled == 0) {
						if (this.props.request) {
							this.props.request.is_provider_arrived = 1;
						}

						this.setState({
							service_text_button: strings(
								'ServiceUserBoardScreen.service_text_button_request_started'
							),
							isLoading: false,
						});
					} else {
						this.setState({
							isLoading: false,
						});
						parse.showToast(
							strings(
								'ServiceUserBoardScreen.service_cancel_user'
							),
							Toast.durations.LONG
						);
						this.playSoundCancellation();
						this.prepareToGoToMainScreen();
					}
				} else {
					this.setState({
						isLoading: false,
					});

					if (responseJson.error_code == 406) {
						this.doLogout();
					} else {
						this.prepareToGoToMainScreen();
					}
				}
			})
			.catch((error) => {
				this.setState({isLoading: false});
				parse.showToast(
					strings('error.try_again'),
					Toast.durations.LONG
				);
				handlerException('ProviderArrived ', error);
			});
	}

	/**
	 * Change the service status, informing that the request has started.
	 */
	requestStarted() {
		this.destroyStorageLocations();

		this.setState({
			arrived: false,
		});

		this.api
			.RequestStarted(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				this.props.request.request_id,
				this.props.latitude,
				this.props.longitude
			)
			.then((response) => {
				var responseJson = response.data;

				if (parse.isSuccess(responseJson, this.returnConstNavigate())) {
					if (responseJson.request.is_cancelled == 0) {
						this.api
							.GetProviderRequest(
								this.props.providerProfile._id,
								this.props.providerProfile._token,
								this.props.request.request_id
							)
							.then((response) => {
								const details = response.data;
								this.props.onRequestUpdated(details);
                
                this.openWaze();

								this.setState({
									started: true,
									polyline:
										details.request.source_to_destination,
									service_text_button:
										details.request.points &&
										details.request.points[0] &&
										details.request.points[0].action ==
											'destination'
											? strings(
													'ServiceUserBoardScreen.service_text_button_request_completed'
											  )
											: strings(
													'ServiceUserBoardScreen.service_text_button_next_request_point'
											  ),
									isLoading: false,
									time_to_arrive: !details.request.is_started
										? details.request.time_to_source
										: details.request.time_to_destination,
									distance_to_arrive: !details.request
										.is_started
										? details.request.distance_to_source
										: details.request
												.distance_to_destination,
								});
								this.locationPoint(1);
							})
							.catch((erro) => {
                handlerException('ServiceUserBoardScreen.requestStarted', error);
								this.setState({
									isLoading: false,
								});
							});
					} else {
						this.setState({
							isLoading: false,
						});
						parse.showToast(
							strings(
								'ServiceUserBoardScreen.service_cancel_user'
							),
							Toast.durations.LONG
						);
						this.playSoundCancellation();
						this.prepareToGoToMainScreen();
					}
				} else {
					this.setState({
						isLoading: false,
					});

					if (responseJson.error_code == 406) {
						this.doLogout();
					} else {
						this.prepareToGoToMainScreen();
					}
				}
			})
			.catch((error) => {
				this.setState({isLoading: false});
				parse.showToast(
					strings('error.try_again'),
					Toast.durations.LONG
				);
			});
	}

	/**
	 * Destroy pending locations
	 *
	 * @return {void}
	 */
	destroyStorageLocations() {
		try {
			BackgroundGeolocation.destroyLocations();
		} catch (error) {
			handlerException(
				'ServiceUserBoardScreen.destroyStorageLocations',
				error
			);
		}
	}

	/**
	 * Init finish request checking pending locations
	 */
	async finishRequest() {
		try {
			this.clearInterval();

			this.setState({loading_message: strings('load.finishing')});

			const pendingLocations = await BackgroundGeolocation.getLocations();

			this.destroyStorageLocations();

      if(this.props.settings?.is_driver_rate_enabled) {
        this.setState({ modal: { ...this.state.modal, show: true, pendingLocations}})
      }else {
        this.requestCompleted(pendingLocations);
      }
		} catch (error) {
			handlerException('ServiceUserBoardScreen.finishRequest', error);
			this.destroyStorageLocations();
			this.requestCompleted([]);
		}
	}

	clearInterval() {
		try {
			if (this.intervalUpdateGetRequestDetails) {
				clearInterval(this.intervalUpdateGetRequestDetails);
			}

			if (this.intervalUpdateDistanceAndTimeToArrive) {
				clearInterval(this.intervalUpdateDistanceAndTimeToArrive);
			}
		} catch (error) {
			handlerException('ServiceUserBoardScreen.clearInterval', error);
		}
	}

	/**
	 * Change the service status, informing that the request has been completed.
	 */
	async requestCompleted(pendingLocations) {
		try {
			const responseComplete = await this.api.CompletedRoute(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				this.props.request.request_id,
				this.props.latitude,
				this.props.longitude,
				pendingLocations,
        this.state.modal.value,
			);
			let responseJson = responseComplete.data;

			if (parse.isSuccess(responseJson, this.returnConstNavigate())) {
				this.props.onSetBill(responseJson.bill);
				this.setState({
					isLoading: false,
				});
				var payMode = responseJson.bill.payment_mode;

				RNProviderBubble.finishRequest();

				if (payMode && parseInt(payMode) == 9) {
					this.navigateToScreen('PixQrCodeScreen');
				} else {
					this.navigateToScreen('InvoiceScreen');
				}
			} else {
				this.setState({
					isLoading: false,
					loading_message: strings('load.Loading'),
				});

				if (responseJson.error_code == 406) {
					this.doLogout();
				}
			}
		} catch (error) {
			this.setState({
				isLoading: false,
				loading_message: strings('load.Loading'),
			});

			parse.showToast(strings('error.try_again'), Toast.durations.LONG);
			handlerException('ServiceUserBoardScreen.requestCompleted ', error);
		}
	}

	handleShare = () => {
		try {
			if (Platform.OS == constants.ANDROID) {
				Share.share(
					{
						message: `${strings('requests.content_share')}:
						${WBASE_URL}/tracking?request_id=${
							this.props.request.request_id
						}&provider_token=${this.props.providerProfile._token}`,
						title: `${WPROJECT_NAME}`,
					},
					{
						dialogTitle: strings('requests.share'),
					}
				);
			} else if (Platform.OS == constants.IOS) {
				Share.share(
					{
						message: `${strings('requests.content_share')}:
						${WBASE_URL}/tracking?request_id=${
							this.props.request.request_id
						}&provider_token=${this.props.providerProfile._token}`,
						title: `${WPROJECT_NAME}`,
					},
					{
						excludedActivityTypes: [
							'com.apple.UIKit.activity.PostToTwitter',
						],
					}
				);
			}
		} catch (error) {
			handlerException('ServiceUserBoardScreen.handleShare', error);
		}
	};

	/**
	 * it's for animate view in App
	 * @param {*} event
	 */
	onHandlerStateChanged(event) {
		try {
			if (event.nativeEvent.oldState === State.ACTIVE) {
				let opened = false;

				const {translationY} = event.nativeEvent;

				constants.OFFSET += translationY;

				if (translationY <= -15) {
					opened = true;
				} else {
					this.translateY.setValue(constants.OFFSET);
					this.translateY.setOffset(0);

					constants.OFFSET = 0;
				}

				Animated.timing(this.translateY, {
					toValue: opened ? viewHeight : 0,
					duration: 300,
					useNativeDriver: true,
				}).start(() => {
					constants.OFFSET = opened ? viewHeight : 0;

					this.translateY.setOffset(constants.OFFSET);

					this.translateY.setValue(0);
				});
			}
		} catch (error) {
			handlerException(
				'ServiceUserBoardScreen.onHandlerStateChanged',
				error
			);
		}
	}

	/**
	 * Show full address text
	 *
	 * @param {object} request
	 * @return {string}
	 */
	showTitleAddress(request) {
		try {
			if (request.is_started == 1)
				return this.props.request &&
					this.props.request.points &&
					this.props.request.points[0] &&
					this.props.request.points[0].address
					? this.props.request.points[0].address
					: '';

			return this.props.request.source;
		} catch (error) {
      handlerException('ServiceUserBoardScreen.showTitleAddress', error);
			return '';
		}
	}

	/**
	 * Pt-BR
	 * Função para formatar o endereço para ex.: 233 - Rua.
	 * @param {object} request
	 */
	showAddress(request) {
		try {
			let address = this.props.request.source;

			if (request.is_started == 1)
				address =
					this.props.request &&
					this.props.request.points &&
					this.props.request.points[0] &&
					this.props.request.points[0].address
						? this.props.request.points[0].address
						: '';

			if (!address) return '';

			var formated = address.split(',');

			if (formated[1] == undefined) return address;

			var num = formated[1].split('-');

			return num[0] + '- ' + formated[0];
		} catch (error) {
			handlerException('ServiceUserBoardScreen.showAddress', error);
		}
	}

	/**
	 * Play the sound request cancellation
	 */
	playSoundCancellation() {
		try {
			Vibration.vibrate();
			Sound.setCategory('Playback');

			let sound = new Sound(
				this.props.audioCancellation && this.props.audioCancellation,
				null,
				(error) => {
					if (error) {
						sound = new Sound(
							'cancellationbeep.mp3',
							Sound.MAIN_BUNDLE,
							(error) => {
								if (error) {
								} else {
									sound.play((success) => {});
								}
							}
						);
					} else {
						sound.play(() => {});
					}
				}
			);

			sound.setVolume(1.0);
			sound.release();
		} catch (e) {
			handlerException('ServiceUserBoardScreen.playSoundCancellation', e);
		}
	}

	/**
	 * Verifica se o prestador já passou por todos os pontos de parada.
	 */
	handlePoints() {
		try {
			if (
				!this.props.providerProfile &&
				!this.props.providerProfile._id
			) {
				return false;
			}

			if (
				!this.props.request &&
				!this.props.request.points &&
				!this.props.request.points[0]
			) {
				return false;
			}

			if (this.props.request.points[0].action == 'destination') {
				this.finishRequest();
			} else {
				this.HandleRequestPoints();
			}
		} catch (e) {
			handlerException('ServiceUserBoardScreen.handlePoints', e);
		}
	}

	HandleRequestPoints() {
		this.api
			.HandleRequestPoints(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				this.props.request.request_id,
				this.props.request.points[0].id
			)
			.then((response) => {
				this.setState({
					isLoading: false,
				});

				let result = response.data;

				if (result.success) {
					this.props.onRequestUpdated(result);

					this.setState({
						isLoading: false,
						service_text_button:
							this.props.request.points &&
							this.props.request.points[0].action == 'destination'
								? strings(
										'ServiceUserBoardScreen.service_text_button_request_completed'
								  )
								: strings(
										'ServiceUserBoardScreen.service_text_button_next_request_point'
								  ),
					});
				}
			})
			.catch((error) => {
				handlerException(
					'ServiceUserBoardScreen.HandleRequestPoints',
					error
				);
				this.setState({isLoading: false});
			});
	}

  waitingUserRepondRide = () => {
    return (
      <View>
        <ActionButton
          activeLoader={true}
          text={"Aguardando confirmação do usuário"}
          style={{ opacity: 0.5 }}
        />
      </View>
    );
  }

  renderActionButton = () => {
    return (
      <View style={{ elevation: 10, position: 'relative' }}>
        {
          this.props.request
            && !this.props.request.is_provider_released
            ? this.waitingUserRepondRide()
            : <ActionButton
              text={this.state.service_text_button}
              onPressSync={this.onRightSlide.bind(this)}
            />
        }
      </View>
    );
  };

	updateWaitingRideField() {
		try {
			this.api
				.updateWaitingRideField(
					this.props.providerProfile._id,
					this.props.providerProfile._token,
					!Boolean(this.state.waiting_ride)
				)
				.then((response) => {
					const data = response.data;

					if (!data.success) {
						parse.showToast(strings('error.try_again'));
					} else {
						this.setState({
							waiting_ride: Boolean(data.waiting_ride),
						});

						if (data.waiting_ride == true) {
							parse.showToast(
								strings('ServiceUserBoardScreen.waiting_ride')
							);
						} else {
							parse.showToast(
								strings(
									'ServiceUserBoardScreen.waiting_ride_no'
								)
							);
						}
					}
				});
		} catch (error) {
			handlerException(
				'ServiceUserBoardScreen.updateWaitingRideField',
				error
			);
		}
	}

	getDestinationAddress(points) {
		if(points instanceof Array) {
			const pointDestination = points.filter(
				point => point.action =='destination');
			if(pointDestination && pointDestination.length > 0
				&& pointDestination[0]) {
				return pointDestination[0].address;
			}
		}

		return '';
	}

	async handleUpdateDelta(value) {
    await this.props.changeCoordinatesProvider(
      {...this.props.region,
        latitudeDelta: value.latitudeDelta,
        longitudeDelta: value.longitudeDelta
      },
      this.props.latitude,
      this.props.longitude,
      )
  }

  /**
   * TODO
   * nao foi testado com pontos de partida
    showLocation({
      app:'waze',
      directionsMode: 'car',
      latitude:
        this.props.request.points && this.state.started
          ? this.props.request.points[0]?.latitude
          : this.state.latitudeDes,
      longitude:
        this.props.request.points && this.state.started
          ? this.props.request.points[0]?.longitude
          : this.state.longitudeDes,
      googleForceLatLon: true,
    })
  }*/

	render() {
		const animatedEvent = Animated.event(
			[
				{
					nativeEvent: {
						translationY: this.translateY,
					},
				},
			],
			{useNativeDriver: true}
		);

		return this.props.request ? (
			<>
				<StatusBar backgroundColor="#FFF" barStyle="dark-content" />
				<SafeAreaView style={styles.parentContainer}>

          <Modal
            noCloseModal
            showModal={this.state.modal.show}
            setShowModal={(value) => this.setState({ modal: { ...this.state.modal, show: value }})}
            title={strings('manage_rating.want_rated')}
            onFinished={() => this.requestCompleted(this.state.modal.pendingLocations)}
            buttonOk={{
              title: strings('general.yes_tinny'),
              onPress: () => {
                this.setState({ modal: { ...this.state.modal, value: true}})
              }
            }}
            buttonCancel={{
              title: strings('general.no_tinny'),
              onPress: () => this.setState({ modal: { ...this.state.modal, value: false}})
            }}
          />
					{/* <Loader loading={this.state.isLoading} message={this.state.loading_message} /> */}
					{!this.state.isLoading ? (
						<MapView
							customMapStyle={styledMap}
							inititalRegion={this.state.region}
							region={this.state.region}
							style={styles.map}
							showsUserLocation={false}
							followUserLocation={true}
							zoomEnabled={true}
							ref={(map) => (this.map = map)}
							showsCompass={true}
							pitchEnabled={true}
							showsMyLocationButton={true}
							onMapReady={() => this.regionAnimated()}
              onRegionChange={e => this.handleUpdateDelta(e)}
              >
							{this.state.markerUser &&
								this.state.markerUser.map((marker) => (
									<RNMMarker
										image={images.my_loc_enable}
										key={marker._id}
										title={marker._title}
										anchor={{x: 0.5, y: 0.5}}
										coordinate={{
											latitude: parseFloat(
												marker._latitude
											),
											longitude: parseFloat(
												marker._longitude
											),
										}}
									/>
								))}

							{/* Paradas */}
							{this.props.request.points &&
								this.props.request.points.map((point) => {
									return (
										<RNMMarker
											image={images.location_point}
											key={point.id}
											title={point.address}
											coordinate={{
												latitude: point.latitude,
												longitude: point.longitude,
											}}
										/>
									);
								})}

							{this.state.polyline.length > 0 ? (
								<Polyline
									coordinates={this.state.polyline}
									strokeWidth={5}
									strokeColor="#4B74FF"
								/>
							) : null}
							{this.state.point.map((marker) => (
								<RNMMarker
									image={marker.image}
									key={marker.id}
									title={marker.title}
									anchor={{x: 0.5, y: 0.5}}
									coordinate={{
										latitude: parseFloat(marker.latitude),
										longitude: parseFloat(marker.longitude),
									}}
								/>
							))}
						</MapView>
					) : (
						<Loader
							loading={this.state.isLoading}
							message={this.state.loading_message}
						/>
					)}
					<View style={{padding: 15, flex: 1}}>
						<View style={styles.infomap}>
							<View style={styles.direction}>
								<Text style={styles.locationCurrent}>
									{this.props.request &&
										this.showTitleAddress(
											this.props.request
										)}
								</Text>
								<View style={styles.line} />

								<Text style={styles.locationArrival}>
									{strings(
										'ServiceUserBoardScreen.description'
									)}
								</Text>

								<Text style={styles.locationArrived}>
									{this.props.request
										? this.showAddress(this.props.request)
										: null}
								</Text>
							</View>
						</View>
						<View
							style={{
								right: 10,
								bottom: !this.state.infoVehicleWinch
									? 130
									: 210,
								position: 'absolute',
							}}>
							<View>
                {this.state.panic_button_enabled_provider && this.showPanicButton()}

								{this.props.settings.allow_waiting_ride && (
									<TouchableOpacity
										activeOpacity={0.7}
										style={styles.waitingRideIcon}
										onPress={() =>
											this.updateWaitingRideField()
										}>
                      <Icon
                        name="directions-car"
                        size={25}
                        color={this.state.waiting_ride ? "#FFF" : "#000"}
                      />
									</TouchableOpacity>
								)}

								<TouchableOpacity
									activeOpacity={0.7}
									style={styles.mapButton}
									onPress={() => this.myLocation()}>
									<Icon
										name="gps-fixed"
										size={25}
										color="#000"
									/>
								</TouchableOpacity>

								{this.state.is_tracking_enabled && (
									<TouchableOpacity
										onPress={this.handleShare}
										activeOpacity={0.6}
										style={styles.circleShare}>
										<Icon
											name="share"
											size={25}
											color="#000"
										/>
									</TouchableOpacity>
								)}

                {this.props.emergencyContacts.key !== 3 &&
                  <TouchableOpacity
                    style={styles.circleShare}
                    onPress={() => {
                      this.alertToSendEmergencyContact();
                    }}>
                    <Image
                      source={shield}
                      style={{width: 22, height: 27, resizeMode: 'center'}}
                    />
                  </TouchableOpacity>
                }

                <TouchableHighlight
                  onPress={() => this.openWaze(true)}
                  style={styles.navigationOnPress}>
                  <View style={styles.navigation}>
                    <Icon
                      name="navigation"
                      size={15}
                      color="#FFF"
                    />
                    <Text style={{color: '#FFF'}}>
                      {strings(
                        'ServiceUserBoardScreen.navigation'
                        )}
                    </Text>
                  </View>
                </TouchableHighlight>

                <BalanceButton
                  ref={this._balance}
                  url={constants.FINANCE_GET_BALANCE}
                  show={this.props.settings?.show_provider_balance}
                  locale={currentLocale}
                  lang={currentLanguage}
                  navigation={() => this.props.navigation.navigate('AddBalanceScreenLib')}
                  data={{
                    type: constants.TYPE_PROVIDER,
                    id: this.props.providerProfile._id,
                    token: this.props.providerProfile._token,
                  }}
                  style={{ backgroundColor: PrimaryButton, marginTop: 8}}
                />
							</View>
						</View>
					</View>

					{this.props.waiting_request && (
						<View
            style={{
              left: 0,
              bottom: 195,
              position: 'absolute',
            }}>
							<TouchableHighlight
								onPress={() =>
									this.props.navigation.navigate(
										'WaitingRideModalScreen'
									)
								}
								style={styles.waitingOnPress}>
								<View style={styles.navigation}>
									<Icon
										name="navigation"
										size={15}
										color="#FFF"
									/>
									<Text style={{color: '#FFF'}}>
										{strings('requests.in_waiting')}
									</Text>
								</View>
							</TouchableHighlight>
						</View>
					)}
					<PanGestureHandler
						onGestureEvent={animatedEvent}
						onHandlerStateChange={this.onHandlerStateChanged.bind(
							this
						)}>
						<RouteInfoView
							type={this.state.infoVehicleWinch}
							style={{
								bottom: this.state.infoVehicleWinch
									? -246
									: -300,
								transform: [
									{
										translateY: this.translateY.interpolate(
											{
												inputRange: [-300, -0, 1],
												outputRange: [-300, -0, 1],
												extrapolate: 'clamp',
											}
										),
									},
								],
							}}>
							<View style={styles.inforCard}>
								<View style={styles.toggle} />

								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-evenly',
										alignItems: 'center',
									}}>
									{!this.state.started &&
									this.props.settings
										.is_phone_in_request_enabled !==
										undefined &&
									this.props.settings
										.is_phone_in_request_enabled ? (
										<TouchableOpacity
											style={styles.iconCallUser}
											onPress={() => this.callUser()}
											activeOpacity={0.6}>
											<Icon
												name="call"
												size={25}
												color={'#000'}
											/>
										</TouchableOpacity>
									) : null}
									<View style={styles.infoUser}>
										<View style={styles.textIcon}>
											<Text style={styles.text}>
												{this.state.time_to_arrive}
											</Text>
											<Image
												source={{
													uri: this.props.user
														? this.props.user
																.picture
														: null,
												}}
												style={styles.avatar}
											/>
											<Text style={styles.text}>
												{this.state.distance_to_arrive}
											</Text>
										</View>
									</View>
									{!this.state.started &&
									this.state.is_chat_enabled === '1' &&
									this.props.request !== null ? (
										<RideChat
											id={this.props.providerProfile._id}
											token={
												this.props.providerProfile
													._token
											}
											request_id={
												this.props.request.request_id
											}
											url={constants.BASE_URL}
											socket_url={constants.SOCKET_URL}
											color="#687a95"
											audio={this.props.audioChatProvider}
											baseUrl={WBASE_URL}
											projectName={WPROJECT_NAME}
											appType="provider"
										/>
									) : null}
								</View>

								<View style={styles.contUserInfo}>
									<Text style={styles.textBoarding}>
										{!this.state.started
											? strings(
													'ServiceUserBoardScreen.boarding'
											  )
											: ''}
									</Text>
									<Text
										numberOfLines={1}
										style={{
											color: '#333',
											fontWeight: !this.state.started
												? 'normal'
												: 'bold',
										}}>
										{this.props.user
											? this.props.user.full_name
											: null}
									</Text>
								</View>

								{this.state.infoVehicleWinch &&
								this.props.request ? (
									<View style={{alignItems: 'center'}}>
										<Text
											style={{
												marginVertical: 10,
												fontSize: 12,
											}}>
											{strings(
												'ServiceUserBoardScreen.infocard'
											)}
										</Text>
										<View
											style={{
												flexDirection: this.state
													.infoVehicleWinch
													? 'column'
													: 'row',
												justifyContent: 'space-between',
											}}>
											<View
												style={{
													flexDirection: 'row',
													alignSelf: 'center',
												}}>
												<Text
													numberOfLines={2}
													style={{
														fontWeight: 'bold',
														fontSize: 15,
													}}>
													{
														this.props.request
															.user_vehicle_brand
													}{' '}
													-{' '}
												</Text>
												<Text
													numberOfLines={2}
													style={{
														fontWeight: 'bold',
														fontSize: 15,
													}}>
													{
														this.props.request
															.user_vehicle_number
													}
												</Text>
											</View>
											<View
												style={{
													flexDirection: 'row',
													marginTop: 3,
													alignSelf: 'center',
												}}>
												<Text
													numberOfLines={2}
													style={{
														fontWeight: 'bold',
														fontSize: 15,
													}}>
													{
														this.props.request
															.user_vehicle_model
													}{' '}
													-{' '}
												</Text>
												<Text
													numberOfLines={2}
													style={{
														fontWeight: 'bold',
														fontSize: 15,
													}}>
													{
														this.props.request
															.user_vehicle_color
													}
												</Text>
											</View>
										</View>
									</View>
								) : null}

								<View
									style={{
										marginTop: this.state.infoVehicleWinch
											? 60
											: 75,
										width: '70%',
									}}>
									{this.props.settings
										.show_destination_to_provider_accept_request ? (
										<View style={styles.areaInfo}>
											<Text style={styles.textDes}>
												{strings(
													'ServiceUserBoardScreen.dest'
												)}
												:{' '}
											</Text>
											<Text
												numberOfLines={3}
												style={styles.textValue}>
												{this.props.request &&
												this.props.request.points
													? this.getDestinationAddress(this.props.request
															.points)
													: ''}
											</Text>
										</View>
									) : null}
									<View style={styles.line2} />
									<View style={styles.areaInfo}>
										<Text style={styles.textDes}>
											{`${strings(
												'ServiceUserBoardScreen.pasage'
											)}: `}
										</Text>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												width: '50%',
											}}>
											<Text
												style={styles.textValuePasage}>
												{this.props.user.full_name}
											</Text>
											<View
												style={{flexDirection: 'row'}}>
												<Text style={styles.textRating}>
													{parseFloat(
														this.props.user.rating
													).toFixed(1)}
												</Text>

												<Icon
													name="star"
													size={18}
													color={'#000'}
													style={{marginLeft: 5}}
												/>
											</View>
										</View>
									</View>
									{this.state
										.show_payment_type_to_called_provider &&
									this.props.request ? (
										<View style={[styles.areaInfo]}>
											<Payment
												id={
													this.props.request
														.payment_mode
												}
												qrCode={null}
												payment_nomenclatures={
													this.props
														.payment_nomenclatures
												}
											/>
										</View>
									) : null}
								</View>

								<View
									style={{
										bottom: this.state.infoVehicleWinch
											? -10
											: -30,
										position: 'relative',
										flexDirection: 'row',
										justifyContent: 'center',
									}}>
									<TouchableOpacity
										onPress={() =>
											this.cancelRequestAlert()
										}
										activeOpacity={0.6}>
										<Text
											style={{
												color: '#FF0000',
												fontSize: 17,
												fontWeight: 'bold',
											}}>
											{strings(
												'ServiceUserBoardScreen.cancel'
											)}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</RouteInfoView>
					</PanGestureHandler>
					{this.renderActionButton()}
				</SafeAreaView>
			</>
		) : null;
	}
}

const mapStateToProps = (state) => {
	const {audio, audioCancellation, audioChatProvider} = state.settingsReducer;
	const {settings, payment_nomenclatures} = state.settingsReducer;
	const {providerProfile} = state.providerProfile;
	const {request, user, waiting_request, waiting_user} = state.request;
	const {region, latitude, longitude} = state.CoordinatesProviderReducer;
  const { emergencyContacts } = state.EmergencyContactsReducer

	return {
		settings,
		audio,
		audioCancellation,
		audioChatProvider,
		providerProfile,
		request,
		user,
		region,
		latitude,
		longitude,
		payment_nomenclatures,
		waiting_request,
		waiting_user,
    emergencyContacts,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onRequestUpdated: (request) => dispatch(requestUpdated(request)),
		onRequestCompleted: (request) => dispatch(requestFinish(request)),
		changeLedger: (value) => dispatch(changeLedger(value)),
		onRequestClear: () => dispatch(requestClear()),
		onSetBill: (bill) => dispatch(setBill(bill)),
    changeCoordinatesProvider: (region, latitude, longitude) => dispatch(changeCoordinatesProvider(region, latitude, longitude))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ServiceUserBoardScreen);
