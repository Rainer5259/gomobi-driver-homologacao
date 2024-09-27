// Modules
import React, {Component} from 'react';
import {
	View,
	Text,
	TextInput,
	BackHandler,
	Image,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
	Alert,
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-root-toast';
import MapView,{Marker} from 'react-native-maps';
import {Avatar, Divider, Rating, Overlay} from 'react-native-elements';

// Components
import Directions from '../../Components/Directions';
import DefaultHeader from '../../Components/DefaultHeader';

// Helpers
import {getPixelRatio} from '../../Helpers/HandlerPixel';

// Locales
import {strings} from '../../Locales/i18n';

//Services
import ProviderApi from '../../Services/Api/ProviderApi';

// Themes
import images from '../../Themes/WhiteLabelTheme/Images';

// Util
import * as parse from '../../Util/Parse';

import {
	projectColors,
	PrimaryButton,
} from '../../Themes/WhiteLabelTheme/WhiteLabel';

import {connect} from 'react-redux';

// Styles
import styles from './styles';
class ScheduleDetailScreen extends Component {
	constructor(props) {
		super(props);
		this.api = new ProviderApi();
		this.state = {
			isLoading: false,
			overlayVisible: false,
			note: '',
			activityLoadingConfirm: false,
			activityLoadingReject: false,
		};
	}

	returnConstNavigate() {
		const {navigate} = this.props.navigation;
		return navigate;
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			() => {
				this.props.navigation.goBack();
				return true;
			}
		);
	}

	componentWillUnmount() {
		this.backHandler.remove();
	}

	showTravel() {
		if (this.mapViewMain) {
			this.mapViewMain.fitToCoordinates(
				[
					{
						latitude: this.props.myRequestsView.latitude,
						longitude: this.props.myRequestsView.longitude,
						latitudeDelta: 0.0143,
						longitudeDelta: 0.0134,
					},
					{
						latitude: this.props.myRequestsView.dest_latitude,
						longitude: this.props.myRequestsView.dest_longitude,
						latitudeDelta: 0.0143,
						longitudeDelta: 0.0134,
					},
				],
				{
					edgePadding: {
						top: getPixelRatio(20),
						bottom: getPixelRatio(20),
						right: getPixelRatio(20),
						left: getPixelRatio(20),
					},
					animated: false,
				}
			);
		}
	}

	notifyConfirm() {
		Alert.alert(
			'Aviso',
			'Deseja aceitar o agendamento?',
			[
				{
					text: strings('general.no_tinny'),
					onPress: () => function () {},
					style: 'cancel',
				},
				{
					text: strings('general.yes_tinny'),
					onPress: () => this.confirmSchedule(),
				},
			],
			{cancelable: true}
		);
	}

	async confirmSchedule() {
		this.setState({activityLoadingConfirm: true});
		try {
			let response = await this.api.ConfirmScheduled(
				this.props.provider._id,
				this.props.provider._token,
				this.props.myRequestsView.id
			);

			this.setState({activityLoadingConfirm: false});
			let responseJson = response.data;
			if (responseJson.success == true) {
				parse.showToast(
					strings('requests.confirmedSchedule'),
					Toast.durations.LONG
				);
				this.props.navigation.goBack();
			} else {
				parse.showToast(
					strings('error.try_again'),
					Toast.durations.LONG
				);
			}
		} catch (error) {
			parse.showToast(strings('error.try_again'), Toast.durations.LONG);
			this.setState({activityLoadingConfirm: false});
		}
	}

	rejectSchedule() {
		this.setState({overlayVisible: true});
	}

	async confirmReject() {
		this.setState({activityLoadingReject: true});
		try {
			let response = await this.api.CancelScheduled(
				this.props.provider._id,
				this.props.provider._token,
				this.props.myRequestsView.id,
				this.state.note
			);

			this.setState({activityLoadingReject: false});
			let responseJson = response.data;
			if (responseJson.success == true) {
				parse.showToast(
					strings('requests.scheduleRejected'),
					Toast.durations.LONG
				);
				this.props.navigation.goBack();
			} else {
				parse.showToast(
					strings('error.try_again'),
					Toast.durations.LONG
				);
			}
		} catch (error) {
			parse.showToast(strings('error.try_again'), Toast.durations.LONG);
			this.setState({activityLoadingReject: false});
		}

		this.setState({overlayVisible: false});
	}

	render() {
		let paymentMethod = '';
		let paymentIcon = images.credit_card;

		if (this.props.myRequestsView.payment_mode == 0) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_card'] == ''
					? strings('invoice.card')
					: this.props.payment_nomenclatures['name_payment_card'];
		} else if (this.props.myRequestsView.payment_mode == 1) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_money'] == ''
					? strings('invoice.money')
					: this.props.payment_nomenclatures['name_payment_money'];
			paymentIcon = images.wallet;
		} else if (this.props.myRequestsView.payment_mode == 2) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_carto'] == ''
					? strings('invoice.carto')
					: this.props.payment_nomenclatures['name_payment_carto'];
			paymentIcon = images.monetization;
		} else if (this.props.myRequestsView.payment_mode == 3) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_machine'] == ''
					? strings('invoice.machine')
					: this.props.payment_nomenclatures['name_payment_machine'];
		} else if (this.props.myRequestsView.payment_mode == 4) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_crypt'] == ''
					? strings('requests.cryptCoin')
					: this.props.payment_nomenclatures['name_payment_crypt'];
		} else if (this.props.myRequestsView.payment_mode == 6) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_debitCard'] == ''
					? strings('requests.debit')
					: this.props.payment_nomenclatures[
							'name_payment_debitCard'
					  ];
		} else if (this.props.myRequestsView.payment_mode == 7) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_balance'] == ''
					? strings('requests.balancePayment')
					: this.props.payment_nomenclatures['name_payment_balance'];
			paymentIcon = images.payment_balance;
		} else if (this.props.myRequestsView.payment_mode == 8) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_billing'] == ''
					? strings('requests.billingPayment')
					: this.props.payment_nomenclatures['name_payment_billing'];
		}

		return (
			<View style={styles.parentContainer}>
        <DefaultHeader
          loading={this.state.isLoading}
          loadingMsg={strings('load.Loading')}
          btnBack={true}
          btnBackListener={() => this.props.navigation.goBack()}
          title={strings('requests.scheduleDetail')}
        />

				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.card}>
						<View style={styles.contMap}>
							<Text>
								{moment(
									this.props.myRequestsView.start_time
								).format('DD/MM/YYYY')}
							</Text>
							{/*<Text>{this.props.myRequestsView.start_time}</Text>*/}
							<MapView
								style={styles.map}
								loadingEnabled
								showsUserLocation={false}
								followsUserLocation={false}
								zoomEnabled={false}
								ref={(el) => (this.mapViewMain = el)}
								onLayout={() => this.showTravel()}>
								<Marker
									image={images.origin}
									coordinate={{
										latitude:
											this.props.myRequestsView.latitude,
										longitude:
											this.props.myRequestsView.longitude,
									}}
									anchor={{x: 0.5, y: 0.5}}
								/>

								<Marker
									image={images.destiny}
									coordinate={{
										latitude:
											this.props.myRequestsView
												.dest_latitude,
										longitude:
											this.props.myRequestsView
												.dest_longitude,
									}}
									anchor={{x: 0.5, y: 0.7}}
								/>

								<Directions
									origin={{
										latitude:
											this.props.myRequestsView.latitude,
										longitude:
											this.props.myRequestsView.longitude,
										latitudeDelta: 0.0143,
										longitudeDelta: 0.0134,
									}}
									destination={{
										latitude:
											this.props.myRequestsView
												.dest_latitude,
										longitude:
											this.props.myRequestsView
												.dest_longitude,
										latitudeDelta: 0.0143,
										longitudeDelta: 0.0134,
									}}
									strokeColor={PrimaryButton}
									lineDashPattern={null}
								/>
							</MapView>
						</View>

						<View style={styles.contInfoCustomer}>
							{this.props.myRequestsView.institution_name !==
							null ? (
								<View>
									<Text
										style={{
											fontFamily: 'Roboto',
											fontSize: 14,
											marginBottom: 8,
											color: projectColors.gray,
										}}>
										{strings('requests.corporateRide')}
									</Text>
									<View style={{flexDirection: 'row'}}>
										<View>
											{this.props.myRequestsView
												.institution_logo ? (
												<Avatar
													size="medium"
													rounded
													source={{
														uri: this.props
															.myRequestsView
															.institution_logo,
													}}
												/>
											) : (
												<Avatar
													size="medium"
													rounded
													icon={{
														name: 'user',
														type: 'font-awesome',
														color: projectColors.secondaryWhite,
													}}
													containerStyle={
														styles.contAvatar
													}
												/>
											)}
										</View>

										<View
											style={{
												marginLeft: 10,
												marginTop: 6,
											}}>
											<Text style={styles.txtCustName}>
												{
													this.props.myRequestsView
														.institution_name
												}
											</Text>
											<Text style={styles.txtCustName}>
												{
													this.props.myRequestsView
														.user_full_name
												}
											</Text>
											<View style={styles.contRating}>
												<Rating
													imageSize={10}
													fractions={1}
													readonly
													startingValue={
														this.props
															.myRequestsView
															.user_rated
													}
													style={{marginTop: 3}}
													ratingCount={5}
												/>
											</View>
										</View>
									</View>
								</View>
							) : (
								<View style={{flexDirection: 'row'}}>
									<View>
										{this.props.myRequestsView
											.user_picture ? (
											<Avatar
												size="medium"
												rounded
												source={{
													uri: this.props
														.myRequestsView
														.user_picture,
												}}
											/>
										) : (
											<Avatar
												size="medium"
												rounded
												icon={{
													name: 'user',
													type: 'font-awesome',
													color: projectColors.secondaryWhite,
												}}
												containerStyle={
													styles.contAvatar
												}
											/>
										)}
									</View>

									<View
										style={{marginLeft: 10, marginTop: 6}}>
										<Text style={styles.txtCustName}>
											{
												this.props.myRequestsView
													.user_full_name
											}
										</Text>
										<View style={styles.contRating}>
											<Rating
												imageSize={10}
												fractions={1}
												readonly
												startingValue={
													this.props.myRequestsView
														.user_rated
												}
												style={{marginTop: 3}}
												ratingCount={5}
											/>
										</View>
									</View>
								</View>
							)}
						</View>

						<View style={styles.infoService}>
							<Text style={styles.labelService}>
								{strings('serviceInProgress.Service')}:
							</Text>
							<Text style={styles.textService}>
								{this.props.myRequestsView.type_name}
							</Text>
						</View>

						<View style={styles.infoSecond}>
							<View>
								<Image source={images.distance_points} />
							</View>
							<View style={styles.contLoc}>
								<View style={styles.boxSrcAddr}>
									<Text style={styles.labelService}>
										{strings('requests.of')}:
									</Text>
									<Text style={styles.infoAddress}>
										{this.props.myRequestsView.src_address}
									</Text>
								</View>
								<View style={styles.boxDestAddr}>
									<Text style={styles.labelService}>
										{strings('requests.until')}:
									</Text>
									<Text style={styles.infoAddress}>
										{this.props.myRequestsView.dest_address}
									</Text>
								</View>
							</View>
						</View>

						<Divider style={styles.divider} />
						<View style={styles.contPaymentAddrss}>
							<View>
								<View style={styles.boxSrcAddr}>
									<Text style={styles.labelService}>
										{strings('requests.scheduleDate')}:
									</Text>
									<Text style={styles.infoAddress}>
										{moment(
											this.props.myRequestsView.start_time
										).format('HH:mm')}
									</Text>
									{/*<Text style={styles.infoAddress}>{this.props.myRequestsView.start_time}</Text>*/}
								</View>
							</View>

							<View style={styles.contPayment}>
								<Text style={styles.txtPayment}>
									{paymentMethod}
								</Text>
								<Image
									style={styles.iconPayment}
									source={paymentIcon}
								/>
							</View>
						</View>

						<Divider style={styles.divider} />

						{this.props.myRequestsView.provider_id !==
						this.props.provider._id ? (
							<View>
								{this.state.activityLoadingConfirm ? (
									<View
										style={[
											styles.viewConfirm,
											{backgroundColor: PrimaryButton},
										]}>
										<ActivityIndicator
											color="#ffffff"
											size="large"
										/>
									</View>
								) : (
									<TouchableOpacity
										style={[
											styles.btnConfirm,
											{backgroundColor: PrimaryButton},
										]}
										onPress={() => this.notifyConfirm()}>
										<Text style={styles.txtHelp}>
											{strings(
												'requests.confirmSchedule'
											)}
										</Text>
									</TouchableOpacity>
								)}
							</View>
						) : (
							<TouchableOpacity
								style={[
									styles.btnConfirm,
									{backgroundColor: projectColors.red},
								]}
								onPress={() => this.rejectSchedule()}>
								<Text style={styles.txtHelp}>
									{strings('requests.rejectSchedule')}
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</ScrollView>
				<Overlay
					overlayStyle={{width: '80%'}}
					isVisible={this.state.overlayVisible}
					onBackdropPress={() =>
						this.setState({overlayVisible: false})
					}>
					<View>
						<Text style={styles.textService}>
							{strings('requests.rejectReason')}
						</Text>
						<TextInput
							style={styles.inputNote}
							multiline={true}
							numberOfLines={4}
							onChangeText={(text) => this.setState({note: text})}
							value={this.state.note}
						/>
						{this.state.activityLoadingReject ? (
							<View style={styles.btnNote}>
								<ActivityIndicator
									color="#ffffff"
									size="large"
								/>
							</View>
						) : (
							<TouchableOpacity
								style={styles.btnNote}
								onPress={() => this.confirmReject()}>
								<Text style={styles.txtSend}>
									{strings('serviceFinished.submit')}
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</Overlay>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	myRequestsView: state.requestsReducer.myRequestsView,
	provider: state.providerProfile.providerProfile,
	payment_nomenclatures: state.settingsReducer.payment_nomenclatures,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ScheduleDetailScreen);
