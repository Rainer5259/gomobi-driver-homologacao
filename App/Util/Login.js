import validateEmail from "../Helpers/validateEmail.helper";
import { NavigationActions, StackActions } from 'react-navigation';

// Services
import { handlerException } from '../Services/Exception';
import ProviderApi from "../Services/Api/ProviderApi";

// Modules
import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";

import Toast from "react-native-root-toast";

// Locales
import { strings } from "../Locales/i18n";

// Store
import {
  changeRegisterBasicSocial,
  changeRegisterBasic,
  changeRegisterAddress,
  changeRegisterServices,
  changeRegisterVehicle,
  changeRegisterBankAccount,
  changeProviderId,
  resetRegister
} from "../Store/actions/actionRegister";
import { providerAction } from "../Store/actions/providerProfile";
import { requestUpdated } from "../Store/actions/request";


// Themes
import { Images } from "../Themes";

// Util
import * as parse from "./Parse";
import * as constants from "./Constants";
import FacebookSignin from "./Facebook";
import GoogleSignin from "./GooglePlus";

//Styles
import styles from "../Containers/LoginScreen/styles";

import {
  WPROJECT_NAME,
} from "../Themes/WhiteLabelTheme/WhiteLabel";

const api = new ProviderApi();

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.api = new ProviderApi();

    this.deviceData = {
      token: constants.device_token,
      type: Platform.OS
    };

    this.social = {
      socialId: "",
      firstName: "",
      lastName: "",
      photoURI: Images.avatar_register,
      photo: "",
      socialEmail: ""
    };

    this.state = {
      email: "",
      password: "",
      isLoggingIn: true,
      isFocusedEmail: false,
      isFocusedPassword: false,
      showPassword: false
    };

    this.currentScreen = "";
    this.nextScreen = "";

    constants.bubbleStarted = false;

    this.login_by = "manual";

    this.willFocus = this.props.navigation.addListener("willFocus", () => {
      this.login_by = "manual";
    });
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.exitApp();
      return true;
    });
  }

  exitApp() {
    Alert.alert(
      strings("map_screen.exit_app"),
      strings("map_screen.exit_app_msg"),
      [
        {
          text: strings("general.no_tinny"),
          onPress: () => function () { },
          style: "cancel"
        },
        {
          text: strings("general.yes_tinny"),
          onPress: () => BackHandler.exitApp()
        }
      ],
      { cancelable: true }
    );
  }

  checkRequestInProgress(provider) {
    this.api
      .GetRequestInProgressId(provider._id, provider._token)
      .then(response => {
        var request = response.data;
        if (parse.isSuccess(request, this.props.navigation) == true) {
          if (request.request_id != -1) {
            this.api
              .GetProviderRequest(provider._id, provider._token, request.request_id)
              .then(response => {
                const details = response.data;
                this.props.onRequestUpdated(details);
                this.navigateToScreen("ServiceUserBoardScreen", request.request_id);
              })
              .catch(error => {
                handlerException(this.currentScreen, error);
              });
          } else {
            this.navigateToScreen("MainScreen");
          }
        } else {
          this.navigateToScreen("MainScreen");
        }
      })
      .catch(error => {
        this.setState({ isLoggingIn: false });
        this.navigateToScreen("MainScreen");
        parse.showToast(strings("error.not_registered"), Toast.durations.SHORT);
        handlerException(this.currentScreen, error);
      });
  }

  /**
   * Go from Login to Another Screen
   */
  navigateToScreen(screen, request_id = -1) {
    this.setState({ isLoggingIn: false });
    const { navigate } = this.props.navigation;

    if (screen == "docs") {
      screen = "RegisterBasicStepScreen";
    }

    /**
     * Navigate to another Screen.
     * First parameter: Screen to be initialized passed in "screen" variable
     * Second parameter: Information sent from CurrentScreen to NextScreen.
     * Use "this.props.navigation.state.params.loginBy" to use data on the other Screen
     */
    if (screen == "RegisterBasicStepScreen") {
      this.props.onProviderAction({
        _id: "",
        _token: "",
        _is_active: ""
      });

      navigate("RegisterScreenWeb", {
        loginSocial: this.social,
        loginBy: this.login_by,
        device_token: this.deviceData.token
      });
    } else if (screen == "ServiceUserBoardScreen") {
      navigate(screen, {
        provider: this.props.providerProfile,
        screen: "LoginMainScreen",
        request_id: request_id
      });
    } else if (screen == "MainScreen") {
      this.props.navigation.dispatch(StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({ routeName: 'MainScreen' })
        ]
      }));
    } else {
      navigate(screen, {
        provider: this.props.providerProfile,
        screen: "LoginMainScreen"
      });
    }
  }

  /**
   * Call the Google Plus SignIn API
   */
  loginGoogle = () => {
    this.setState({ isLoggingIn: true });
    GoogleSignin((socialData, type) => {
      this.login_by = type;
      this.social = {
        photoURI: "",
        photo: "",
        socialId: socialData.socialId,
        socialEmail: socialData.socialEmail,
        firstName: socialData.firstName,
        lastName: socialData.lastName
      }
      this.login(this.social);
    }).finally(() => this.setState({ isLoggingIn: false }));
  }

  /**
   * Call the Facebook SignIn API
   */
  loginFacebook = () => {
    FacebookSignin((socialData, type) => {
      this.login_by = type;
      this.social = {
        photoURI: "",
        photo: "",
        socialId: socialData.socialId,
        socialEmail: socialData.socialEmail,
        firstName: socialData.firstName,
        lastName: socialData.lastName
      }
      this.login(this.social);
    });
  }

  loginByDefault = (loginResponse) => {
    if (validateEmail(this.state.email)) {

      if (this.state.password.length > 0) {
        if (parse.isSuccess(loginResponse)) {
          this.goToMapScreen(loginResponse);
        } else {
          if (loginResponse?.error_code == 401 || loginResponse?.error_code == 451) {
            this.goToRegisterScreen(loginResponse);
          }
        }
      } else {
        parse.showToast(strings("login.required_password"));
      }
    } else {
      parse.showToast(strings("recover_password.type_valid_email"));
    }
  }

  loginBySocial = (loginResponse, deviceToken) => {
    if (this.social?.socialEmail && validateEmail(this.social.socialEmail)) {
      changeRegisterBasicSocial(
        this.social.socialId,
        this.social.firstName,
        this.social.lastName,
        this.social.socialEmail,
        deviceToken,
        this.deviceData?.token,
        this.login_by
      );

      if (parse.isSuccess(loginResponse)) {
        this.goToMapScreen(loginResponse);
      } else {
        if (loginResponse?.error_code == 401 || loginResponse?.error_code == 451) {
          this.goToRegisterScreen(loginResponse);
        }

      }
    } else {
      this.goToRegisterScreen(loginResponse);
      parse.showToast(strings("register.finish_register"));
    }
  }

  /**
     * Call the Login API and go to Map Screen
     */
  login(socialData) {
    this.setState({ isLoggingIn: true })
    const deviceToken = this.deviceData?.token || constants.device_token || 0;

    const onSuccess = (response) => {
      !!socialData ? this.loginBySocial(response.data, deviceToken) : this.loginByDefault(response.data);
    }
    const onFail = (error) => {
      handlerException(this.currentScreen, error);
      parse.showToast(strings("error.try_again"), Toast.durations.LONG);
      this.goToRegisterScreen(socialData);

      this.setState({ isLoggingIn: true });
    }

    if (!!socialData) {
      if (!socialData.socialEmail) {
        this.setState({ isLoggingIn: false })
        parse.showToast(strings("login.invalid_email_or_password"));
        return;
      }
      api.DoSocialLogin(
        socialData.socialId,
        socialData.socialEmail,
        this.deviceData.type,
        deviceToken,
        this.login_by
      ).then(onSuccess).catch(onFail).finally(() => this.setState({ isLoggingIn: false }))
    } else {
      api.DoLogin(
        this.state.email,
        this.state.password,
        this.deviceData.type,
        deviceToken,
        this.login_by
      ).then(onSuccess).catch(onFail).finally(() => this.setState({ isLoggingIn: false }))
    }
  };

  /**
   * Prepare information and go to Map Screen
   * @param {json} json (JSON with Provider Information)
   */
  goToMapScreen(expectedJson) {
    let json = expectedJson.provider;

    this.setState({ isLoggingIn: false });
    let statusInfo = json.status_id;
    let screenStep = this.checkRegisterStep(json);

    var providerData = parse.prefixProviderProfile(json);
    providerData._is_txt_approved = json.is_approved_txt;
    providerData._is_available = json.is_available;
    providerData._is_active = 0;
    providerData._is_approved = json.is_approved;

    this.props.onProviderAction(providerData);
    /**
     * Create a Provider model and
     * Save model information into Storage
     */
    if (statusInfo == "APROVADO") {

      this.checkRequestInProgress(this.props.providerProfile);
    } else if (statusInfo == "EM_ANALISE") {
      this.props.providerProfile._provider_type = [json.type];

      if (screenStep == "docs" || json.register_step == null || json.register_step == "approved" || screenStep == "approved") {
        if (this.props.settings?.is_enable_provider_approval_flow) {
          this.showAlertStep(
            strings("alert.in_analysis"),
            strings("alert.in_analysis_message", {
              name: json.first_name,
              projectName: WPROJECT_NAME
            }),
            {
              text: strings("general.OK"),
              onPress: () => this.navigateToScreen("MainScreen")
            }
          );
        } else {
          this.navigateToScreen("MainScreen");
        }
      } else {
        this.props.providerProfile._register_step = json.register_step;
        this.showAlertStep(
          strings("login.register"),
          strings("login.complete_register_msg", { name: json.first_name }),
          {
            text: strings("login.complete_register"),
            onPress: () =>
              this.navigateToScreen(screenStep, {
                provider: this.props.providerProfile,
                services: null
              })
          }
        );
      }
    } else if (statusInfo == "PENDENTE") {
      let reason = json.reason;

      this.showAlertStep(
        strings("login.pendent"),
        reason != null ? reason : strings("login.pendent_reason"),
        {
          text: strings("general.OK"),
          onPress: () => this.navigateToScreen("MainScreen")
        }
      );
    } else {
      this.showAlertStep(
        strings("alert.attention"),
        strings("alert.attention_message", {
          name: json.first_name,
          status_id: strings("status." + json.status_id)
        }),
        { text: strings("general.OK") }
      );
    }
  }

  showAlertStep(title, message, button) {
    if (Platform.OS == constants.ANDROID) {
      Alert.alert(title, message, [button], { cancelable: true });
    } else if (Platform.OS == constants.IOS) {
      Alert.alert(title, message, [button], { cancelable: true });
    }
  }

  fillBasicRegisterReducer(json) {
    this.props.changeRegisterBasic(json.firstName, json.lastName, json.birthday, json.ddd, json.gender, json.typePerson, json.document, json.phone, json.email, json.indicationCode, json.picture);
  }

  fillAddressRegisterReducer(json) {
    this.props.changeRegisterAddress(json.zipcode, json.address, json.address_number, json.address_complement, json.address_neighbour, json.address_city, json.state);
  }

  fillServicesRegisterReducer(json) {
    this.props.changeRegisterServices(json.services_types);
  }

  fillVehicleRegisterReducer(json) {
    this.props.changeRegisterVehicle(json.car_number, json.car_model, json.car_brand, json.car_color, json.car_manufactoring_year, json.car_model_year);
  }

  fillBankAccRegisterReducer(json) {
    this.props.changeRegisterBankAccount(json.bank_account.holder, json.bank_account.birthday_date, json.bank_account.person_type, json.bank_account.document, json.bank_account.account_type, json.bank_account.bank.id, json.bank_account.agency, json.bank_account.agency_digit, json.bank_account.account, json.bank_account.account_digit);
  }

  /**
   * Check the register step by provider
   */
  checkRegisterStep(json) {
    let screenStep = "approved";
    if (!this.props.settings?.is_enable_provider_approval_flow) {
      return screenStep;
    }

    this.props.resetRegister();

    const partialSteps = {
      "address": {
        actions: [this.fillBasicRegisterReducer],
        screenStep: "RegisterAddressStepScreen"
      },
      "vehicle": {
        actions: [this.fillBasicRegisterReducer, this.fillAddressRegisterReducer, this.fillServicesRegisterReducer],
        screenStep: "RegisterVehicleStepScreen"
      },
      "bankinginfo": {
        actions: [this.fillBasicRegisterReducer, this.fillAddressRegisterReducer, this.fillServicesRegisterReducer, this.fillVehicleRegisterReducer],
        screenStep: "RegisterBankStepScreen"
      },
      // // Tela não faz parte do app da play store e não foi finalizada
      // "docs": {
      //   actions: [fillBasicRegisterReducer, fillAddressRegisterReducer, fillServicesRegisterReducer, fillVehicleRegisterReducer, fillBankAccRegisterReducer],
      //   screenStep: "RegisterDocumentsStepScreen"
      // }
    }

    const stepDetails = partialSteps[json.register_step]; // Foi removido a tela de servicos.
    if (!!stepDetails) {
      this.props.changeProviderId(json.id);
      for (let stepAction of stepDetails.actions) {
        stepAction(json);
      }
      screenStep = stepDetails.screenStep;
    }

    return screenStep;
  }

  /**
   * Prepare information and go to Register Screen
   * @param {json} json (JSON with Login API Response)
   */
  goToRegisterScreen(json) {
    /**
     * Check if it was not possible to log in because of social information
     * if it was go to Register Screen with social information loaded.
     */

    if (json?.error_code == 401) {
      /**
       * Navigate to another Screen.
       * First parameter: Screen to be initialized
       */

      this.navigateToScreen("RegisterBasicStepScreen");
    }
  }

  buildFooterWithRegisterLink = (navigate) => {
    return (<>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={styles.containerFooter}>
          <View style={{ height: '100%', marginTop: 4, paddingRight: 3 }}>
            <Text style={styles.textFooterOne}>{strings('loginMain.notHaveAccount')}</Text>
          </View>

          <TouchableOpacity onPress={() => navigate("RegisterScreenWeb")}>
            <Text style={styles.textFooterTwo}>{strings('loginMain.register')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>);
  }
}

