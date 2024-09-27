// Modules
import React, {Component} from 'react';
import {
	Text,
	View,
	Image,
	Alert,
	BackHandler,
	TouchableOpacity,
	Vibration,
	Platform,
	PixelRatio,
	Dimensions,
	SafeAreaView,
	FlatList,
} from 'react-native';
import _ from 'lodash';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackgroundTimer from 'react-native-background-timer';
import RNProviderBubble from 'react-native-provider-bubble';
import CountdownCircle from 'react-native-countdown-circle';
import MapView, {Polyline,Marker as RNMMarker} from 'react-native-maps';
import {connect} from 'react-redux';
import {NavigationActions, StackActions} from 'react-navigation';
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';

// Components
import Loader from '../../Components/Loader';
import ActionButton from '../../Components/ActionButton';

// Locales
import {strings} from '../../Locales/i18n';

//Models
import Marker from '../../Models/Marker';

// Services
import {handlerException} from '../../Services/Exception';
import {configBgLocation} from '../../Services/configBgLocation';
import {RideNotification} from '../../Services/pushNotifications';

// Services
import ProviderApi from '../../Services/Api/ProviderApi';

// Store
import {
	requestAcceptedAction,
	requestUpdated,
	waitngRequestUpdated,
	requestClear,
	setReceiveNotice,
	setWaitingReceiveNotice,
	waitingRequestClear,
} from '../../Store/actions/request';

// Themes
import {Images} from '../../Themes';
import images from '../../Themes/WhiteLabelTheme/Images';
import {ColorServiceRequest} from '../../Themes/WhiteLabelTheme/WhiteLabel';

// Util
import * as constants from '../../Util/Constants';
import * as parse from '../../Util/Parse';

// Styles
import styles from './styles';
import NewCallRace from '../../Components/sounds/NewCallRace';
import { isAppInstalled } from '../../Components/react-native-open-maps/src/utils';
class ServiceRequestScreen extends Component {
	constructor(props) {
		super(props);

		this.apiProvider = new ProviderApi();
		this.try_accept = false;

		this.willBlur = this.props.navigation.addListener('willBlur', () => {
			if (this.intervalId) {
				clearInterval(this.intervalId);
			}
		});

		this.state = {
			polyline: [],
			markerUser: [],
			isLoading: false,
			coordinateMap: [],
			playSound: null,
			playSoundError: true,
			waiting_ride: this.props.navigation?.state?.params?.waiting_ride,
		};
	}

	componentDidMount() {
		this.hasService = true;

		if (this.startTimer()) {
			this.startBubble();
			this.rideNotification();
		}

		this.setIntervalId();
		this.setBackHandler();
		this.vibrate();

	}

	vibrate() {
		try {
			Vibration.vibrate(1000);
		} catch (error) {
			handlerException('ServiceRequestScreen.vibrate', error);
		}
	}

	setBackHandler() {
		try {
			this.backHandler = BackHandler.addEventListener(
				'hardwareBackPress',
				() => {
					this.cancelRequestAlert();
					return true;
				}
			);
		} catch (error) {
			handlerException('ServiceRequestScreen.setBackHandler', error);
		}
	}

	getPropsRequest() {
		return !this.state.waiting_ride
			? this.props.request
			: this.props.waiting_request;
	}

	getPropsUser() {
		return !this.state.waiting_ride
			? this.props.user
			: this.props.waiting_user;
	}

	/**
	 * Update provider location on request
	 */
	setIntervalId() {
		try {
			this.intervalId = setInterval(() => {
				let {latitude, longitude} = this.state;

				if (
					this.props.providerProfile?._id &&
					this.props.providerProfile?._token &&
					this.getPropsRequest() &&
					this.getPropsRequest().request_id &&
					latitude &&
					longitude
				) {
					this.apiProvider
						.UpdateProviderLocation(
							this.props.providerProfile._id,
							this.props.providerProfile._token,
							this.getPropsRequest().request_id,
							latitude,
							longitude
						)
						.then((responseJSON) => {
							const {data} = responseJSON;
							if (data.is_cancelled == 1) {
								parse.showToast(
									strings(
										'ServiceUserBoardScreen.service_cancel_user'
									),
									Toast.durations.LONG
								);
								this.finish();
							}
						})
						.catch((err) => {
							handlerException('UpdateProviderLocation', err);
						});
				}
			}, 4000);
		} catch (e) {
			handlerException('setIntervalId', e);
		}
	}

