// Modules
import React, { Component } from 'react'
import { View, Text, AppState, ScrollView, Image, Dimensions} from 'react-native'
import { connect } from "react-redux";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationActions, StackActions } from "react-navigation";

//Transactions component
import PixQrCode  from "react-native-finance/src/PixQrCode";

// Locales
import i18n from "../../Locales/i18n";

// Util
import * as constants from "../../Util/Constants";

// Store
import { setBill } from "../../Store/actions/request";

// Styles
import styles from "./styles"

// Themes
import { Images } from '../../Themes';
import { BootstrapColors } from '../../Themes/WhiteLabelTheme/WhiteLabel';

class PixQrCodeScreen extends Component {
    constructor(props) {
    super(props);

		this.state = {
			appUrl: this.getFormattedUrl(),
			appState: AppState.currentState,
			callRetrieve: 0
		};
	}

	componentDidMount() {
		this.appStateSubscription = AppState.addEventListener("change", nextAppState => {
			if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
					this.setState({ callRetrieve: this.state.callRetrieve+1 });
				}
				this.setState({ appState: nextAppState });
			}
		);
	}

	componentWillUnmount() {
		if(this.appStateSubscription) {
			this.appStateSubscription.remove();
		}
	}

	pixScreenRequest(navigation, provider) {
		return (
			<View style={{flex: 1}}>
				<ScrollView style={styles.parentFullContainer} keyboardShouldPersistTaps="handled">
					<PixQrCode
						id={provider._id}
						token={provider._token}
						type="provider"
						request_id={navigation.state.params.request_id}
						lang={i18n.locale}
						appUrl={this.state.appUrl}
						navigation={navigation}
						socket_url={constants.SOCKET_URL}
						onPaid={this.isPaid.bind(this)}
						onPaymentChange={this.changePayment.bind(this)}
						callRetrieve={this.state.callRetrieve}
					/>
				</ScrollView>
			</View>
		);
	}

	pixScreenTransaction(navigation, provider, transactionId) {
		return (
			<View style={{flex: 1}}>
				<ScrollView style={styles.parentFullContainer} keyboardShouldPersistTaps="handled">
					<PixQrCode
						id={provider._id}
						token={provider._token}
						type="provider"
						request_id={null}
						pix_transaction_id={transactionId}
						lang={i18n.locale}
						appUrl={this.state.appUrl}
						navigation={navigation}
						socket_url={constants.SOCKET_URL}
						onPaid={this.isPaid.bind(this)}
						onPaymentChange={this.changePayment.bind(this)}
						callRetrieve={this.state.callRetrieve}
					/>
				</ScrollView>
			</View>
		);
	}

	noPixScreen(navigation) {
		return (
			<View style={{display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
				<Image
					source={Images.icon_warning}
					resizeMode='contain'
					style={{ width: 200, height: 200, aspectRatio: 1, marginBottom: 10}}
				/>
				<Text style={{fontSize: 22, fontWeight: 'bold'}}>Oops!</Text>
				<Text>Não conseguimos gerar o QRCode!</Text>
				<TouchableOpacity
				style={{width: Dimensions.get('screen').width / 2, marginTop: 10, padding: 10, borderRadius: 5,  backgroundColor: BootstrapColors.primary}}
				onPress={() => navigation.goBack()}
				>
					<Text style={{color: '#FFF', textAlign: 'center'}}>Voltar</Text>
				</TouchableOpacity>
			</View>
		)
	}

	getFormattedUrl() {
		var fullUrl = constants.BASE_URL;

		var newUrl = fullUrl.replace("/api/v1", "");

		return newUrl;
	}

	isPaid() {
		let routeName = "InvoiceScreen";
		if(!this.props.navigation.state.params.request_id) {
			routeName = "SubscriptionDetailsScreen";
		}
        this.props.navigation.dispatch(
			StackActions.reset({
				index: 0,
				key: null,
				actions: [
				NavigationActions.navigate({
					routeName,
					params: {
						provider: this.props.providerProfile,
						request_id: this.props.navigation.state.params.request_id
					}
				})
				]
			})
        );
	}

	changePayment(bill) {
		this.props.onSetBill(bill);
        this.props.navigation.dispatch(
			StackActions.reset({
				index: 0,
				key: null,
				actions: [
				NavigationActions.navigate({
					routeName: "InvoiceScreen",
					params: {
						provider: this.props.providerProfile,
						request_id: this.props.navigation.state.params.request_id
					}
				})
				]
			})
        );
	}

	render() {
		const { provider, navigation} = this.props;
		const transaction_id  = navigation.state?.params?.params?.transaction_id;
		const isAuth = provider._id && provider._token;

		if( isAuth && this.state.appUrl && navigation.state.params.request_id) {
			return this.pixScreenRequest(navigation, provider);
		} else if(isAuth && transaction_id) {
			return this.pixScreenTransaction(navigation, provider, transaction_id);
		} else {
			return this.noPixScreen(navigation);
		}
	}
}


const mapStateToProps = state => (
    {
		provider: state.providerProfile.providerProfile,
		request: state.request,
		bill: state.request.bill
    }
);

const mapDispatchToProps = dispatch => (
    {
		onSetBill: bill => dispatch(setBill(bill))
    }
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PixQrCodeScreen);
