// Modules
import React, { Component } from "react";
import {
	ScrollView,
	View,
	Text,
	KeyboardAvoidingView,
	TextInput,
	StatusBar,
	BackHandler,
	TouchableOpacity
} from "react-native";
import Toast from "react-native-root-toast";
import { connect } from "react-redux";
import { Icon } from 'react-native-elements'

// Components
import DefaultHeader from "../../Components/DefaultHeader";
import Button from "../../Components/RoundedButton";

// Locales
import { strings } from "../../Locales/i18n";

// Helpers
import validateEmail from "../../Helpers/validateEmail.helper";

// Services
import ProviderApi from "../../Services/Api/ProviderApi";
import {handlerException} from '../../Services/Exception';

// Themes
import {
	secondBackground,
	DefaultInputStyle,
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Util
import * as parse from "../../Util/Parse";
import * as constants from "../../Util/Constants";

// Styles
import styles from "./styles";
class PasswordScreen extends Component {
	constructor(props) {
		super(props);

		this.api = new ProviderApi();

		this.state = {
			email: "",
			isLoggingIn: false,
		};
		this.willBlur = this.props.navigation.addListener("willBlur", () => { });
	}

	componentDidMount() {
		this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			this.props.navigation.goBack();
			return true;
		});
	}

	componentWillUnmount() {
    if(this.backHandler){
      this.backHandler.remove();
    }
		this.willBlur.remove();
	}

	validation = () => {
		if (validateEmail(this.state.email)) {
			this.setState({ enabled: true });
		} else {
			parse.showToast(
				strings("recover_password.type_valid_email"),
				Toast.durations.LONG
			);
			this.setState({ enabled: false });
		}
	};

	/**
	 * return const navigate = this.props.navigation
	 */
	returnConstNavigate() {
		const { navigate } = this.props.navigation;
		return navigate;
	}

	/**
	 * Call the Recover Password API and go to Login Screen
	 */
	recoverPassword = () => {
		const { navigate } = this.props.navigation;

		this.setState({ isLoggingIn: true });

		recoverResponse = this.api.RecoverPassword(constants.IS_PROVIDER, this.state.email);

		recoverResponse
			.then(response => {
				var responseJson = response.data;
				this.setState({ isLoggingIn: false });
				if (parse.isSuccess(responseJson, this.returnConstNavigate()) == true) {
					parse.showToast(
						strings("recover_password.recover_password_toast"),
						Toast.durations.SHORT
					);
					navigate("LoginMainScreen");
				}
			})
			.catch(error => {
				this.setState({ isLoggingIn: false });
				parse.showToast(strings("error.try_again"), Toast.durations.LONG);
        handlerException('PasswordScreen', error);
			});
	};

	render() {
		return (
			<>
				<StatusBar backgroundColor={secondBackground} barStyle="dark-content" />

				<ScrollView style={styles.container}>
          <DefaultHeader
						loading={this.state.isLoggingIn}
						loadingMsg={strings("load.Sending")}
            btnBackListener={() => this.props.navigation.goBack()}
            title={strings("login.recover_password")}
            subtitle={strings("recover_password.recover_password_msg")}
          />
					<KeyboardAvoidingView style={styles.container} behavior="padding">
						<View style={styles.sectionLogin}>

							<View style={styles.inputsArea}>
								<Text style={(this.state.isFocused) ? styles.labelFocused : styles.labelDefault}> {strings("login.email")} </Text>
								<TextInput
									style={(this.state.isFocused) ? styles.inputFocused : DefaultInputStyle}
									autoCapitalize="none"
									onChangeText={email => this.setState({ email })}
									keyboardType="email-address"
									underlineColorAndroid={"transparent"}
									ref={input => (this.email = input)}
									onFocus={() => this.setState({ isFocused: true })}
									onEndEditing={() => this.validation()}
									placeholder={strings("login.type_your_email_address")}
								/>
							</View>
						</View>

            <View paddingHorizontal={20} marginTop={20}>
              <Button
                onPress={() => this.recoverPassword()}
                text={strings("recover_password.recover_password_description")}
              />
            </View>

					</KeyboardAvoidingView>
				</ScrollView>
			</>
		);
	}
}

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PasswordScreen);