	/**
	 * Create Custom marker for User Location.
	 */
	createUserMarker(id, title, latitude, longitude) {
		try {
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
		} catch (error) {
			handlerException('ServiceRequestScreen.createUserMarker', error);
		}
	}

	/**
	 * it's for calculate size pixels
	 * @param {Number} pixels
	 */
	getPixelSize(pixels) {
		try {
			return Platform.select({
				ios: pixels,
				android: PixelRatio.getPixelSizeForLayoutSize(pixels),
			});
		} catch (error) {
			handlerException('ServiceRequestScreen.getPixelSize', error);
		}
	}

  startTimer = () => {
		try {
			this.setState({
				time_left_to_respond: this.getPropsRequest()
					.time_left_to_respond
					? this.getPropsRequest().time_left_to_respond
					: 0,
			});
      this.state.timeToPlay = 20;
			if (Platform.OS == 'android') {
				BackgroundTimer.runBackgroundTimer(() => {
          
					if (this.hasService && this.getPropsRequest()?.time_left_to_respond) {
						this.setState({
							time_left_to_respond:
								this.state.time_left_to_respond - 1,
						});

						if (this.state.time_left_to_respond > 0) {
              if(this.state.timeToPlay == 10
                || this.state.timeToPlay == 20){
                this.setState({ playSound: true });
              }
						} else {
							this.finish();
						}
            this.state.timeToPlay -= 1;
					}
				}, 1000);
      } else {
        BackgroundTimer.start();
        this.intervalServiceRequest = BackgroundTimer.setInterval(
          () => {
            if (this.hasService && this.getPropsRequest()?.time_left_to_respond) {
              if (this.getPropsRequest().time_left_to_respond > 0) {
                if(this.state.timeToPlay == 10
                  || this.state.timeToPlay == 20){
                  this.setState({ playSound: true });
                }
              } else {
                this.finish();
              }
              this.state.timeToPlay -= 1;
            }
          },
          1000
        );
      }
			return true;
		} catch (error) {
			handlerException('ServiceRequestScreen.startTimer', error);
			return false;
		}
	};

	resetTimer = () => {
		try {

			Vibration.cancel();

			this.setState({timerValue: 0, timerDisplayValue: ''});
			if (Platform.OS == 'android') {
				BackgroundTimer.stopBackgroundTimer();
			}

			if (this.intervalServiceRequest) {
				BackgroundTimer.clearInterval(this.intervalServiceRequest);
			}

			BackgroundTimer.stop();
		} catch (error) {
			handlerException('ServiceRequestScreen.resetTimer', error);
		}
	};
	/**
	 * Set latitude, longitude, estimated distance and time
	 *
	 */
	centerMapOnScreen() {
		try {
			let coordinateUserProvider = [];

			const {latitude, longitude} = this.state;

			if (latitude != undefined && longitude != undefined) {
				coordinateUserProvider[0] = {
					latitude: latitude,
					longitude: longitude,
				};
			}

			coordinateUserProvider[1] = {
				latitude: this.getPropsUser()?.latitude,
				longitude: this.getPropsUser()?.longitude,
			};

			this.setState({
				coordinateMap: coordinateUserProvider,
			});
		} catch (error) {
			handlerException(
				'ServiceRequestScreen.coordinateUserProvider',
				error
			);
		}
	}

	/**
	 * ride notification
	 */
	rideNotification() {
		try {
			RideNotification(
				this.getPropsUser()?.name,
				this.props.settings?.enable_vehicle_information_button
			);
		} catch (error) {
			handlerException('ServiceRequestScreen.rideNotification', error);
		}
	}

