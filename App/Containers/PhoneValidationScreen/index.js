// Modules
import React, { Component } from "react"
import { View, Alert, Platform } from "react-native"
import Toast from "react-native-root-toast"
import SmsLogin from "react-native-sms-login"
import { connect } from "react-redux"
import { NavigationActions, StackActions } from "react-navigation"

// Components
import DefaultHeader from "../../Components/DefaultHeader"

// Models
import Provider from "../../Models/Provider"

// Locales
import { strings } from "../../Locales/i18n"

// Themes
import {
  PrimaryButton,
  WPROJECT_NAME,
} from "../../Themes/WhiteLabelTheme/WhiteLabel"

// Service
import ProviderApi from "../../Services/Api/ProviderApi"
import { handlerException } from '../../Services/Exception';

// Store
import {
  changeRegisterBasic,
  changeRegisterAddress,
  changeRegisterServices,
  changeRegisterVehicle,
  changeRegisterBankAccount,
  changeProviderId,
  resetRegister,
  changeVisibleSecurityCode,
  changeRegisterBasicPhone
} from "../../Store/actions/actionRegister"
import { requestUpdated } from "../../Store/actions/request"
import { providerAction } from "../../Store/actions/providerProfile"


//Utils
import * as constants from "../../Util/Constants"
import * as parse from "../../Util/Parse"
export class PhoneValidationScreen extends Component {
  constructor(props) {
    super(props)
    this.provider = null
    this.api = new ProviderApi()

    this.deviceData = {
      token: constants.device_token,
      type: Platform.OS,
    }

    this.state = {
      phoneNumber: "",
    }
  }

  /**
   * return const navigate = this.props.navigation
   */
  returnConstNavigate() {
    const { navigate } = this.props.navigation
    return navigate
  }

  showAlertStep(title, message, button) {
    if (Platform.OS == constants.ANDROID) {
      Alert.alert(title, message, [button], { cancelable: true })
    } else if (Platform.OS == constants.IOS) {
      Alert.alert(title, message, [button], { cancelable: true })
    }
  }

  returnValueSendSms = (responseSendSms) => {
    if (responseSendSms.success) {
      this.setState({ phoneNumber: responseSendSms.cellPhoneNumber })
      if (responseSendSms.login == false) {
        this.props.changeVisibleSecurityCode(true)
        Alert.alert(
          strings("profileProvider.warning"),
          strings("login.cellNotFount"),
          [
            {
              text: strings("general.cancel"),
              onPress: () => { },
              style: "cancel",
            },
            {
              text: strings("general.confirm"),
              onPress: () => this.navToRegister(),
            },
          ],
          { cancelable: false }
        )
      }
    } else {
      parse.showToast(strings("error.try_again"), Toast.durations.LONG)
    }
  }

  returnValueValidateCode = (responseValidationCode) => {
    let responseJson = responseValidationCode.data
    if (responseJson.success == true) {
      this.goToMapScreen(responseJson.provider)
    } else {
      Alert.alert(
        strings("login.warning"),
        strings("login.cellNotFount"),
        [
          {
            text: strings("general.cancel"),
            onPress: () => { },
            style: "cancel",
          },
          {
            text: strings("general.confirm"),
            onPress: () => this.navToRegister(),
          },
        ],
        { cancelable: false }
      )
    }
  }

  navToRegister() {
    this.props.changeRegisterBasicPhone(this.state.phoneNumber)
    this.props.navigation.navigate("RegisterBasicStepScreen")
  }

