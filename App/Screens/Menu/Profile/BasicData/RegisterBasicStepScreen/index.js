"use strict";

// Modules
import {
  Alert,
  Platform,
  Linking
} from "react-native";

// Locales
import { strings } from "../../../../../Locales/i18n";

//Services

import { handlerException } from '../../../../../Services/Exception';

// Themes
import { Images } from "../../../../../Themes";

// Utils
import _ from "lodash";

//Actions
import { resetRegister } from "../../../../../Store/actions/actionRegister";

// Redux
import { connect } from "react-redux";

//Locale
import I18n from "react-native-i18n";

export const currentLocale = I18n.currentLocale();

import BasicData, { mapDispatchToProps } from "../components/BasicData";
import { CONFIRM_PASSWORD, PASSWORD, msgErrorConfirmPassword, msgErrorPassword, msgErrorPasswordDiff, msgErrorPasswordLength } from "../hooks/useBasicData";
class RegisterBasicStepScreen extends BasicData {

  copyReferralCode(text) {
    this.setState({
      value: {
        ...this.state.value,
        indicationCode: text
      },
      modalReferral: false,
    });
  }

  /**
   * @param {Object} prevState Valores anteriores de cada campo.
   * @returns {Boolean} Caso for alterado algum valor de campo que precisa ser salvo no storage.
   */
  verifyToSaveInfo(prevState) {
    return !_.isEmpty(this.state.value) &&
      ((prevState.avatarSource != this.state.avatarSource && this.state.avatarSource) ||
        (prevState.value.firstName != this.state.value.firstName && this.state.value.firstName) ||
        (prevState.value.lastName != this.state.value.lastName && this.state.value.lastName) ||
        (prevState.value.document != this.state.value.document && this.state.value.document) ||
        (prevState.value.birthday != this.state.value.birthday && this.state.value.birthday) ||
        (prevState.value.gender != this.state.value.gender && this.state.value.gender) ||
        (prevState.value.phone != this.state.value.phone && this.state.value.phone) ||
        (prevState.value.email != this.state.value.email && this.state.value.email) ||
        (prevState.value.typePerson != this.state.value.typePerson && this.state.value.typePerson) ||
        (prevState.value.document2 != this.state.value.document2 && this.state.value.document2) ||
        (prevState.value.indicationCode != this.state.value.indicationCode && this.state.value.indicationCode));
  }

  /**
   * @description Salva os valores informados no storage para eventuais problemas
   * @param {Object} prevProps
   * @param {Object} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    if (this.verifyToSaveInfo(prevState)) {
      this.useLoadValues.saveValues(this.state);
    }
  }

  /**
   * Navigate to another screen
   * @param {String} screen
   */
  navigateToScreen(screen) {
    const { navigate } = this.props.navigation;
    navigate(screen);
  }

  goBackToPreviousState() {
    this.props.navigation.navigate("LoginMainScreen");
  }


  /**
   * Navigate to settings page
   */
  handleOpenSettings() {
    try {
      if (Platform.OS == 'ios') {
        Linking.openURL('app-settings:');
      } else {
        Linking.openSettings();
      }
    } catch (error) {
      handlerException('RegisterBasicStepScreen.handleOpenSettings', error);
    }
  }

  /**
   * Alert to set permissions
   * @param {*} title
   * @param {*} message
   */
  showAlertSetings(title, message) {
    Alert.alert(
      title,
      message,
      [{
        text: strings("register.screen_permission"),
        style: "cancel",
        onPress: () => this.handleOpenSettings()
      }],
      {
        cancelable: true,
      }
    );
  }

  verifyReferralField() {
    this.setState({ modalReferral: false });

    if (this.props.settings.show_provider_referral_field == 1 &&
      this.props.settings.provider_referral_field_rule == 1 &&
      !this.state.value.indicationCode
    ) {
      this.setState({ modalReferral: true });
      return Promise.reject();
    }

    return Promise.resolve();
  }

  exitRegister() {
    this.props.resetRegister();
    this.setState({
      value: {},
      picture: "",
      avatarSource: Images.avatar_register,
    });
    this.props.navigation.goBack();
  }
}

const mapStateToProps = (state) => ({
  latitude: state.CoordinatesProviderReducer.latitude,
  longitude: state.CoordinatesProviderReducer.longitude,
  settings: state.settingsReducer.settings,
  basicRegister: state.registerReducer.basicRegister,
  basicFilled: state.registerReducer.basicFilled,
  addProviderId: state.registerReducer.addProviderId,
  basicSocialRegister: state.registerReducer.basicSocialRegister,
  editScreen: Boolean(false)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterBasicStepScreen);
