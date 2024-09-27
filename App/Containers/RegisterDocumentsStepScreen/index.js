// Modules
import React, { Component } from 'react'
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity,Platform, SafeAreaView } from 'react-native';
import moment from "moment"
import Toast from "react-native-root-toast"
import { connect } from "react-redux"
import { Divider } from 'react-native-elements'

// Components
import ListDocuments from '../../Components/ListDocuments'
import ListAditionalInfoDocuments from '../../Components/ListDocuments/aditionalInfo'
import DefaultHeader from '../../Components/DefaultHeader';

// Locales
import { strings } from "../../Locales/i18n"

// Services
import ProviderApi from "../../Services/Api/ProviderApi"
import ProviderApiFormData from "../../Services/Api/ProviderApiFormData"
import {handlerException} from '../../Services/Exception';

// Store
import { getDocs, changeAddProviderDocs } from '../../Store/actions/actionRegister';

// Themes
import images from "../../Themes/WhiteLabelTheme/Images"
import { BootstrapColors, textButton } from '../../Themes/WhiteLabelTheme/WhiteLabel';

// Util
import * as constants from '../../Util/Constants';
import * as parse from "../../Util/Parse"

//Styles
import styles from "./styles"
class RegisterDocumentsStepScreen extends Component {
	constructor() {
		super()
		this.state = {
			isLoading: false
		},
			this.api = new ProviderApi()
		this.apiFormData = new ProviderApiFormData()
	}

	componentDidMount() {
		if (this.props.addDocs && this.props.addDocs.length > 0) {
			let arrayAux = this.props.addDocs
			for (let i = 0; i < arrayAux.length; i++) {
				if (arrayAux[i].document_url) {
					arrayAux[i].uploaded = true
					if (arrayAux[i].date_validity) {
						arrayAux[i].date_validity = moment(arrayAux[i].date_validity).format("DD/MM/YYYY")
					}
				} else {
					arrayAux[i].uploaded = false
				}
			}
			this.props.getDocs(arrayAux)
			this.setState({ isLoading: false })
		} else {
			this.api.RegisterGetDocs(this.props.addProviderId)
				.then(response => {
					var responseJson = response.data
					let arrayAux = responseJson.documents
					for (let i = 0; i < arrayAux.length; i++) {
						arrayAux[i].uploaded = false
					}
					this.props.getDocs(arrayAux)
					this.setState({ isLoading: false })
				})
				.catch(error => {
					parse.showToast(strings("error.try_again"), Toast.durations.LONG)
					this.setState({ isLoading: false })
				})
		}

	}

	async nextScreen() {
		try {
			if (this.props.settings.aditional_info_documents) {
				this.setState({ isLoading: true })

				const response = await this.apiFormData.RegisterAditionalDocsProvider(this.props)
				if (!response.data.success) {
					parse.showToast(response.data.error_messages.join('\n'), Toast.durations.LONG)
					this.setState({ isLoading: false })
					return
				}
			}

			if (this.props.addDocsSaved) {
				console.log('this.props.settings.is_register_payment_screen_enabled: ', this.props.settings.is_register_payment_screen_enabled);
				if (this.props.settings.is_register_payment_screen_enabled != 1) {

					if (this.props.settings.is_app_select_theme_enabled && constants.APP_THEME_ENABLED) {
						this.props.navigation.navigate('ThemeSelectorScreen', {
							url: constants.BASE_URL,
							is_register: true,
							type: 'provider',
							id: this.props.providerProfile._id,
							token: this.props.providerProfile._token,
							navigateAfterConfirm: 'RegisterFinishedScreen'
						});
					} else {
						this.props.navigation.navigate('RegisterFinishedScreen');
					}

				} else {
					this.props.navigation.navigate('SubscriptionScreen', {
						screen: 'RegisterDocumentsStepScreen',
						routeBack: 'RegisterDocumentsStepScreen',
						is_change: false,
						provider: this.props.providerProfile,
						route: constants.BASE_URL,
						themeColor: BootstrapColors.primary,
						buttonTextColor: textButton,
						routeAPI: constants.API_VERSION,
						isContainerPaymentType: true,
						checkedPaymentForm: false
					})
				}
			} else {
				parse.showToast(strings("register_step5.upload_all_photos_required_documents"), Toast.durations.SHORT)
			}
		} catch (error) {
			handlerException('RegisterBasicStepScreen.nextScreen', error);
		} finally {
			this.setState({ isLoading: false })
    }
	}

  	render() {
		return (
			<SafeAreaView style={{ flex: 1 }} >
				<ScrollView style={styles.container}>
          <DefaultHeader
            loading={this.state.isLoading}
            loadingMsg={strings("register.creating-provider")}
            btnBack={true}
            btnBackListener={() => this.props.navigation.navigate('RegisterBankStepScreen')}
            btnNext={this.props.servicesFilled}
            btnNextListener={() => this.props.navigation.navigate('RegisterVehicleStepScreen')}
            title={strings('profileProvider.sendDocuments')}
          />
					<Image source={images.cloud_upload} style={styles.cloudImage} />
					<View style={styles.containerTitle}>
						<FlatList
							style={{ marginBottom: 30 }}
							data={this.props.docs}
							showsVerticalScrollIndicator={true}
							keyExtractor={item => `${item.id}`}
							renderItem={({ item }) => (
								<ListDocuments key={item.id} {...item} />
							)}>
						</FlatList>

						<Divider style={styles.divider} />

						{this.props.settings.aditional_info_documents &&
							<ListAditionalInfoDocuments key='aditional' {...this.props.docs} />
						}
					</View>
					<TouchableOpacity
						style={styles.buttonRegister}
						onPress={() => this.nextScreen()}
					>
						<Text style={styles.txtButtonRegister}>
							{strings("register.final_step")}
						</Text>
					</TouchableOpacity>
				</ScrollView>
			</SafeAreaView>
		)
	}
}


const mapStateToProps = state => (
	{
		addProviderId: state.registerReducer.addProviderId,
		docs: state.registerReducer.docs,
		addDocs: state.registerReducer.addDocs,
		addDocsSaved: state.registerReducer.addDocsSaved,
		settings: state.settingsReducer.settings,
		providerProfile: state.providerProfile.providerProfile,
    	form: state.registerReducer.form
	}
)

const mapDispatchToProps = dispatch => (
	{
		uploadcriminal: (value) => dispatch(uploadcriminal(value)),
		uploadCnh: (value) => dispatch(uploadCnh(value)),
		uploadInsurance: (value) => dispatch(uploadInsurance(value)),
		registerStep: value => dispatch(registerStep(value)),
		getDocs: values => dispatch(getDocs(values)),
		changeAddProviderDocs: values => dispatch(changeAddProviderDocs(values)),
    onAditionalDocs: (value)  => dispatch(aditionalInfoDocuments(value))
	}
)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterDocumentsStepScreen);