  /**
 * Prepare information and go to Map Screen
 * @param {json} json (JSON with Provider Information)
 */
  goToMapScreen(expectedJson) {
    let json = expectedJson;

    this.setState({ isLoggingIn: false });
    let statusInfo = json.status_id;
    let screenStep = this.checkRegisterStep(json);

    this.provider = new Provider(
      parseInt(json.id),
      json.first_name,
      json.last_name,
      json.phone.replace("+55 ", ""),
      json.email,
      json.bio,
      json.address,
      json.state,
      json.country,
      json.zipcode,
      "",
      "",
      parseInt(json.types[0]),
      0,
      json.car_model,
      json.car_number,
      "",
      0.0,
      [],
      0,
      0,
      0,
      0,
      0,
      json.picture,
      json.register_step,
      [json.types],
      json.gender,
      json.token,
      "",
      parseInt(json.address_number),
      json.address_complement,
      json.address_neighbour,
      json.address_city,
      json.referral_code,
      [],
      "",
      "",
      0,
      "",
      0,
      "",
      0,
      "",
      "",
      "",
      [],
      0,
      0,
      0,
      0,
      parseInt(json.is_available),
      parseInt(json.is_approved),
      json.status_id,
      json.is_approved_txt,
      0,
      0,
      json.rate,
      json.rate_count,
      json.completed_rides,
      json.cancelated_rides,
      json.ledger_id
    );
    this.provider.setIs_txt_approved(json.is_approved_txt);
    this.provider.setIs_available(json.is_available);
    this.provider.setIs_active(0);
    this.provider.setIs_approved(json.is_approved);
    this.provider.store(constants.PROVIDER_STORAGE);

    this.props.onProviderAction(this.provider)
    /**
     * Create a Provider model and
     * Save model information into Storage
     */
    if (statusInfo == 'APROVADO') {
      this.checkRequestInProgress(this.provider);
    } else if (statusInfo == 'EM_ANALISE') {
      this.provider.setProvider_type([json.type]);

      if (screenStep == "docs" || json.register_step == null || json.register_step == 'approved' || screenStep == "approved") {
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
        this.provider.setRegister_step(json.register_step);
        this.provider.store(constants.PROVIDER_STORAGE);
        this.showAlertStep(
          strings("login.register"),
          strings("login.complete_register_msg", { name: json.first_name }),
          {
            text: strings("login.complete_register"),
            onPress: () =>
              this.navigateToScreen(screenStep, {
                provider: this.provider,
                services: null
              })
          }
        );
      }
    } else if (statusInfo == 'PENDENTE') {
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

  checkRequestInProgress(provider) {
    this.api
      .GetRequestInProgressId(provider._id, provider._token)
      .then((response) => {
        var request = response.data
        if (parse.isSuccess(request, this.returnConstNavigate()) == true) {
          if (request.request_id != -1) {
            this.api
              .GetProviderRequest(
                provider._id,
                provider._token,
                request.request_id
              )
              .then((response) => {
                const details = response.data
                this.props.onRequestUpdated(details)

                this.navigateToScreen(
                  "ServiceUserBoardScreen",
                  request.request_id
                )
              })
              .catch((erro) => {
                handlerException('PhoneValidationScreen', erro);
              })
          } else {
            this.navigateToScreen("MainScreen")
          }
        } else {
          this.navigateToScreen("MainScreen")
        }
      })
      .catch((error) => {
        this.navigateToScreen("LoginMainScreen")
        parse.showToast(strings("error.not_registered"), Toast.durations.SHORT)
        handlerException('PhoneValidationScreen', error);
      })
  }

  /**
   * Check the register step by provider
   */
  checkRegisterStep(json) {
    let screenStep = "approved"
    this.props.resetRegister()
    if (json.register_step == "address") {
      this.props.changeProviderId(json.id)
      this.fillBasicRegisterReducer(json)
      screenStep = "RegisterAddressStepScreen"
    } else if (json.register_step == "vehicle"
      || json.register_step == "services") {// Foi removido a tela de servicos.
      this.props.changeProviderId(json.id)
      this.fillBasicRegisterReducer(json)
      this.fillAddressRegisterReducer(json)
      this.fillServicesRegisterReducer(json)
      screenStep = "RegisterVehicleStepScreen"
    } else if (json.register_step == "bankinginfo") {
      this.props.changeProviderId(json.id)
      this.fillBasicRegisterReducer(json)
      this.fillAddressRegisterReducer(json)
      this.fillServicesRegisterReducer(json)
      this.fillVehicleRegisterReducer(json)
      screenStep = "RegisterBankStepScreen"
    } /*else if (json.register_step == "docs") { Tela não faz parte do app da play store e não foi finalizada
      this.props.changeProviderId(json.id)
      this.fillBasicRegisterReducer(json)
      this.fillAddressRegisterReducer(json)
      this.fillServicesRegisterReducer(json)
      this.fillVehicleRegisterReducer(json)
      this.fillBankAccRegisterReducer(json)
      screenStep = "RegisterDocumentsStepScreen"
    }*/

    return screenStep
  }

  fillBasicRegisterReducer(json) {
    this.props.changeRegisterBasic(
      json.firstName,
      json.lastName,
      json.birthday,
      json.ddd,
      json.gender,
      json.typePerson,
      json.document,
      json.phone,
      json.email,
      json.indicationCode,
      json.picture
    )
  }

  fillAddressRegisterReducer(json) {
    this.props.changeRegisterAddress(
      json.zipcode,
      json.address,
      json.address_number,
      json.address_complement,
      json.address_neighbour,
      json.address_city,
      json.state
    )
  }

  fillServicesRegisterReducer(json) {
    this.props.changeRegisterServices(json.services_types)
  }

  fillVehicleRegisterReducer(json) {
    this.props.changeRegisterVehicle(
      json.car_number,
      json.car_model,
      json.car_brand,
      json.car_color,
      json.car_manufactoring_year,
      json.car_model_year
    );
  }

  fillBankAccRegisterReducer(json) {
    this.props.changeRegisterBankAccount(
      json.bank_account.holder,
      json.bank_account.birthday_date,
      json.bank_account.person_type,
      json.bank_account.document,
      json.bank_account.account_type,
      json.bank_account.bank.id,
      json.bank_account.agency,
      json.bank_account.agency_digit,
      json.bank_account.account,
      json.bank_account.account_digit
    )
  }

  /**
   * Go from Login to Another Screen
   */
  navigateToScreen(screen, request_id = -1) {
    const { navigate } = this.props.navigation

    if (screen == "docs") {
      screen = "RegisterBasicStepScreen"
    }

    /**
     * Navigate to another Screen.
     * First parameter: Screen to be initialized passed in "screen" variable
     * Second parameter: Information sent from CurrentScreen to NextScreen.
     * Use "this.props.navigation.state.params.loginBy" to use data on the other Screen
     */
    if (screen == "RegisterBasicStepScreen") {
      if (this.provider !== null) {
        this.provider.clearModel()
        this.provider.store(constants.PROVIDER_STORAGE)
      }

      navigate(screen, {
        loginSocial: this.social,
        loginBy: this.login_by,
        device_token: this.deviceData.token,
      })
    } else if (screen == "MainScreen") {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: "MainScreen" })],
        })
      )
    } else if (screen == "ServiceUserBoardScreen") {
      navigate(screen, {
        provider: this.provider,
        screen: "LoginMainScreen",
        request_id: request_id,
      })
    } else {
      navigate(screen, { provider: this.provider, screen: "LoginMainScreen" })
    }
  }

  render() {
    return (
      <View>
        <DefaultHeader
          btnBackListener={() => this.props.navigation.navigate('LoginMainScreen')}
          title={strings('profileProvider.basicData')}
        />
        <SmsLogin
          placeholderText={strings("login.digitCellPhoneNumber")}
          buttonConfirmText={strings("general.confirm")}
          buttonColor={PrimaryButton}
          textDescription={strings("login.digitYourNumber")}
          buttonSendText={strings("general.send")}
          codeSentTitle={strings("login.digitCode")}
          secCodeLenght={5}
          routeSendNumber={constants.SEND_SMS_URL}
          routSendSecCode={constants.LOGIN_CELLPHONE}
          showMaskPhone={true}
          returnRequestSendSms={this.returnValueSendSms.bind(
            this.responseRequestSendSms
          )}
          returnRequestValidateCode={this.returnValueValidateCode.bind(
            this.responseRequestValidateCode
          )}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  settings: state.settingsReducer.settings,
  basicFilled: state.registerReducer.basicFilled,
})

const mapDispatchToProps = (dispatch) => ({
  onProviderAction: (provider) => dispatch(providerAction(provider)),

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
    indicationCode,
    picture
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
        indicationCode,
        picture
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
  ) =>
    dispatch(
      changeRegisterAddress(
        zipCode,
        address,
        number,
        complement,
        neighborhood,
        city,
        state
      )
    ),
  changeRegisterServices: (values) => dispatch(changeRegisterServices(values)),
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
  ) =>
    dispatch(
      changeRegisterBankAccount(
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
      )
    ),
  changeProviderId: (value) => dispatch(changeProviderId(value)),
  resetRegister: () => dispatch(resetRegister()),
  onRequestUpdated: (request) => dispatch(requestUpdated(request)),
  changeVisibleSecurityCode: (value) => dispatch(changeVisibleSecurityCode(value)),
  changeRegisterBasicPhone: value => dispatch(changeRegisterBasicPhone(value))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneValidationScreen)
