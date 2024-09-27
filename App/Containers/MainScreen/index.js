// Modules
import React, {Component} from 'react';
import {
	Alert,
	DeviceEventEmitter,
	Text,
	View,
	TouchableOpacity,
	Image,
	BackHandler,
	Platform,
	StatusBar,
	NativeEventEmitter,
	NativeModules,
	Linking,
	LogBox,
} from 'react-native';
import _ from 'lodash';
import Banner from 'react-native-banner';
import Drawer from 'react-native-drawer';
import Toast from 'react-native-root-toast';
import KeepAwake from 'react-native-keep-awake';
import Entypo from 'react-native-vector-icons/Entypo';
import VersionNumber from 'react-native-version-number';
import RNProviderBubble from 'react-native-provider-bubble';
import Geolocation from '@react-native-community/geolocation';
import BalanceButton from 'react-native-finance/src/BalanceButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BackgroundGeolocation from 'react-native-background-geolocation';
import MapView, {Heatmap,Marker as RNMMarker} from 'react-native-maps';
import {connect} from 'react-redux';
import {GeolocationService} from 'react-native-geolocation';
import {NavigationActions, StackActions} from 'react-navigation';
import {checkVersion, showAlert} from 'react-native-version-check';

// Components
import Menu from '../../Components/Menu';
import SurgeMarker from '../../Components/SurgeMarker';

// Locales
import i18n, {currentLanguage, currentLocale, strings} from '../../Locales/i18n';

//Models
import Marker from '../../Models/Marker';

// Services
import ProviderApi from '../../Services/Api/ProviderApi';
import {handlerException} from '../../Services/Exception';
import {
	configBgLocation,
	BgLocationStart,
	BgLocationClear,
	getEnabled,
} from '../../Services/configBgLocation';

// Stores
import {changeProviderData} from '../../Store/actions/actionProvider';
import {providerAction, setAvailable} from '../../Store/actions/providerProfile';
import {
	requestUpdated,
	requestClear,
	waitingRequestClear,
	setReceiveNotice,
} from '../../Store/actions/request';

// Themes
import images from '../../Themes/WhiteLabelTheme/Images';
import {
	PrimaryButton,
	PrimaryIcon,
	projectColors,
	WPROJECT_NAME,
	WPACKAGE_NAME,
} from '../../Themes/WhiteLabelTheme/WhiteLabel';

// Utils
import * as parse from '../../Util/Parse';
import * as constants from '../../Util/Constants';

// Styles
import styles from './styles';
import DefaultHeader from '../../Components/DefaultHeader';
import Button from '../../Components/RoundedButton';
import GLOBAL from 'react-native-finance/src/Functions/Global';

LogBox.ignoreAllLogs(true);

class MainScreen extends Component {
	static navigationOptions = {
		headerLeft: null,
		gesturesEnabled: false,
	};

