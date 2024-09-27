"use strict"

// Modules
import React, { Component } from "react"
import {
	ScrollView,
	Platform,
	View,
	BackHandler,
	Keyboard
} from "react-native"
import moment from "moment"
import Toast from "react-native-root-toast"

// Custom components
import Loader from "../../Components/Loader"
import Toolbar from '../../Components/Toolbar'
import TitleHeader from '../../Components/TitleHeader'
import Button from "../../Components/RoundedButton"

// Locales
import { strings } from "../../Locales/i18n"

// Models
import Provider from '../../Models/Provider'

// Services
import ProviderApi from "../../Services/Api/ProviderApi"
import ProviderApiFormData from "../../Services/Api/ProviderApiFormData"

// Store
import { providerAction } from "../../Store/actions/providerProfile"
import { changeProviderData, changeToken, changeProviderBasic } from '../../Store/actions/actionProvider'

// Themes
import { BootstrapColors, formStructConfig, } from "../../Themes/WhiteLabelTheme/WhiteLabel"

// Redux
import { connect } from "react-redux"

// Utils
import * as parse from "../../Util/Parse"
import * as constants from "../../Util/Constants"

// Styles
import styles, { formStructConfigSelected } from "./styles"
import DefaultHeader from "../../Components/DefaultHeader"

