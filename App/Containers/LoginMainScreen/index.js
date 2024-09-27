// Modules
import React from "react";
import {
  View,
  Platform,
  Image,
  SafeAreaView
} from "react-native";

import { connect } from "react-redux";
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState
} from "@invertase/react-native-apple-authentication";
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

// Locales
import { strings } from "../../Locales/i18n";

// Themes
import images from "../../Themes/WhiteLabelTheme/Images";

// Util
import * as constants from "../../Util/Constants";
import Login, { mapDispatchToProps, mapStateToProps } from "../../Util/Login";

//Styles
import styles from "./styles";
import { projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Custom components
import IconTextButton from "../../Components/IconTextButton";

function LoginButton({ onPress, icon, text }) {
  return <IconTextButton icon={icon} size={30} text={text} onPress={onPress} />;
}

class LoginMainScreen extends Login {
  constructor(props) {
    super(props);
  }
  async onAppleButtonPress() {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME
      ]
    });

    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
      this.login_by = constants.APPLE;
      this.social.socialId = appleAuthRequestResponse.user;

      if (appleAuthRequestResponse.email) {
        this.social.socialEmail = appleAuthRequestResponse.email;
        this.social.firstName = appleAuthRequestResponse.fullName.givenName;
        this.social.lastName = appleAuthRequestResponse.fullName.familyName;
      }

      this.login(this.social);
    }
  }

  renderEmailButton() {
    return (
      <LoginButton
        onPress={() => this.props.navigation.navigate("LoginScreen")}
        icon="mail"
        text={strings("loginMain.loginWithEmail")}
      />
    );
  }

  renderGoogleButton() {
    return (
      <LoginButton onPress={this.loginGoogle} icon='logo-google' text={strings("login.loginByGoogle")}>
        <GoogleSigninButton style={{ width: 0, height: 0 }} onPress={() => this.loginGoogle()} />
      </LoginButton>
    );
  }

  renderFacebookButton() {
    return <LoginButton onPress={this.loginFacebook} icon='logo-facebook' text={strings("login.loginByFace")} />;
  }

  renderAppleButton() {
    return (
      <LoginButton onPress={this.onAppleButtonPress} icon='logo-apple' text={strings("login.loginByApple")} >;
        <AppleButton buttonType={AppleButton.Type.SIGN_IN} style={{ width: 0, height: 0 }} onPress={() => this.onAppleButtonPress()} />
      </LoginButton>
    );
  }

  renderPhoneButton() {
    return (
      <LoginButton
        onPress={() => this.navigateToScreen("PhoneValidationScreen")}
        icon='call'
        text={strings("login.loginByCell")} />
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: projectColors.white }} paddingVertical='25%'>
        <View style={styles.container}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={{ ...styles.imgLogo, borderRadius: 5 }}
          />
          <View style={styles.containerButtons}>

            {this.renderEmailButton()}

            {this.props.settings?.allow_social_register == 1 && <>
              {this.renderGoogleButton()}
              {false && this.renderFacebookButton()}
              {Platform.OS == "ios" && this.renderAppleButton()}
            </>}

            {!!this.props.settings?.is_login_by_sms_enabled && this.renderPhoneButton()}
          </View>
          {this.buildFooterWithRegisterLink(this.props.navigation.navigate)}
        </View>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginMainScreen);