	/**
	 * Subscribe Socket Channel and wait for request update
	 * @param {Number} request | Request ID
	 */
	subscribeSocket(request) {
		try {
			if (constants.socket != null) {
				constants.socket
					.emit('subscribe', {
						channel: 'request.' + request,
					})
					.on('requestUpdate', (channel, data) => {
						var socketRequest = data.request;
						if (socketRequest.is_cancelled == 1) {
							parse.showToast(
								strings(
									'ServiceUserBoardScreen.service_cancel_user'
								),
								Toast.durations.LONG
							);

							this.finish();
						}
					})
					.on('disconnect', () => this.resubscribeSocket(request));
			}
		} catch (e) {
			handlerException('ServiceRequestProvider.subscribeSocket', e);
		}
	}

	/**
	 * Function that unsubscribe socket if happen a disconnection and reconect.
	 *
	 * @param {Number} request | Request ID
	 */
	resubscribeSocket(request) {
		this.unsubscribeSocket();
		this.subscribeSocket(request);
	}

	/**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const {navigate} = this.props.navigation;
		return navigate;
	}

  async acceptService() {

    try {

      const wazeInstalled = await isAppInstalled('waze', { waze: 'waze://' });

      if (!wazeInstalled) {
        return Alert.alert('Ops!', strings('ServiceUserBoardScreen.waze_not_installed'));
      }

      if (this.props.providerProfile != null &&
        this.props.providerProfile._id &&
        this.getPropsRequest()?.request_id) {
        this.setState({ isLoading: true, });

        const response = await this.apiProvider.ConfirmService(
          this.props.providerProfile._id,
          this.props.providerProfile._token,
          this.getPropsRequest().request_id,
          1
        );

        this.try_accept = true;

        const { data: result } = response;

        if (parse.isSuccess(result)) {
          await this.updateRequest(result);

          this.unsubscribeSocket();
          this.clearInterval();
          this.configBgLocation();
          this.resetTimer();
          this.setState({ isLoading: false });

          await this.navigateToServiceRequestScreen();
        } else {
          this.try_accept = false;
          this.finish();
          this.setState({ isLoading: false });
        }
      }
    } catch (error) {
      this.try_accept = false;
      handlerException('ServiceRequestScreen.acceptService', error);
      this.setState({ isLoading: false });
      parse.showToast(strings('error.try_again'), Toast.durations.LONG);
    }
  }

	async navigateToServiceRequestScreen() {
		try {
			await this.props.navigation.dispatch(
				StackActions.reset({
					index: 0,
					key: null,
					actions: [
						NavigationActions.navigate({
							routeName: 'ServiceUserBoardScreen',
						}),
					],
				})
			);
		} catch (error) {
			handlerException(
				'ServiceRequestScreen.navigateToServiceRequestScreen',
				error
			);
		}
	}

	async updateRequest(result) {
		try {
			if (!this.state.waiting_ride) {
				await this.props.onRequestUpdated(result);
			} else {
				await this.props.onWaitingRequestUpdated(result);
			}
		} catch (error) {
			handlerException('ServiceRequestScreen.updateRequest', error);
		}
	}

	clearInterval() {
		try {
			if (this.getPropsRequest()?.time_left_to_respond) {
				clearInterval(this.getPropsRequest().time_left_to_respond);
			}

			if (this.intervalId) {
				clearInterval(this.intervalId);
			}
		} catch (error) {
			handlerException('ServiceRequestScreen.clearInterval', error);
		}
	}

	configBgLocation() {
		try {
			if (this.getPropsRequest()?.request_id) {
				configBgLocation(
					this.props.providerProfile._id,
					this.props.providerProfile._token,
					this.props.settings.update_location_interval,
					this.props.settings.update_location_fast_interval,
					this.props.settings.distance_filter,
					this.props.settings.disable_elasticity,
					this.props.settings.heartbeat_interval,
					this.props.settings.stop_timeout,
					this.getPropsRequest().request_id
				);
			}
		} catch (e) {
			handlerException('ServiceRequestScreen.configBgLocation', e);
		}
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
					onPress: () => this.rejectService(true),
				},
			],
			{cancelable: false}
		);
	}

	async finish() {
		this.hasService = false;

		if (!this.try_accept) {
			this.unsubscribeSocket();

			this.resetTimer();

			this.clearInterval();

			this.finishBubble();

			await this.onRequestClear();

			this.props.navigation.dispatch(
				StackActions.reset({
					index: 0,
					key: null,
					actions: [
						NavigationActions.navigate({
							routeName: 'MainScreen',
						}),
					],
				})
			);
		}
	}

	async onRequestClear() {
		try {
			if (!this.state.waiting_ride) {
				await this.props.onRequestClear();
			} else {
				await this.props.onWaitingRequestClear();
			}
		} catch (error) {
			handlerException('ServiceRequestScreen.onRequestClear', error);
		}
	}

	/**
	 * Start the bubble
	 */
	startBubble() {
		try {
			RNProviderBubble.startRequest();
		} catch (error) {
			handlerException('ServiceRequestScreen.startService', error);
		}
	}

