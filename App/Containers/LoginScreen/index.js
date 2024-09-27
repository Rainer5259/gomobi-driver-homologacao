import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Icon } from 'react-native-elements'
import { strings } from "../../Locales/i18n";

// Styles
import styles from "./styles.js";
import * as constants from "../../Util/Constants";


//Custom components
import Loader from "../../Components/Loader";

// whitelabel
import {
  PrimaryButton,
  BootstrapColors
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Redux
import { connect } from "react-redux";

import { SafeAreaView } from "react-native";
import HeaderLogin from "./components/HeaderLogin";
import Button from "../../Components/RoundedButton";
import Login, { mapDispatchToProps, mapStateToProps } from "../../Util/Login";

class LoginScreen extends Login {
  constructor(props) {
    super(props);

    this.currentScreen = "LoginScreen";
    this.nextScreen = "";
  }

  componentDidMount() {
    super.componentDidMount();

    if (this.deviceData.token == null && constants.device_token != null) {
      this.deviceData.token = constants.device_token;
    } else if (
      this.deviceData.token == null &&
      constants.device_token == null
    ) {
      this.deviceData.token = constants.device_token;
    }

    this.setState({ isLoggingIn: false })
  }

  componentWillUnmount() {
    this.backHandler.remove();
    this.willFocus.remove();
  }

  validation = () => {
    this.setState({
      isFocusedEmail: false,
      enabled: this.state.email.length > 0
    })
  };

  render() {
    return (

      <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="height">
        <SafeAreaView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {
              Platform.OS == 'android' &&
              <Loader loading={this.state.isLoggingIn} message={strings('load.Loading')} />
            }
            <HeaderLogin style={styles.header} btnBackListener={() => this.navigateToScreen("LoginMainScreen")} />

            <View style={styles.sectionLogin}>
              <View style={styles.formFields}>
                <Text style={styles.titleSecond}>{"Login"}</Text>

                <View style={styles.containerFields}>
                  <TextInput
                    id='gomobi_username'
                    nativeID='gomobi_username'
                    testID='gomobi_username'
                    autoCapitalize="none"
                    style={[styles.defaultInputStyle, this.state.isFocusedEmail ? { borderColor: PrimaryButton } : {}]}
                    keyboardType="email-address"
                    returnKeyType="next"
                    underlineColorAndroid={"transparent"}
                    value={this.state.email}
                    ref={input => (this.email = input)}
                    onFocus={() => this.setState({ isFocusedEmail: true })}
                    onEndEditing={() => this.validation()}
                    onSubmitEditing={() => this.password.focus()}
                    onChangeText={email => this.setState({ email })}
                    placeholder={` ${strings("login.type_your_email_address")}`}
                    placeholderTextColor={BootstrapColors.placeHolder}

                  />
                  <View style={styles.inputsArea}>
                    <TextInput
                      id='gomobi_password'
                      nativeID='gomobi_password'
                      testID='gomobi_password'
                      autoCapitalize="none"
                      style={[styles.defaultInputStyle, { flex: 1 }, this.state.isFocusedPassword ? { borderColor: PrimaryButton } : {}]}
                      ref={input => (this.password = input)}
                      secureTextEntry={this.state.showPassword ? false : true}
                      underlineColorAndroid={"transparent"}
                      keyboardType="default"
                      returnKeyType="done"
                      onFocus={() => this.setState({ isFocusedPassword: true })}
                      onEndEditing={() => this.setState({ isFocusedPassword: false })}
                      onSubmitEditing={() => this.login(null, "LoginScreen")}
                      onChangeText={password => this.setState({ password })}
                      placeholder={` ${strings("login.type_your_password")}`}
                      placeholderTextColor={BootstrapColors.placeHolder}
                    />

                    <TouchableOpacity style={styles.eyePassword} onPress={() => this.setState({ showPassword: !this.state.showPassword })}>
                      <Icon type='entypo' name={this.state.showPassword ? 'eye-with-line' : 'eye'} color={BootstrapColors.lightGrey} />
                    </TouchableOpacity>

                  </View>
                  <TouchableOpacity
                    onPress={() => this.navigateToScreen("PasswordScreen")}
                    style={{height: 30, marginBottom: 10}}
                  >
                    <Text style={styles.forgotPassword}>
                      {strings("login.forgot_your_password")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Button
                  id='gomobi_submit'
                  testID='gomobi_submit'
                  onPress={() => this.login(null, "LoginScreen")}
                  text={strings('general.enter')}
                />
              </View>
              {this.buildFooterWithRegisterLink(this.props.navigation.navigate)}
            </View>

          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