	constructor(props) {
		super(props);

		this.provider;
		this.apiProvider = new ProviderApi();
    this._balance = React.createRef();

		this.didFocus = this.props.navigation.addListener('didFocus', () => {
			this.bgLocationRegion();

			constants.currentScreen = 'MainScreen';
			constants.serviceRequestScreen = false;
			constants.hasService = false;

			this.onRequestClear();

			this.backHandler = BackHandler.addEventListener(
				'hardwareBackPress',
				() => {
					if (this.state.menu == true) {
						this.toogleMenu();
					}

					Alert.alert(
						strings('map_screen.exit_app'),
						strings('map_screen.exit_app_msg'),
						[
							{
								text: strings('general.no_tinny'),
								onPress: () => function () {},
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
		});

		this.willFocus = this.props.navigation.addListener('willFocus', () => {
			if (this.state.menu == true) {
				this.closeDrawer();
			}

			this.props.onRequestClear();

			if (!this.props.request && this.props.waiting_request) {
				this.checkRequestInProgress(this.props.providerProfile);
				this.props.onWaitingRequestClear();
			}

			this.checkRequestInProgress(this.props.providerProfile);
      this.refreshProviderStatusNow()

      this._balance.current.loadBalance()
		});

		this.willBlur = this.props.navigation.addListener('willBlur', () => {
			if (this.backHandler) {
				this.backHandler.remove();
			}

			clearInterval(constants.requestTimeAfterRequestStart);
		});

		this.state = {
			region: null,
			lastLat: null,
			lastLong: null,
			current_address: '',
			markerUser: [],
			menu: false,
			isLoading: true,

			is_available: false,

			request: [],
			my_location_icon: images.my_loc_disabled,
			acceptance: '0.00%',
			evaluation: '0.00',
			cancellation: '0.00%',
			loading_message: strings('load.Loading'),
			heatmapData: [],
			heatmapLabel: [],
			hasHeatmapData: false,
		};
	}

	refreshProviderStatusNow() {
		const {providerProfile} = this.props;

		this.finishBubble();

		if (providerProfile?._id && providerProfile?._token) {
			// First execution
			this.showOverOtherAppsAlert();

			this.setupProviderContext(providerProfile);

			this.checkingAvailability(false);
		}
	}

	setupProviderContext(providerProfile) {
		try {
			RNProviderBubble.setupProviderContext(
				String(providerProfile._id),
				providerProfile._token,
				providerProfile._is_active
					? String(providerProfile._is_active)
					: '1',
				constants.REDIS_URL,
				constants.BASE_URL + constants.UPDATE_PROVIDER_STATE,
				constants.BASE_URL + constants.GET_PROVIDER_ACTIVE,
				this.props.settings.ping_timer
					? String(this.props.settings.ping_timer)
					: '15',
				constants.BASE_URL + constants.REQUEST_RECEIVED,
				this.props.settings.is_check_time_enabled
					? this.props.settings.is_check_time_enabled
					: false,
				this.props.settings.is_synchronous_ack_enabled
					? this.props.settings.is_synchronous_ack_enabled
					: false
			);
		} catch (e) {
			handlerException('MainScreen.setupProviderContext', e);
		}
	}

	finishBubble() {
		try {
			RNProviderBubble.finishRequest();
		} catch (error) {
			handlerException('MainScreen.finishRequest', error);
		}
	}

	/**
	 * Checking if the provider is available and if it's active
	 * on response we set them and refresh the var status,
	 * then call the refreshProviderProfile
	 * @param {ProviderModel} provider (Provider Model)
	 * @param {Boolean} firstTime
	 */
	checkingAvailability(firstTime) {
		var old_available = this.state.is_available;

		this.apiProvider
			.GetProviderActive(
				this.props.providerProfile._id,
				this.props.providerProfile._token,
				VersionNumber.appVersion,
				`${Platform.OS} ${Platform.Version}`,
				constants.device_token
			)
			.then((response) => {
				var responseJson = response.data;

				if (responseJson.success == true) {
					if (responseJson.is_approved == 0) {
						this.clearDisapprovedStatus();

						if (
							this.props.providerProfile._status_id !==
								'PENDENTE' &&
							this.props.providerProfile._status_id !==
								'EM_ANALISE'
						) {
							this.doLogout(
								strings('error.error'),
								strings('alert.attention_your_status', {
									status: strings('map_screen.evaluation'),
								})
							);
						}
					} else {
						this.props.providerProfile._is_active =
							responseJson.is_active;
						this.props.providerProfile._is_available =
							responseJson.is_active;

						this.props.setAvailable(responseJson.is_active);

						if (responseJson.is_active) {
							this.startBgLocation(this.props.providerProfile);
							let my_location_icon;

							my_location_icon = images.my_loc_enable;

							this.setState({
								my_location_icon,
							});
							BgLocationStart();
						}

						this.toggleBubbleService(responseJson.is_active);

						this.setState({
							acceptance: responseJson.statistics.acceptance,
							evaluation: responseJson.statistics.rate,
							cancellation: responseJson.statistics.cancellation,
							is_active: responseJson.is_active,
							is_available: responseJson.is_active,
						});

						if (responseJson.is_active == 0) {
							RNProviderBubble.stopService()
								.then(() => {})
								.catch((err) => {
                  handlerException('MainScreen.checkingAvailability', err);
								});

							BgLocationClear();

							if (!firstTime && old_available != false) {
								Alert.alert(
									strings('providerAppScreen.disconnected'),
									strings('providerAppScreen.offline'),
									[
										{
											text: 'OK',
											style: 'cancel',
										},
									],
									{
										cancelable: true,
									}
								);
							}
						}
					}
				} else if (responseJson.is_debt) {
					this.props.providerProfile._is_active = 0;
					this.props.providerProfile._is_available = 0;
					this.toggleBubbleService(0);
				} else if (responseJson.error_code == 406) {
					this.doLogout(
						strings('invalidToken.expiredSession'),
						strings('invalidToken.expiredSessionMessage')
					);
				}
			})
			.catch((error) => {
				this.setState({isLoading: false});
				parse.showToast(
					strings('error.try_again'),
					Toast.durations.LONG
				);
				handlerException('MainScreen.checkingAvailability', error);
			});
	}

	/**
	 * Desativa servicos quando o prestador está com status nao aprovado
	 */
	clearDisapprovedStatus() {
		try {
			this.props.setAvailable(0);
			this.toggleBubbleService(0);
			RNProviderBubble.stopService()
				.then(() => {})
				.catch((err) => {
          handlerException('MainScreen.clearDisapprovedStatus', err);
				});
			BgLocationClear();
		} catch (error) {
			handlerException('MainScreen.clearDisapprovedStatus', error);
		}
	}

	navigateToDebitScreen() {
		const id = this.props.providerProfile._id;
		const token = this.props.providerProfile._token;
		this.navigateToScreenWithParam('DebitActiveScreen', {
			id: id,
			token: token,
			appUrl: constants.BASE_URL,
			lang: i18n.locale,
			socket_url: constants.SOCKET_URL,
			type: 'provider',
			color: PrimaryButton,
		});
	}

	navigateToScreenWithParam(screen, params) {
		const {navigate} = this.props.navigation;
		constants.currentScreen = screen;
		navigate(screen, params);
	}

	/**
	 *
	 * @param {*} prevProps
	 * @param {*} prevState
	 * @param {*} snapshot
	 * Toda vez que o this.props.latitude ou longitude atualiza ele chama essa função, fazendo atualizar a posição do provider
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
				isLoading: false,
			});
		}
	}

	/**
	 * Seta posição do provider e marca ele no mapa
	 */
	bgLocationRegion() {
		try {
			this.setState({
				loading_message: strings('load.LoadingMap'),
			});
			var markerUser = this.createUserMarker(
				100,
				strings('map_screen.current_location'),
				this.props.latitude,
				this.props.longitude
			);

			this.setState({
				markerUser: markerUser,
				region: this.props.region,
				lastLat: this.props.latitude,
				lastLong: this.props.longitude,
				isLoading: false,
				loading_message: strings('load.Loading'),
			});

			if (this.props.region)
				this.checkMapToAnimate(this.props.region, 600);
			else if (Platform.OS === constants.IOS) {
				Geolocation.requestAuthorization();
			}
		} catch (error) {
			this.setState({
				isLoading: false,
			});
		}
	}

	/**
	 * Check map to handle animate
	 *
	 * @param {*} region
	 * @param {*} duration
	 */
	checkMapToAnimate(region, duration) {
		try {
			if (this.map != null) {
				this.map.animateToRegion(region, duration);
			}
		} catch (error) {}
	}

	checkVersion = async () => {
		try {
			const {needsUpdate} = await checkVersion({
				bundleId: WPACKAGE_NAME,
				baseUrl: constants.CHECK_VERSION_URL,
			});
			if (needsUpdate) {
				const params = {
					title: this.props.settings.title_app_update_provider
						? this.props.settings.title_app_update_provider
						: 'COMUNICADO!!!',
					description: this.props.settings.msg_app_update_provider
						? this.props.settings.msg_app_update_provider
						: `Está disponível na LOJA a nova Versão do Aplicativo ${WPROJECT_NAME}, clique em “ATUALIZAR AGORA” para realizar a atualização. Esta nova Versão tem muitas novidades APROVEITE!`,
				};
				showAlert(params);
			}
		} catch (e) {}
	};

	/**
	 * Component will be Mounted, so create Listener and Watcher
	 */
	componentDidMount() {
		this.checkVersion();

		this.refreshProviderStatusNow();

		this.getInfo();

		this.startBgLocation(this.props.providerProfile);

		this.toggleBubbleService(this.props.providerProfile._is_active);

		this.showDeviceWrongDateToast();

		this.getSurgeData();

		this.setState({isLoading: false});

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

	onRequestClear() {
		try {
			const onRequestClear = async () => {
				await this.props.onRequestClear();
			};

			onRequestClear();
		} catch (error) {
			handlerException('MainScreen,onRequestClear', error);
		}
	}

	getInfo() {
		try {
			if (this.props.providerProfile) {
				this.setState({
					completedRidesPercent:
						this.props.providerProfile._completed_rides * 100,
					cancelationPercent:
						this.props.providerProfile._cancelated_rides * 100,
				});
			}
		} catch (error) {
			handlerException('MainScreen.getInfo', error);
		}
	}

	/**
	 * Get surge heatmap areas
	 */
	async getSurgeData() {
		try {
			const response = await this.apiProvider.getSurgeHeatmap();

			if (response.status == 200) {
				const json = response.data;

				if (json.heatmaps.length > 0) {
					this.setState({
						heatmapData: json.heatmaps,
						heatmapLabel: json.labels,
						hasHeatmapData: true,
					});
				} else {
					this.setState({
						heatmapData: [],
						heatmapLabel: [],
						hasHeatmapData: false,
					});
				}
			}
		} catch (error) {
			handlerException('MainScreen.getSurgeData', error);
		}
	}

	/*
	 * start bgLocation with propos
	 */
	startBgLocation(provider) {
		try {
			if (provider._is_active) {
				configBgLocation(
					provider._id,
					provider._token,
					this.props.settings.update_location_interval,
					this.props.settings.update_location_fast_interval,
					this.props.settings.distance_filter,
					this.props.settings.disable_elasticity,
					this.props.settings.heartbeat_interval,
					this.props.settings.stop_timeout
				);
			}
		} catch (error) {
			handlerException('MainScreen.startBgLocation', error);
		}
	}

	/**
	 * Component will be Unmounted, so close Listener and Watcher
	 */
	componentWillUnmount() {
		clearInterval(constants.requestTimeAfterRequestStart);
		BgLocationClear();
		this.willBlur.remove();
		this.didFocus.remove();
		this.willFocus.remove();
	}

	/**
	 * Open and Close Menu
	 */
	toogleMenu() {
		this.setState({menu: !this.state.menu});
	}

	/**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const {navigate} = this.props.navigation;
		return navigate;
	}

	/**
	 * Navigate to another Screen.
	 */
	navigateToScreen(screen, providerId = null, image = null) {
		const {navigate} = this.props.navigation;

		constants.currentScreen = screen;

		/**
		 * First parameter: Screen to be initialized passed in "screen" variable
		 * Second parameter: Information sent from CurrentScreen to NextScreen.
		 * Use "this.props.navigation.state.params.loginBy" to use data on the other Screen
		 */

		clearInterval(constants.requestTimeAfterRequestStart);

		if (screen == 'MainScreen') {
		} else if (screen == 'DetailProviderScreen') {
			navigate(screen, {
				source_address: this.state.current_address,
				latitude: this.state.lastLat,
				longitude: this.state.lastLong,
				provider_id: providerId,
				imageType: image,
			});
		}
		else if (screen == 'InvoiceScreen') {
			navigate(screen, {
				provider: this.provider,
				request_id: this.state.request_id,
			});
		} else if (screen == 'ServiceUserBoardScreen') {
			navigate(screen, {request: this.request});
		}
		else if (screen == 'ServiceFinishedScreen') {
			navigate(screen, {
				provider: this.provider,
				request_id: this.state.request_id,
			});
		} else if (screen == 'ServiceRequestScreen') {
			constants.hasService = true;
			navigate('ServiceRequestScreen', {
				request: this.requestProvider,
			});
		} else if (screen == 'ScheduleRequestScreen') {
			navigate(screen, {schedule: this.requestProvider});
		} else {
			navigate(screen);
		}
		this.closeDrawer();
	}

	/**
	 * Show alert of defined message
	 * and call Logout function
	 * @param {String} firstMessage
	 * @param {String} scndMessage
	 */
	doLogout(firstMessage, scndMessage) {
		Alert.alert(
			firstMessage,
			scndMessage,
			[
				{
					text: strings('general.OK'),
					onPress: () => this.logout(),
				},
			],
			{cancelable: false}
		);
	}

	/**
	 * Clear data and call logout function.
	 */
	logout() {
		const {navigate} = this.props.navigation;

		let provider_id = this.props.providerProfile._id;
		let provider_token = this.props.providerProfile._token;

		this.provider = null;

		this.props.onProviderAction({
			_id: '',
			_token: '',
			_is_active: '',
		});

		parse.logout(provider_id, provider_token, navigate);
	}

	/**
	 * Create Custom marker for User Location.
	 */
	createUserMarker(id, title, latitude, longitude) {
		let markerUser = [];
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
	}

	/**
	 * Check and destroy locations
	 *
	 * @return {void}
	 */
	checkStorageLocations() {
		try {
			let count = BackgroundGeolocation.getCount();
			if (!isNaN(count) && count > 0) {
				BackgroundGeolocation.destroyLocations();
			}
		} catch (error) {
      handlerException('MainScreen.checkStorageLocations', error);
		}
	}

	checkRequestInProgress(provider) {
		if (!provider) {
			return;
		}

		this.apiProvider
			.GetRequestInProgressId(provider._id, provider._token)
			.then((response) => {
				var request = response.data;

				let providerData = this.props.providerProfile;
				providerData._status_id = request.status_id;
				this.props.onProviderAction(providerData);

				if (
					parse.isSuccess(request, this.returnConstNavigate()) == true
				) {
					if (request.request_id != -1) {
						configBgLocation(
							this.props.providerProfile._id,
							this.props.providerProfile._token,
							(update_location_interval =
								this.props.settings.update_location_interval),
							(update_location_fast_interval =
								this.props.settings
									.update_location_fast_interval),
							(distance_filter =
								this.props.settings.distance_filter),
							(disable_elasticity =
								this.props.settings.disable_elasticity),
							(heartbeat_interval =
								this.props.settings.heartbeat_interval),
							(stop_timeout = this.props.settings.stop_timeout),
							(requestId = request.request_id)
						);

						this.props.onRequestUpdated(request);
						this.props.onSetReceiveNotice(true);

						if (
							request.request &&
							request.request.is_completed &&
							request.request.payment_mode == 9
						) {
							this.props.navigation.dispatch(
								StackActions.reset({
									index: 0,
									key: null,
									actions: [
										NavigationActions.navigate({
											routeName: 'PixQrCodeScreen',
											params: {
												provider:
													this.props.providerProfile,
												request_id: request.request_id,
											},
										}),
									],
								})
							);
						} else {
							this.navigateToScreen(
								'ServiceUserBoardScreen',
								request.request_id
							);
						}
					} else {
						this.props.onRequestClear();
						this.props.onWaitingRequestClear();
						this.checkStorageLocations();
					}
				}
			})
			.catch((error) => {
				this.setState({isLoggingIn: false});

				this.props.onRequestClear();
				this.props.onWaitingRequestClear();
				this.checkStorageLocations();
				handlerException('MainScreen.checkRequestInProgress', error);
			});
	}

	toggleBubbleService(is_active) {
		try {
			if (is_active == 1 && !constants.bubbleStarted) {
				KeepAwake.activate();
				constants.bubbleStarted = true;
				RNProviderBubble.startService()
					.then((_response) => {})
					.catch((err) => handlerException('bubbleStarted', err));
			} else if (is_active == 0 && constants.bubbleStarted) {
				KeepAwake.deactivate();
				constants.bubbleStarted = false;
				RNProviderBubble.stopService()
					.then((_value) => {})
					.catch((err) => handlerException('bubbleFinished', err));
			}
		} catch (error) {
			handlerException('MainScreen.toggleBubbleService', error);
		}
	}

	/**
	 * Show alert to ask permission to display over other apps
	 */
	showOverOtherAppsAlert() {
		try {
			const context = this;

			DeviceEventEmitter.addListener(
				'canDrawOverlays',
				function (response) {
					if (response.result == false) {
						context.alertPermissionOverlay();
					} else {
						context.getProviderActive();
					}
				}
			);
		} catch (error) {
			handlerException('MainScreen.showOverOtherAppsAlert', error);
		}
	}

	/**
	 * Show toast to warn about wrong date
	 */
	showDeviceWrongDateToast() {
		try {
			if (Platform.OS == constants.IOS) {
				const NativeEvents = new NativeEventEmitter(
					NativeModules.RNProviderBubble
				);
				NativeEvents.addListener('deviceWrongDate', function () {
					parse.showToast(
						strings('alert.device_date_wrong'),
						Toast.durations.LONG
					);
				});
			} else {
				DeviceEventEmitter.addListener(
					'deviceWrongDate',
					function (response) {
						parse.showToast(
							strings('alert.device_date_wrong'),
							Toast.durations.LONG
						);
					}
				);
			}
		} catch (error) {
			handlerException('MainScreen.showDeviceWrongDateToasts', error);
		}
	}

	alertPermissionOverlay() {
		if (Platform.OS == constants.ANDROID) {
			Alert.alert(
				strings('alert.over_other_apps_title'),
				strings('alert.over_other_apps_message'),
				[
					{
						text: strings('general.yes'),
						onPress: () =>
							RNProviderBubble.openActivityOverOtherApps()
								.then(() => {})
								.catch((err) => {
                  handlerException('MainScreen.alertPermissionOverlay', err);
                }),
					},
				],
				{cancelable: false}
			);
		}
	}

	/**
	 * Check if the provider is current approved before change the state
	 */
	async checkChangeState() {
		if (!this.props.gpsStatus) return this.myLocation();

		BackgroundGeolocation.isPowerSaveMode((success) => {
			if(success && !this.props.isAvailable){
				parse.showToast(
					strings('alert.disable_power_save_title'),
					Toast.durations.LONG
				);
			}else{
				RNProviderBubble.canDrawOverlays().then((result) => {
					if (result == 'cannot') {
						this.alertPermissionOverlay();
						return;
					}

					this.getProviderActive();
				});
			}
		});
	}

	getProviderActive() {
		try {
			this.apiProvider
				.GetProviderActive(
					this.props.providerProfile._id,
					this.props.providerProfile._token,
					VersionNumber.appVersion,
					`${Platform.OS} ${Platform.Version}`,
					constants.device_token
				)
				.then((response) => {
					let responseJson = response.data;
					if (responseJson.success) {
						if (responseJson.is_approved == 0) {
							if (
								this.props.providerProfile._status_id !== 'PENDENTE' &&
								this.props.providerProfile._status_id !== 'EM_ANALISE'
							) {
								this.doLogout(
									strings('error.error'),
									strings('alert.attention_your_status', {
										status: strings('map_screen.evaluation'),
									})
								);
							} else if (
								this.props.providerProfile._status_id == 'PENDENTE'
							) {
								this.showAlertWithoutAction(
                  strings('login.pendent'),
                  responseJson.status_reason || strings('login.pendent_reason')
                );
							} else if (
								this.props.providerProfile._status_id == 'EM_ANALISE'
							) {
                if (this.props.settings?.is_enable_provider_approval_flow) {
                  this.showAlertWithoutAction(
                    strings('alert.in_analysis'),
                    strings('alert.in_analysis_message', {
                      name: this.props.providerProfile._first_name,
                      projectName: WPROJECT_NAME,
                    })
                  );
                }
							}
						} else {
							this.changeState();
						}
					} else {
						this.checkAccessDenied(responseJson);
					}
				});
		} catch (error) {
			parse.showToast(strings('error.try_again'), Toast.durations.LONG);
      handlerException('MainScreen.getProviderActive', error);
		}
	}

	/**
	 * Mostra uma mensagem sem acao no botao
	 *
	 * @param {*} title
	 * @param {*} message
	 */
	showAlertWithoutAction(title, message) {
		Alert.alert(title, message, [{text: 'OK', style: 'cancel'}], {
			cancelable: true,
		});
	}

	/**
	 * Check if user token is valid
	 *
	 * @param {*} data
	 */
	checkAccessDenied(data) {
		try {
			if (data.success == false && data.error_code == 406) {
				this.doLogout(
					strings('invalidToken.expiredSession'),
					strings('invalidToken.expiredSessionMessage')
				);
			}
		} catch (error) {
      handlerException('MainScreen.checkAccessDenied', error);
		}
	}

	async changeState() {
		this.setState({isLoading: true});
		if (
			this.props.providerProfile != null &&
			this.props.providerProfile._id != null
		) {

      try {
        const response = await this.apiProvider.UpdateState(
          this.props.providerProfile._id,
          this.props.providerProfile._token,
          this.state.lastLat,
          this.state.lastLong
        )
        const result = response.data;
        this.setState({isLoading: false});

        if (!result.success && result.is_debt) {
          this.props.providerProfile._is_active = 0;
          this.props.providerProfile._receiving_request = 0;
          this.props.providerProfile._is_available = 0;

          this.setState({is_active: 0});
          this.toggleBubbleService(0);
          this.navigateToDebitScreen();
          return;
        }

        if (
          parse.isSuccess(result, this.returnConstNavigate()) ==
          true
        ) {
          this.props.providerProfile._is_active =
            result.is_active;
          this.props.setAvailable(result.is_active);

          this.toggleBubbleService(result.is_active);

          this.setState({
            is_active: result.is_active,
          });
          let my_location_icon;
          if (result.is_active == 1) {
            this.startBgLocation(this.props.providerProfile);
            await BgLocationStart();
            my_location_icon = images.my_loc_enable;
            this.checkingBgLocationEnabled();
          } else if (result.is_active == 0) {
            BgLocationClear();
            my_location_icon = images.my_loc_disabled;
          }

          let receiving_request = 0;
          if (result.receiving_request == true) {
            receiving_request = 1;
          }

          this.setState({
            my_location_icon,
          });
          this.props.providerProfile._receiving_request =
            receiving_request;
        }
      } catch (error) {
        handlerException('MainScreen.changeState', error);
      } finally {
        this.setState({isLoading: false});
      }
		}
	}

	/**
	 * @author Bruno Moraes
	 *
	 * centraliza o mapa na posição atual do usuario
	 */
	async myLocation(region = null) {
		if (region) {
			this.checkMapToAnimate(region, 600);
		} else {
			await GeolocationService.getCurrentLocation(
				(position) => {
					let region = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
						latitudeDelta: 0.00922 * 1.5,
						longitudeDelta: 0.00421 * 1.5,
					};
					let markerUser = this.createUserMarker(
						100,
						strings('map_screen.current_location'),
						position.coords.latitude,
						position.coords.longitude
					);

					this.setState({
						markerUser: markerUser,
						region: region,
						lastLat: position.coords.latitude,
						lastLong: position.coords.longitude,
						isLoading: false,
					});

					this.checkMapToAnimate(region, 600);
				},
				{
					text: strings('map_screen.active_gps_msg'),
					yes: strings('map_screen.active_gps'),
					no: strings('map_screen.running_out_of'),
				}
			);
		}
	}

	/**
	 * Close Drawer Menu
	 */
	closeDrawer = () => {
		if (this.drawer) {
      this.drawer.close();
			this.state.menu = false;
		}
	};

	/**
	 * Open Drawer Menu
	 */
	openDrawer = () => {
		if (this.drawer) {
      this.drawer.open();
      this.setState({ menu: true });
		}
	};

	createKnobRequest() {
		this.props.navigation.navigate('CreateKnobRequestScreen');
	}

	/**
	 * Check bg location enabled
	 */
	checkingBgLocationEnabled() {
		try {
			let bgEnabled = getEnabled();
			if (
				bgEnabled == false &&
				this.props.settings.is_check_bglocation_enabled == true
			) {
				this.changeState();
				this.showAlertBgLocation(
					strings('map_screen.check_bglocation'),
					strings('map_screen.check_bglocation_msg')
				);
			}
		} catch (error) {
      handlerException('MainScreen.checkingBgLocationEnabled', error);
		}
	}

	getLocation = () => {
		try {
			Geolocation.getCurrentPosition(
				(position) => {
					const {latitude, longitude} = position.coords;

					let region = {
						latitude: latitude,
						longitude: longitude,
						latitudeDelta: 0.015,
						longitudeDelta: 0.015,
					};

					this.myLocation(region);

					this.setState({
						region,
					});
				},
				(error) => {
					Geolocation.getCurrentPosition((position) => {
						const {latitude, longitude} = position.coords;

						let region = {
							latitude: latitude,
							longitude: longitude,
							latitudeDelta: 0.015,
							longitudeDelta: 0.015,
						};

						this.setState({
							region,
						});

						this.myLocation(region);
					});
				},
				{
					enableHighAccuracy: Platform.OS == 'ios' ? false : true,
					timeout: 1000,
				}
			);
		} catch (error) {}
	};

	handleOpenSettings() {
		try {
			const {openURL, openSettings} = Linking;

			if (Platform.OS == 'ios') {
				openURL('app-settings:');
			} else {
				openSettings();
			}
		} catch (error) {
      handlerException('MainScreen.handleOpenSettings', error);
		}
	}

	showAlertBgLocation(title, message) {
		Alert.alert(
			title,
			message,
			[
				{
					text: strings('map_screen.check_bglocation_btn'),
					style: 'cancel',
					onPress: () => this.handleOpenSettings(),
				},
			],
			{
				cancelable: true,
			}
		);
	}

	/**
	 * Render labels to show surge multiplier
	 */
	renderLabels() {
		return this.state.heatmapLabel.map((label) => (
			<MapView.Marker key={label.key} coordinate={label.location}>
				<SurgeMarker amount={label.multiplier} />
			</MapView.Marker>
		));
	}

	/**
	 * Render heatmap surge areas
	 */
	renderHeatmap() {
		return this.state.heatmapData.map((heatmap) => (
			<Heatmap
				key={heatmap.key}
				opacity={0.5}
				points={heatmap.points}
				gradient={heatmap.gradient}
			/>
		));
	}

  renderToolbar() {
    return (
      <DefaultHeader
        loading={this.state.isLoading}
        loadingMsg={this.state.loading_message}
        btnBack={false}
        btnBackListener={() => this.openDrawer()}
        profileImg={this.props.providerProfile._picture}
        isMain={true}
      />
    );
  }

	render() {
		return (
			<>
				<View style={styles.parentContainer}>
				  <StatusBar
            barStyle="dark-content"
            backgroundColor="#fff"
            hidden={false}
          />

					<Drawer
						ref={(ref) => (this.drawer = ref)}
            openDrawerOffset={0.2}
            type="overlay"
            tapToClose={true}
						content={
							<Menu
								onItemSelected={(item) =>
									this.navigateToScreen(item)
								}
								navigator={navigator}
							/>
						}
						onClose={() => this.closeDrawer()}>

            {this.renderToolbar()}

						<MapView
							initialRegion={this.props.region}
							region={this.state.region}
							style={styles.map}
							showsUserLocation={false}
							followUserLocation={true}
							zoomEnabled={true}
							ref={(map) => (this.map = map)}
							showsCompass={true}
							pitchEnabled={true}
							showsMyLocationButton={true}
							onMapReady={() => this.getLocation()}
            >
							{this.state.markerUser.map((marker) => (
								<RNMMarker
									image={this.state.my_location_icon}
									key={marker._id}
									title={marker._title}
									anchor={{
										x: 0.5,
										y: 0.5,
									}}
									coordinate={{
										latitude: parseFloat(marker._latitude),
										longitude: parseFloat(
											marker._longitude
										),
									}}
								/>
							))}

							{this.state.hasHeatmapData && this.renderLabels()}

							{this.state.hasHeatmapData && this.renderHeatmap()}
						</MapView>

						<View style={styles.areaBottomButtons}>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.mapButton}
                onPress={() => this.myLocation()}>
                <Image
                  style={styles.recentralizeImage}
                  source={images.recentralize}
                />
              </TouchableOpacity>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}>

                {this.props.settings?.is_knob_request_enabled &&
                this.props.providerProfile._is_active == 1 && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.knobButton,
                      {
                        backgroundColor: this.props.isAvailable
                          ? PrimaryButton
                          : projectColors.secondaryGray,
                      },
                    ]}
                    onPress={() => this.createKnobRequest()}
                  >
                    <Text style={styles.knobText}>
                      {strings('map_screen.knob_request')}
                    </Text>
                  </TouchableOpacity>
                )}

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
                  style={{
										backgroundColor: this.props.isAvailable ? PrimaryButton : projectColors.secondaryGray,
                    marginLeft: 'auto',
                  }}
                />
              </View>

							{this.props.providerProfile._id &&
							this.props.providerProfile._token ? (
								<Banner
									providerId={this.props.providerProfile._id}
									providerToken={
										this.props.providerProfile._token
									}
									route={constants.BANNERURL}
									returnRequest={() => {}}
								/>
							) : null}
							<TouchableOpacity
								onPress={() => this.checkChangeState()}
								style={[
									styles.btnStatus,
									{
										backgroundColor: this.props.isAvailable
											? PrimaryButton
											: projectColors.secondaryGray,
									},
								]}>
								<Text style={styles.txtButtons}>
									{this.props.isAvailable
										? strings('map_screen.status_online')
										: strings('map_screen.status_offline')}
								</Text>
							</TouchableOpacity>
							<View style={styles.footerInfoDriver}>
								<View style={styles.infoDriverColumn}>
									<Entypo
										name="shield"
										size={30}
										color={PrimaryIcon}
									/>

									<Text style={styles.infoDriverLineValue}>
										{this.state.acceptance}
									</Text>

									<Text style={styles.infoDriverLineDesc}>
										{strings('map_screen.acceptance')}
									</Text>
								</View>
								<View style={styles.infoDriverColumn}>
									<MaterialIcons
										name="stars"
										size={30}
										color={PrimaryIcon}
									/>

									<Text style={styles.infoDriverLineValue}>
										{this.state.evaluation}
									</Text>

									<Text style={styles.infoDriverLineDesc}>
										{strings('map_screen.evaluation')}
									</Text>
								</View>
								<View style={styles.infoDriverColumn}>
									<MaterialIcons
										name={'cancel'}
										size={30}
										color={PrimaryIcon}
									/>

									<Text style={styles.infoDriverLineValue}>
										{this.state.cancellation}
									</Text>

									<Text style={styles.infoDriverLineDesc}>
										{strings('map_screen.cancellation')}
									</Text>
								</View>
							</View>
						</View>
					</Drawer>
				</View>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {providerProfile} = state.providerProfile;
	const {settings} = state.settingsReducer;
	const {provider} = state.providerReducer;
	const {region, latitude, longitude} = state.CoordinatesProviderReducer;
	const {gpsStatus} = state.BgGeolocationReducer;
	const {isAvailable} = state.providerProfile;
	const {request, waiting_request} = state.request;

	return {
		providerProfile,
		settings,
		provider,
		region,
		latitude,
		longitude,
		gpsStatus,
		isAvailable,
		request,
		waiting_request,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onProviderAction: (provider) => dispatch(providerAction(provider)),
		changeProviderData: (values) => dispatch(changeProviderData(values)),
		onRequestUpdated: (request) => dispatch(requestUpdated(request)),
		onRequestClear: () => dispatch(requestClear()),
		onWaitingRequestClear: () => dispatch(waitingRequestClear()),
		setAvailable: (value) => dispatch(setAvailable(value)),
		onSetReceiveNotice: (data) => dispatch(setReceiveNotice(data)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