	/**
	 * Finish the bubble
	 */
	finishBubble() {
		try {
			RNProviderBubble.finishRequest();
		} catch (error) {
			handlerException('ServiceRequestScreen.finishBubble', error);
		}
	}

	async rejectService() {
		try {
			if (
				this.props.providerProfile._token != null &&
				this.props.providerProfile._id != null &&
				this.getPropsRequest()?.request_id
			) {
				this.setState({isLoading: true});

				this.apiProvider
					.RejectService(
						this.props.providerProfile._id,
						this.props.providerProfile._token,
						this.getPropsRequest().request_id,
						0
					)
					.then(() => {
						parse.showToast(
							strings(
								'ServiceUserBoardScreen.service_canceled_by_you'
							)
						);
						this.setState({isLoading: false});
						this.finish();
					})
					.catch((error) => {
						handlerException('rejectService', error);
						this.setState({isLoading: false});
						parse.showToast(
							strings('error.try_again'),
							Toast.durations.LONG
						);
					});
			}
		} catch (error) {
			handlerException('ServiceRequestScreen.rejectService', error);
			this.setState({isLoading: false});
			parse.showToast(strings('error.try_again'), Toast.durations.LONG);
		}
	}

	onRightSlide = async () => {
		try {
			await this.acceptService();
		} catch (error) {
			handlerException('ServiceRequestScreen.onRightSlide', error);
		}
	};

	/**
	 * Component will be Unmounted, so close Listener and Watcher
	 */
	componentWillUnmount() {
		try {
			this.unsubscribeSocket();

			if (this.backHandler) {
				this.backHandler.remove();
			}

			this.willBlur.remove();
		} catch (error) {
			handlerException(
				'ServiceRequestScreen.componentWillUnmount',
				error
			);
		}
	}

	/**
	 * Unsubscribe Socket Channel and remove listeners
	 */
	unsubscribeSocket() {
		try {
			if (constants.socket != null && this.getPropsRequest()) {
				constants.socket.removeAllListeners('requestUpdate');
				if (
					this.getPropsRequest().request_id != null &&
					this.getPropsRequest().request_id != 0
				) {
					constants.socket.emit('unsubscribe', {
						channel: 'request.' + this.getPropsRequest().request_id,
					});
				}
			}
		} catch (e) {
			handlerException('ServiceRequestScreen.unsubscribeSocket', e);
		}
	}

	/**
	 * Navigate to another Screen.
	 */
	navigateToScreen(screen, providerId, image) {
		try {
			const {navigate} = this.props.navigation;
			constants.currentScreen = screen;
			this.hasService = true;

			if (screen == 'ServiceUserBoardScreen') {
				navigate(screen, {request: this.request});
			} else if (screen == 'MainScreen') {
				navigate(screen);
			} else {
				navigate(screen);
			}
		} catch (error) {
			handlerException('ServiceRequestScreen.navigateToScreen', error);
		}
	}