// Form
let t = require("tcomb-form-native-codificar")
let Form = t.form.Form
const stylesheet = formStructConfig(t.form.Form.stylesheet)
const stylesheetSelected = formStructConfigSelected(t.form.Form.stylesheet)
class ChangePasswordScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			valuePassword: {
				password: "",
				confirmPassword: ""
			},
			confirm_passwordError: false,
			error_msg_confirm_password: strings("register.empty_confirm_password"),
			passwordError: false,
			error_msg_password: strings("register.empty_password"),
			isFocusedPassword: false,
			isLoggingIn: false
		}


    this.deviceData = {
			token: "0",
			type: Platform.OS
		}

		this.rotation = 0
		this.login_by = "manual"

		this.api = new ProviderApiFormData()
		this.apiProvider = new ProviderApi()
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			this.navigateToScreen("MainScreen");
			return true;
		});

		this.keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			this._keyboardDidHide
		);

		this.getProviderInformation();
	}

	componentWillUnmount() {
		BackHandler.removeEventListener("backPress")
	}

	getFormPassword() {
		return t.struct({
			password: t.String,
			confirmPassword: t.String,
		})
	}

	/**
	 * Focus to next input on press next button at keyboard
	 * @param {String} input
	 * @param {Boolean} hasMask
	 */
	focusToNext(input, hasMask = false) {
		if (hasMask)
			this._formRef.getComponent(input).refs.input._inputElement.focus();
		else
			this._formRef.getComponent(input).refs.input.focus();
	}

	getOptionsInputPassword() {
		let optionsInput = {
			fields: {
				password: {
					stylesheet: this.state.isFocusedPassword ? stylesheetSelected : stylesheet,
					minLength: 6,
					autoCapitalize: "none",
					error: this.state.error_msg_password,
					hasError: this.state.passwordError,
					password: true,
					secureTextEntry: true,
					label: strings("register.newPassword"),
					onSubmitEditing: () => this.focusToNext('confirmPassword'),
					returnKeyType: "next",
					onFocus: () => this.focusPassword(),
					onBlur: () => this.checkPasswordBlur()
				},
				confirmPassword: {
					stylesheet: this.state.isFocusedConfirmPass ? stylesheetSelected : stylesheet,
					minLength: 6,
					autoCapitalize: "none",
					error: this.state.error_msg_confirm_password,
					hasError: this.state.confirm_passwordError,
					password: true,
					secureTextEntry: true,
					label: strings("register.confirmNewPassword"),
					onFocus: () => this.focusConfirmPassword(),
					onBlur: () => this.checkConfirmPassword()
				}
			}
		}
		return optionsInput
	}

	focusPassword() {
		this.setState({ passwordError: null, error_msg_password: null, isFocusedPassword: true })
	}

	checkPasswordBlur() {
		this.setState({ isFocusedPassword: false })
		let passwordError = true
		if (this.state.valuePassword.password) {
			if (this.state.valuePassword.password.length < 6) {
				passwordError = true
				this.setState({ passwordError: true, error_msg_password: strings("register.empty_password_length") })
			} else {
				passwordError = false
				this.setState({ passwordError: false, error_msg_password: null })
			}
		} else {
			passwordError = true
			this.setState({ passwordError: true, error_msg_password: strings("register.empty_password") })
		}
		return passwordError
	}

	focusConfirmPassword() {
		this.setState({ confirm_passwordError: null, error_msg_confirm_password: null, isFocusedConfirmPass: true })
	}

	checkConfirmPassword() {
		this.setState({ isFocusedConfirmPass: false })
		if (this.state.valuePassword.confirmPassword) {
			if (this.state.valuePassword.password) {
				if (this.state.valuePassword.password != this.state.valuePassword.confirmPassword) {
					this.setState({ confirm_passwordError: true, error_msg_confirm_password: strings("register.error_confirm_password") })
				} else {
					this.setState({ confirm_passwordError: false, error_msg_confirm_password: null })
				}
			}
		} else {
			this.setState({ confirm_passwordError: true, error_msg_confirm_password: strings("register.empty_confirm_password") })
		}
	}

	/**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const { navigate } = this.props.navigation;
		return navigate;
	}

	/**
	 * Get Provider Information.
	 */
	getProviderInformation() {
		let maxDate = new Date()
		maxDate.setFullYear(maxDate.getFullYear() - 18)

		let birth = new Date(moment(maxDate, "DD/MM/YYYY").format())
		let gender = this.props.basicProvider.gender == 'male' ? strings("register.male") : strings("register.female")

		if (this.props.basicProvider.birthday !== undefined && this.props.basicProvider.birthday !== '') {
			birth = new Date(moment(this.props.basicProvider.birthday, "DD/MM/YYYY").format())
		}

		this.setState({
			value: {
				firstName: this.props.basicProvider.firstName,
				lastName: this.props.basicProvider.lastName,
				document: this.props.basicProvider.document,
				birthDate: birth,
				gender: gender,
				phone: this.props.basicProvider.phone.slice(3),
				email: this.props.basicProvider.email,
				indicationCode: this.props.basicProvider.indicationCode
			}
		})

	}

	onChangePass(value) {
		this.setState({ valuePassword: value })
	}

	/**
	 * Validation for password and confirm password
	 */
	checkPassword = () => {
		let passwordError = true
		if (this.state.valuePassword.password != undefined) {
			if (this.state.valuePassword.password.length < 6) {
				passwordError = true;
				this.setState({
					passwordError: true,
					confirm_passwordError: true,
					error_msg_password: strings("register.empty_password_length"),
					error_msg_confirm_password: strings("register.empty_password_length")
				});
			} else if (this.state.valuePassword.password != this.state.valuePassword.confirmPassword) {
				passwordError = true;
				this.setState({
					passwordError: false,
					confirm_passwordError: true,
					error_msg_confirm_password: strings("register.error_confirm_password")
				});
			} else if (this.state.valuePassword.password == this.state.valuePassword.confirmPassword) {
				passwordError = false;
				this.setState({
					passwordError: false,
					confirm_passwordError: false
				});
			}
		} else {
			passwordError = true;
			this.setState({
				passwordError: true,
				confirm_passwordError: true,
				error_msg_password: strings("register.empty_password_length"),
				error_msg_confirm_password: strings("register.empty_password_length")
			});
		}
		return passwordError;
	}

	/**
	 * Navigate to another screen
	 * @param {String} screen
	 */
	navigateToScreen(screen) {
		const { navigate } = this.props.navigation;
		navigate(screen);
	}

	/**
	 * Call the Update API
	 */
	async register() {
		let passwordError = false

		passwordError = this.checkPassword()
		if (!passwordError) {
			this.setState({ isLoggingIn: true })
			try {
				const response = await this.api.ChangePassword(
					this.props.provider._id,
					this.props.provider._token,
					this.state.valuePassword.password,
					this.state.valuePassword.confirmPassword
				)
				this.setState({ isLoggingIn: false })
				let responseJson = response.data
				if (parse.isSuccess(responseJson, this.returnConstNavigate()) == true) {
					parse.showToast(strings('register.successChangePassword'), Toast.durations.LONG)
					let changedToken = responseJson.provider.token
					this.props.changeToken(changedToken)
					let arrayProviderAux = this.props.providerProfile
					arrayProviderAux._token = changedToken
                    this.props.onProviderAction(arrayProviderAux)
					Provider.require(Provider)
					Provider.restore(constants.PROVIDER_STORAGE).then(provider => {
						if (provider !== null) {
							this.provider = provider
							this.provider.setToken(changedToken)
							this.provider.store(constants.PROVIDER_STORAGE)
						}
					})
					this.props.navigation.navigate('EditProfileMainScreen')
				} else {
					parse.showToast(responseJson.error_messages[0], Toast.durations.LONG)
				}
			} catch (error) {
				this.setState({ isLoggingIn: false })
				parse.showToast(strings("error.try_again"), Toast.durations.LONG)
			}

		} else {
			parse.showToast(strings("error.correctly_fill"), Toast.durations.SHORT);
		}
	}

	render() {
		return (
			<View style={styles.container} backgroundColor={BootstrapColors.white}>
        <DefaultHeader
          loading={this.state.isLoggingIn} // sytle={styles.centered}
          loadingMsg={strings("register.updating")}
          btnBackListener={() => this.props.navigation.goBack()}
          title={strings('profileProvider.chagePassword')}
        />
				<ScrollView style={styles.parentContainer} keyboardShouldPersistTaps="handled">
					<View style={styles.sectionInputs}>
						<Form
							ref={ref => (this._formRef = ref)}
							type={this.getFormPassword()}
							options={this.getOptionsInputPassword()}
							value={this.state.valuePassword}
							onChange={this.onChangePass.bind(this)}
						/>

            <Button
							onPress={() => this.register()}
							text={strings("register.save")}
						/>
					</View>
				</ScrollView>
			</View>
		)
	}
}

const mapStateToProps = state => (
	{
		settings:state.settingsReducer.settings,
		provider: state.providerProfile.providerProfile,
		providerProfile: state.providerProfile.providerProfile,
		basicProvider: state.providerReducer.basicProvider
	}
)

const mapDispatchToProps = dispatch => (
	{
		onProviderAction: provider => dispatch(providerAction(provider)),
		changeProviderData: (values) => dispatch(changeProviderData(values)),
		changeToken: value => dispatch(changeToken(value)),
    changeProviderBasic: (
      firstName,
      lastName,
      birthday,
      ddd,
      gender,
      typePerson,
      document,
      phone,
      email,
      indicationCode) => dispatch(
        changeProviderBasic(
          firstName,
          lastName,
          birthday,
          ddd,
          gender,
          typePerson,
          document,
          phone,
          email,
          indicationCode)),
	}
)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ChangePasswordScreen)
