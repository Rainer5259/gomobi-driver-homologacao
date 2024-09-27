// Modules
import React, { Component } from "react";
import {
	Text,
	FlatList,
	View,
	TouchableOpacity,
	BackHandler,
	Image,
	ActivityIndicator
} from "react-native";
import Toast from "react-native-root-toast";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { connect } from "react-redux";
import { Avatar } from 'react-native-elements'

// Components
import DefaultHeader from "../../Components/DefaultHeader";

// Locales
import { strings } from "../../Locales/i18n";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";

//Store
import { changeMyRequestView } from '../../Store/actions/actionRequest'

// Themes
import { Images } from "../../Themes";
import {
	projectColors,
	PrimaryButton
} from "../../Themes/WhiteLabelTheme/WhiteLabel";
import images from "../../Themes/WhiteLabelTheme/Images";

// Util
import * as parse from "../../Util/Parse";
import * as constants from "../../Util/Constants";

// Styles
import styles from "./styles";
class MyRequestsScreen extends Component {
	constructor(props) {
		super(props);

		this.api = new ProviderApi();
		this.state = {
			isLoading: true,
      selectedIndex: 0,
			dataSourceHistory: [],
			dataSourceScheduled: [],
			has_history_request: true,
			has_scheduled_request: true,
			pageHistory: 1,
			pageSchedule: 1,
			isLoadingHistory: false,
			isLoadingSchedule: false,
		};

		this.didFocus = this.props.navigation.addListener("didFocus", () => {})
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			this.props.navigation.goBack()
			return true
		})

		this.requestData();
	}

  handleIndexChange = index => {
    this.setState({
      ...this.state,
      selectedIndex: index
    });
  }

	async requestData() {
		this.state.isLoading = true
		this.state.dataSourceHistory = []
		this.state.pageSchedule = 1
		this.state.pageHistory = 1

		await this.getSchedules();

		await this.getRequests()
	}

	componentWillUnmount() {
		if (this.backHandler) {
			this.backHandler.remove();
		}
		this.didFocus.remove();
	}

	/**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const { navigate } = this.props.navigation;
		return navigate;
	}

	/**
	 * Get requests
	 */
	getRequests = async () => {
		try {

			this.setState({ isLoading: true })

			if (this.state.pageHistory > 0) {
				this.setState({ isLoadingHistory: true })

				const response = await this.api.GetMyRequests(
					this.props.provider._id,
					this.props.provider._token,
					this.state.pageHistory
				);

				const results = response.data

				if (parse.isSuccess(results, this.returnConstNavigate()) == true) {
					if (results.data.length > 0) {
						this.setState({
							has_history_request: true,
							dataSourceHistory: [...this.state.dataSourceHistory, ...results.data],
							isLoadingHistory: false,
							isLoading: false,
							pageHistory: results.next_page
						})
					} else {
						this.setState({ has_history_request: false, isLoading: false, })
					}
				} else {
					this.setState({
						has_history_request: false,
						isLoading: false,
						isLoadingHistory: false,
					})
				}
				this.setState({
					isLoading: false,
					isLoadingHistory: false
				})
			}

			this.setState({
				isLoading: false
			})
		} catch (error) {
			this.setState({
				isLoading: false,
				isLoadingHistory: false
			})
		}

	}

	/**
	 * Get requests in progress and scheduled
	 */
	getSchedules = async () => {
		if (this.state.pageSchedule > 0) {
			this.setState({ isLoadingSchedule: true })
			var requestsResponse = await this.api.GetMyScheduleRequests(
				this.props.provider._id,
				this.props.provider._token,
				this.state.pageSchedule
			)

			let response = await Promise.resolve(requestsResponse)

			var results = response.data
			if (parse.isSuccess(results, this.returnConstNavigate()) == true) {
				if (results.data.length > 0) {
					for (let i = 0; i < results.data.length; i++) {
						results.data[i].src_address = results.data[
							i
						].src_address.replace(/,/g, "")
					}
					this.setState({
						has_scheduled_request: true,
						dataSourceScheduled: [...this.state.dataSourceScheduled, ...results.data],
						isLoading: false,
						isLoadingSchedule: false,
						pageSchedule: results.next_page
					})
				} else {
					this.setState({
						has_scheduled_request: false, isLoading: false, isLoadingSchedule: false
					})
				}
				this.verifyStatus(results.data)
			} else {
				this.setState({
					has_scheduled_request: false,
					isLoading: false,
					isLoadingSchedule: false
				})
			}

			this.setState({
				isLoading: false,
				isLoadingSchedule: false
			})
		}
	}

	/**
	 * Verify the missing states of the in progress request
	 * @param {Object} requestsInProgress
	 */
	verifyStatus = requestsInProgress => {
		var status = [];

		for (let i = 0; i < requestsInProgress.length; i++) {
			if (requestsInProgress[i].is_cancelled != 0) {
				if (requestsInProgress[i].is_provider_started != 1) {
					status.push(strings("requestStatus.ISNT_PROVIDER_ARRIVED"));
				} else if (requestsInProgress[i].is_provider_arrived != 1) {
					status.push(strings("requestStatus.ISNT_PROVIDER_ARRIVED"));
				} else if (
					requestsInProgress[i].is_request_started != 1 ||
					requestsInProgress[i].is_completed != 1
				) {
					status.push(strings("requestStatus.ISNT_REQUEST_COMPLETED"));
				} else if (requestsInProgress[i].is_provider_rated != 1) {
					status.push(strings("requestStatus.DO_PROVIDERS_RATING"));
				}
			}
		}
		this.setState({ status: status });
	};

	/**
	 * Check Request Status Received on Socket and update user aplication
	 * if change the screen (resquestInProgress / Main / Invoice) unsubscribe from socket
	 */
	requestStatus() {
		if (this.request != null) {
			let status = this.request.checkRequestStatus();

			switch (status) {
				case constants.IS_REQUEST_CREATED:
					break;

				case constants.PROVIDER_ACCEPTED_JOB:
					this.showAlertRequestStatus(
						strings("requestStatus.PROVIDER_ACCEPTED_JOB")
					);
					break;

				case constants.IS_PROVIDER_STARTED:
					this.showAlertRequestStatus(
						strings("requestStatus.IS_PROVIDER_STARTED")
					);
					break;

				case constants.IS_PROVIDER_ARRIVED:
					this.showAlertRequestStatus(
						strings("requestStatus.IS_PROVIDER_ARRIVED")
					);
					break;

				case constants.IS_REQUEST_STARTED:
					this.showAlertRequestStatus(
						strings("requestStatus.IS_REQUEST_STARTED")
					);
					break;

				case constants.IS_REQUEST_COMPLETED:
					this.showAlertRequestStatus(
						strings("requestStatus.IS_REQUEST_COMPLETED")
					);
					this.unsubscribeSocket();
					this.navigateToScreen("InvoiceScreen");
					break;

				case constants.IS_PROVIDER_REFUSED:
					parse.showToast(
						strings("searchProvider.message_toast"),
						Toast.durations.SHORT
					);
					break;

				case constants.IS_REQUEST_CANCELED:
					parse.showToast(
						strings("requests.request_cancelled_toast"),
						Toast.durations.SHORT
					);
				case constants.IS_PROVIDER_RATED:
				case constants.NO_REQUEST:
					this.unsubscribeSocket();
					this.request.clearModel();
					this.request.store(constants.REQUEST_MODEL_STORAGE);
					this.navigateToScreen("MainScreen");
					break;

				default:
					break;
			}
		}
	}


	/**
	 * Navigate to another Screen.
	 * @param {string} screen
	 * @param {number} providerID
	 * @param {string} image
	 */
	navigateToScreen(screen) {
		const { navigate } = this.props.navigation
		navigate(screen)
	}

	/**
	 * Send data to a Screen, for see scheduled request
	 * @param {Object} request
	 */
	sendDataToScheduledRequest(item) {
		this.props.changeMyRequestView(item)
		this.props.navigation.navigate('ScheduleDetailScreen')
	}

	/**
	 * Verify if is provider rated
	 * @param {Object} item
	 */
	verifyIfIsProviderRated(item) {
		this.props.changeMyRequestView(item)
		this.props.navigation.navigate('MyRequestDetail')
	}

	checkHistoryStatus(statusNumber, isCancelled = 0) {
		if (isCancelled == 1)
			return strings("requests.request_cancelled");

		let statusString = strings("requests.request_in_progress")

		if (statusNumber == 0) {
			statusString = strings("requests.request_cancelled")
		}
		else if (statusNumber == 1) {
			statusString = strings("requests.request_completed")
		}
		else if (statusNumber == 3) {
			statusString = strings("requests.request_concluded")
		}
		else if (statusNumber == 4) {
			statusString = strings("requests.request_no_provider")
		}
		else if (statusNumber == 5) {
			statusString = strings("requests.request_in_progress")
		}

		return statusString
	}

	/**
	 * Checa a cor para o status da corrida
	 * @param {*} item
	 * @returns
	 */
	checkHistoryStatusColor(item) {
		try {
			let color = projectColors.green;

			if (item.is_cancelled == 1)
				color = projectColors.red;
			else if (item.is_completed == 1)
				color = PrimaryButton;
			else if (item.is_cancelled == 0 && item.is_completed == 0)
				color = projectColors.blueGrey;

			return color;
		} catch (error) {
			return projectColors.green;
		}
	}

	renderFooter = (type) => {
		if (type == 'history') {
			if (!this.state.isLoadingHistory) return null
			return (
				<View style={styles.loading}>
					<ActivityIndicator animating />
				</View>
			)
		} else {
			if (!this.state.isLoadingSchedule) return null
			return (
				<View style={styles.loading}>
					<ActivityIndicator animating />
				</View>
			)
		}
	}

	render() {
		const BlankStateBox = () => (
			<View style={styles.areaBlankState}>
				<Image
					source={Images.blank_state}
					style={styles.imgBlankState}
				/>
				<Text style={styles.txtBlankState}>
					{strings("requests.blank_state_message")}
				</Text>
			</View>
		)

		const FirstRoute = () => (
			<View style={{ marginTop: 10 }}>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={this.state.dataSourceHistory}
					onEndReached={() => this.getRequests()}
					onEndReachedThreshold={0.1}
					ListFooterComponent={() => this.renderFooter('history')}
					keyExtractor={(x, i) => i.toString()}

					renderItem={({ item }) => (
						<TouchableOpacity style={styles.btnRequestItem}
							onPress={() => this.verifyIfIsProviderRated(item)}
						>
							<Text style={{
								fontFamily: 'Roboto',
								marginTop: 8,
								marginLeft: 10,
								color: this.checkHistoryStatusColor(item)
							}}>
								{this.checkHistoryStatus(item.status, item.is_cancelled)}
							</Text>
							<View style={styles.boxInformation}>

								<View style={styles.infoFirst}>
									{item.start_time !== '0000-00-00 00:00:00' ? (
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Image style={{ marginLeft: 10 }} source={images.event} height={20} width={20} />
											<Text style={styles.infoTime}>{item.start_time}</Text>
										</View>
									) : null}
									<View style={styles.contCustomer}>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Image source={{ uri: item.user_picture }} />
											<Text style={styles.infoCustomer}>{item.user_full_name}</Text>
										</View>
										<Text style={styles.textValue}>{item.total}</Text>
									</View>

									<View style={styles.infoService}>
										<Text style={styles.labelService} >{strings('serviceInProgress.Service')}:</Text>
										<Text style={styles.textService}>{item.type_name}</Text>
									</View>
								</View>

								<View style={styles.infoSecond}>
									<View>
										<Image source={images.distance_points} />
									</View>
									<View style={{ marginRight: 20, marginLeft: 10 }}>
										<View style={styles.boxSrcAddr}>
											<Text style={styles.infoAddress}>{item.src_address}</Text>
										</View>
										<View style={styles.boxDestAddr}>
											<Text style={styles.infoAddress}>{item.dest_address}</Text>
										</View>
									</View>
								</View>
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		)

		const SecondRoute = () => (
			<View style={{ marginTop: 10 }}>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={this.state.dataSourceScheduled}
					style={{
						paddingBottom: 150
					}}
					onEndReached={() => this.getSchedules()}
					onEndReachedThreshold={0.1}
					ListFooterComponent={() => this.renderFooter()}
					keyExtractor={(x, i) => i.toString()}
					renderItem={({ item, index }) => (
						<TouchableOpacity style={styles.btnRequestItem}
							onPress={() => this.sendDataToScheduledRequest(item)}
						>
							<View style={styles.boxInformation}>
								<View style={styles.infoFirst}>

									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Image style={{ marginLeft: 10 }} source={images.event} height={20} width={20} />
										<Text style={styles.infoTime}>{item.start_time}</Text>
									</View>

									<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>

										{item.user_picture ? (
											<Avatar
												size='small'
												rounded
												source={{ uri: item.user_picture }}
												containerStyle={{ marginLeft: 10 }}
											/>
										) : (
											<Image style={{ marginLeft: 10 }} source={images.customer} />
										)}

										<Text style={styles.infoCustomer}>{item.user_full_name}</Text>
									</View>

									<View style={styles.infoService}>
										<Text style={styles.labelService} >{strings('serviceInProgress.Service')}:</Text>
										<Text style={styles.textService}>{item.type_name}</Text>
									</View>
								</View>

								<View style={styles.infoSecond}>
									<View>
										<Image source={images.distance_points} />
									</View>
									<View style={{ marginRight: 20, marginLeft: 10 }}>
										<View style={styles.boxSrcAddr}>
											<Text style={styles.infoAddress}>{item.src_address}</Text>
										</View>
										<View style={styles.boxDestAddr}>
											<Text style={styles.infoAddress}>{item.dest_address}</Text>
										</View>
									</View>
								</View>

							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		)

		this.firstView = BlankStateBox
		this.secondView = BlankStateBox

		if (!this.state.has_history_request && this.state.dataSourceHistory.length <= 0) {
			this.firstView = BlankStateBox
		} else {
			this.firstView = FirstRoute
		}

		if (!this.state.has_scheduled_request && this.state.dataSourceScheduled.length <= 0) {
			this.secondView = BlankStateBox
		} else {
			this.secondView = SecondRoute
		}
		return (
			<View style={styles.parentContainer}>
        <DefaultHeader
          loading={this.state.isLoading}
          loadingMsg={strings("load.Loading")}
          btnBackListener={() => this.props.navigation.goBack()}
          title={strings('requests.myRequests')}
        />

        <SegmentedControlTab
          values={[strings('requests.completed'), strings('requests.scheduled')]}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
          activeTabStyle={{backgroundColor: 'transparent', borderWidth: 2, borderBottomColor: PrimaryButton}}
          tabStyle={{borderColor: 'transparent'}}
          tabTextStyle={{ color: 'grey', opacity: 0.4, fontSize: 15 }}
          activeTabTextStyle={{color: 'black', opacity: 1, fontSize: 15}}
        />

				<View style={styles.screen}>
          {this.state.selectedIndex === 0 ? this.firstView(): this.secondView()}
				</View>
			</View>
		)
	}
}

const mapStateToProps = state => (
	{
		provider: state.providerProfile.providerProfile
	}
)

const mapDispatchToProps = dispatch => (
	{
		changeMyRequestView: values => dispatch(changeMyRequestView(values))
	}
)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MyRequestsScreen)