	heightPercentageToDP = (heightPercent) => {
		try {
			const screenHeight = Dimensions.get('window').height;
			return PixelRatio.roundToNearestPixel(
				(screenHeight * parseFloat(heightPercent)) / 100
			);
		} catch (error) {
			handlerException(
				'ServiceRequestScreen.heightPercentageToDP',
				error
			);
		}
	};

	renderButtonAcepted = () => {
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
								tintColor={ColorServiceRequest}
							/>
							<Image
								source={Images.icon_arrow_right_white}
								style={styles.icon_arrow_right_white}
								tintColor={ColorServiceRequest}
							/>
						</View>

						<Text numberOfLines={1} style={styles.titleText}>
							{!this.state.waiting_ride
								? strings('requests.swipe_right_to_accept')
								: strings(
										'requests.swipe_right_to_accept_waiting'
								  )}
						</Text>
					</View>
				</RNSlidingButton>
			);
		}

		return (
			<ActionButton
				text={
					!this.state.waiting_ride
						? strings('requests.click_to_accept')
						: strings('requests.click_to_accept_waiting')
				}
				onPress={this.onRightSlide}
			/>
		);
	};

  turnOffSound(){
    this.setState({playSound: false})
  }

	render() {
		const {settings} = this.props;

		const request = this.getPropsRequest();
		const user = this.getPropsUser();

		return request && user ? (
			<SafeAreaView style={styles.parentContainer}>
				<Loader
					loading={this.state.isLoading}
					message={strings('load.Loading')}
				/>
				<Image source={images.overlay} style={styles.image} />
        {this.state.playSound && <NewCallRace turnOffSound={this.turnOffSound.bind(this)}/> }
				{this.state.coordinateMap &&
				this.state.coordinateMap.length > 0 ? (
					<MapView
						inititalRegion={this.props.region}
						style={styles.map}
						showsUserLocation={false}
						followUserLocation={true}
						zoomEnabled={true}
						ref={(map) => {
							this.map = map;
						}}
						pitchEnabled={true}
						onMapReady={() => {
							if (this.map) {
								this.map.animateToRegion(this.props.region);
							}
						}}
					>
						{this.state.markerUser.map((marker) => (
							<RNMMarker
								image={images.my_loc_enable}
								key={marker._id}
								title={marker._title}
								anchor={{x: 0.5, y: 0.5}}
								coordinate={{
									latitude: parseFloat(marker._latitude),
									longitude: parseFloat(marker._longitude),
								}}
							/>
						))}
						{this.state.polyline &&
						this.state.polyline.length > 0 ? (
							<Polyline
								coordinates={this.state.polyline}
								strokeWidth={5}
								strokeColor="#4B74FF"
							/>
						) : null}
						{user.name != undefined ? (
							<RNMMarker
								image={images.user_location}
								key={1}
								title={user.name}
								coordinate={{
									latitude: parseFloat(user.latitude),
									longitude: parseFloat(user.longitude),
								}}
							/>
						) : null}
					</MapView>
				) : null}
				<TouchableOpacity
					onPress={() => this.cancelRequestAlert()}
					style={styles.refuseToucha}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							alignItems: 'center',
							marginTop: 4,
						}}>
						<Icon
							name="close"
							size={15}
							color={ColorServiceRequest}
						/>
						<Text style={styles.refuse}>
							{strings('ServiceRequestScreen.refuse')}
						</Text>
					</View>
				</TouchableOpacity>
				<View style={{bottom: 0, position: 'absolute', width: '100%'}}>

        {this.props.request?.institution_id && <View style={styles.inforCardTitleView}>
          <Text style={styles.inforCardTitleText}>{strings('ScheduleRequestScreen.corporate_ride')}</Text>
        </View>}
					<View style={styles.card}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-around',
							}}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}>
								{user.picture ? (
									<Image
										source={{
											uri: user.picture,
										}}
										style={styles.avatar}
									/>
								) : null}

								<View>
									<Text style={styles.tipe}>{user.name}</Text>
									<Text style={styles.tipe}>
										{request.type_name}
									</Text>
									<View style={{flexDirection: 'row'}}>
										<Text style={styles.star}>
											{user.rating}
										</Text>
										<Icon
											name="stars"
											size={18}
											color={ColorServiceRequest}
										/>
									</View>
								</View>
							</View>
							{parseInt(this.state.time_left_to_respond) > 0 ? (
								<CountdownCircle
									seconds={parseInt(
										request.time_left_to_respond
									)}
									onTimeElapsed={() => this.finish()}
									radius={30}
									borderWidth={6}
									color={ColorServiceRequest}
									bgColor="#fff"
									textStyle={{fontSize: 10}}
								/>
							) : null}
						</View>
						{this.state.waiting_ride == true ? (
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									marginBottom: 10,
								}}>
								<Text style={styles.tipe}>
									{strings('requests.waiting_ride')}
								</Text>
							</View>
						) : (
							<Text style={styles.new}>
								{strings('ServiceRequestScreen.new')}
							</Text>
						)}

						{request.display_price ? (
							<Text style={styles.price}>
								{request.display_price}
							</Text>
						) : null}

						{settings.show_estimate_distance_to_called_provider &&
						request.distance_to_source ? (
							<Text style={styles.distance}>
								{strings('ServiceRequestScreen.boarding')}{' '}
								{request.distance_to_source}
							</Text>
						) : null}

						{settings.show_estimate_time_to_called_provider &&
						request.time_to_source ? (
							<Text style={styles.distance}>
								{request.time_to_source}
							</Text>
						) : null}

						{request.time_to_destination &&
						request.distance_to_destination ? (
							<>
								<View style={styles.line} />

								<Text style={styles.dest}>
									{strings('ServiceRequestScreen.travel')}{' '}
									{request.distance_to_destination}
								</Text>

								<Text style={styles.timeDest}>
									{request.time_to_destination}
								</Text>

								<View style={styles.line} />
							</>
						) : null}

						<View
							style={{
								margin: 10,
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}>
							<View style={styles.viewSource}>
								<Text style={styles.textSou}>
									{request.source}
								</Text>
								{settings.show_destination_to_provider_accept_request &&
								request.points ? (
									<FlatList
										data={request.points}
										keyExtractor={(item, index) =>
											index.toString()
										}
										renderItem={({item, index}) => (
											<Text
												style={[
													styles.textSou,
													{marginTop: 5},
												]}
												numberOfLines={2}>
												{item.address}
											</Text>
										)}
									/>
								) : null}
							</View>
						</View>
					</View>
					{this.renderButtonAcepted()}
				</View>
			</SafeAreaView>
		) : null;
	}
}

const mapStateToProps = (state) => {
	const {request, user, waiting_request, waiting_user} = state.request;
	const {settings} = state.settingsReducer;
	const {audio} = state.settingsReducer;
	const {providerProfile} = state.providerProfile;
	const {region, latitude, longitude} = state.CoordinatesProviderReducer;

	return {
		request,
		user,
		audio,
		providerProfile,
		settings,
		region,
		latitude,
		longitude,
		waiting_request,
		waiting_user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onRequestUpdated: (request) => dispatch(requestUpdated(request)),
		onWaitingRequestUpdated: (request) =>
			dispatch(waitngRequestUpdated(request)),
		onRequestAccepted: (request) =>
			dispatch(requestAcceptedAction(request)),
		onSetReceiveNotice: (data) => dispatch(setReceiveNotice(data)),
		onSetWaitingReceiveNotice: (data) =>
			dispatch(setWaitingReceiveNotice(data)),
		onRequestClear: () => dispatch(requestClear()),
		onWaitingRequestClear: () => dispatch(waitingRequestClear()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ServiceRequestScreen);