export const mapStateToProps = state => ({
  settings: state.settingsReducer.settings,
  providerProfile: state.providerProfile.providerProfile
});

export const mapDispatchToProps = dispatch => (
  {
    onProviderAction: provider => dispatch(providerAction(provider)),

    changeRegisterBasic: (
      firstName,
      lastName,
      birthday,
      ddd,
      gender,
      typePerson,
      document,
      phone,
      email,
      indicationCode
    ) =>
      dispatch(
        changeRegisterBasic(
          firstName,
          lastName,
          birthday,
          ddd,
          gender,
          typePerson,
          document,
          phone,
          email,
          indicationCode
        )
      ),

    changeRegisterAddress: (
      zipCode,
      address,
      number,
      complement,
      neighborhood,
      city,
      state
    ) => dispatch(changeRegisterAddress(zipCode, address, number, complement, neighborhood, city, state)),
    changeRegisterServices: values => dispatch(changeRegisterServices(values)),
    changeRegisterVehicle: (
      car_number,
      car_model,
      car_brand,
      car_color,
      car_manufactoring_year,
      car_model_year) => dispatch(changeRegisterVehicle(
        car_number,
        car_model,
        car_brand,
        car_color,
        car_manufactoring_year,
        car_model_year)),
    changeRegisterBankAccount: (
      accountTitular,
      birthday,
      typeTitular,
      document,
      typeAccount,
      bank,
      agency,
      agencyDigit,
      account,
      accountDigit
    ) => dispatch(changeRegisterBankAccount(accountTitular, birthday, typeTitular, document, typeAccount, bank, agency, agencyDigit, account, accountDigit)),
    changeProviderId: value => dispatch(changeProviderId(value)),
    resetRegister: () => dispatch(resetRegister()),
    onRequestUpdated: request => dispatch(requestUpdated(request)),
  }
);
