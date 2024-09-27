// Modules
import React, {Component} from 'react';
import {
	View,
	Text,
	BackHandler,
	Image,
	ScrollView,
} from 'react-native';
import moment from 'moment';
import HelpButton from 'react-native-chat/src/components/HelpButton';
import MapView, {Marker} from 'react-native-maps';
import {connect} from 'react-redux';
import {Avatar, Divider, Rating} from 'react-native-elements';

// Components
import Directions from '../../Components/Directions';

// Helpers
import {getPixelRatio} from '../../Helpers/HandlerPixel';

// Service
import {strings} from '../../Locales/i18n';

// Themes
import images from '../../Themes/WhiteLabelTheme/Images';
import {
	projectColors,
	PrimaryButton,
} from '../../Themes/WhiteLabelTheme/WhiteLabel';

// Util
import * as constants from '../../Util/Constants';

//Services
import ProviderApi from '../../Services/Api/ProviderApi';

// Styles
import styles from './styles';
import DefaultHeader from '../../Components/DefaultHeader';
import Button from '../../Components/RoundedButton';
class MyRequestDetail extends Component {
	constructor(props) {
		super(props);
		this.api = new ProviderApi();
		this.state = {
			isLoading: false,
			financeReason: null,
		};

		this.willFocus = this.props.navigation.addListener("willFocus", () => {
			if(this.props.settings.is_cleaning_fee_enabled){
				this.checkCleaningFee();
			}
		});
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
				this.props.myRequestsView.source_to_destination,
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

	async checkCleaningFee() {
		this.setState({ isLoading: true });

		await this.api.CheckCleaningFee(
			this.props.provider._id,
            this.props.provider._token,
			this.props.myRequestsView.id
			)
			.then((response) => {
			  let responseJson = response.data;

			  if (responseJson.success && responseJson.finance_reason) {

				  this.setState({ financeReason: responseJson.finance_reason });
				  this.setState({ isLoading: false });

			  } else {
				this.setState({ financeReason: null });
				this.setState({ isLoading: false });
			  }
			})
			.catch((error) => {
			  this.setState({ financeReason: null });
			  this.setState({ isLoading: false });
			  parse.showToast(strings("error.try_again"), Toast.durations.LONG);
			});
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
					? strings('payment.carto')
					: this.props.payment_nomenclatures['name_payment_carto'];
			paymentIcon = images.monetization;
		} else if (this.props.myRequestsView.payment_mode == 3) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_machine'] == ''
					? strings('payment.machine')
					: this.props.payment_nomenclatures['name_payment_machine'];
		} else if (this.props.myRequestsView.payment_mode == 4) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_crypt'] == ''
					? strings('requests.cryptCoin')
					: this.props.payment_nomenclatures['name_payment_crypt'];
			paymentIcon = images.iconcryptoCurrency;
		} else if (this.props.myRequestsView.payment_mode == 5) {
			paymentMethod = strings('payment.payment_association');
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
		} else if (this.props.myRequestsView.payment_mode == 9) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_gateway_pix'] ==
				''
					? strings('payment.pix')
					: this.props.payment_nomenclatures[
							'name_payment_gateway_pix'
					  ];
			paymentIcon = images.pix;
		} else if (this.props.myRequestsView.payment_mode == 10) {
			paymentMethod =
				this.props.payment_nomenclatures['name_payment_direct_pix'] ==
				''
					? strings('payment.direct_pix')
					: this.props.payment_nomenclatures[
							'name_payment_direct_pix'
					  ];
			paymentIcon = images.pix;
		}

		return (
			<View style={styles.parentContainer}>
        <DefaultHeader
          loading={this.state.isLoading}
          loadingMsg={strings("load.Loading")}
          btnBackListener={() => this.props.navigation.goBack()}
          title={strings('requests.requestDetail')}
        />

				<ScrollView showsVerticalScrollIndicator={false}>
					<View style={styles.card}>
						<View style={styles.contMap}>
							{this.props.myRequestsView.start_time !==
							'0000-00-00 00:00:00' ? (
								<Text>
									{this.props.myRequestsView.start_time}
								</Text>
							) : null}
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
												.D_latitude,
										longitude:
											this.props.myRequestsView
												.D_longitude,
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
												.D_latitude,
										longitude:
											this.props.myRequestsView
												.D_longitude,
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
							<View style={styles.contPrice}>
								<Text style={styles.labelService}>
									{strings('requests.price')}
								</Text>
								<Text style={styles.textValue}>
									{this.props.myRequestsView.total}
								</Text>
							</View>
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
								{this.props.myRequestsView.start_time !==
									'0000-00-00 00:00:00' &&
								this.props.myRequestsView.start_time == 1 ? (
									<View style={styles.boxSrcAddr}>
										<Text style={styles.labelService}>
											{strings('requests.started')}:
										</Text>
										<Text style={styles.infoAddress}>
											{moment(
												this.props.myRequestsView
													.start_time
											).format('HH:mm')}
										</Text>
									</View>
								) : null}
								{this.props.myRequestsView
									.request_finish_time !==
								'0000-00-00 00:00:00' ? (
									<View style={styles.boxSrcAddr}>
										<Text style={styles.labelService}>
											{strings('requests.finished')}:
										</Text>
										<Text style={styles.infoAddress}>
											{moment(
												this.props.myRequestsView
													.request_finish_time
											).format('HH:mm')}
										</Text>
									</View>
								) : null}
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
            {this.props.settings.is_cleaning_fee_enabled &&
              this.props.myRequestsView.is_cancelled !== 1 &&
              !this.state.financeReason &&
              !this.state.isLoading &&
              <View paddingTop={15} paddingHorizontal={20}>
                <Button
                  btnBackListener={() => this.props.navigation.navigate('CleaningFeeScreen')}
                  text={strings('requests.cleaningFee')}
                />
              </View>}

						<View style={styles.boxHelpBtn}>
							<HelpButton
								id={this.props.provider._id}
								token={this.props.provider._token}
								request_id={this.props.myRequestsView.id}
								url={constants.BASE_URL}
								socket_url={constants.SOCKET_URL}
								audio={this.props.audioChatProvider}
							/>
							<Text
								style={{
									flex: 1,
								}}>
								{strings('requests.need_help_msg')}
							</Text>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	myRequestsView: state.requestsReducer.myRequestsView,
	provider: state.providerProfile.providerProfile,
	settings: state.settingsReducer.settings,
	audioChatProvider: state.settingsReducer.audioChatProvider,
	payment_nomenclatures: state.settingsReducer.payment_nomenclatures,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MyRequestDetail);
