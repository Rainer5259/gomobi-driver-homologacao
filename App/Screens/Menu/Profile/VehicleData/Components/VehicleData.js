"use strict";

// Modules
import React, { useRef } from "react";
import {
  ScrollView,
  View,
  BackHandler,
  Platform
} from "react-native";
import Toast from "react-native-root-toast";

//  Custom components
import Button from "../../../../../Components/RoundedButton";
import DefaultHeader from "../../../../../Components/DefaultHeader";

// Locales
import { strings } from "../../../../../Locales/i18n";

// Services
import { handlerException } from '../../../../../Services/Exception';

// hooks
import useVehicleLoadValues from './hooks/useVehicleLoadValues';
import useVehicleTexts from './hooks/useVehicleTexts';

// Store
import { changeRegisterVehicle } from '../../../../../Store/actions/actionRegister'
import { changeProviderVehicle } from "../../../../../Store/actions/actionProvider";

// Utils
import * as parse from "../../../../../Util/Parse";
import _ from 'lodash';

// Styles
import styles from "./styles";
import FormFieldsVehicle, { Form } from "./Inputs/FormFieldsVehicle";
import { VehicleApi } from "../Service/VehicleApi";


export default class VehicleData extends FormFieldsVehicle {

  NEXT_SCREEN = 'RegisterBankStepScreen';
  PREV_SCREEN = 'RegisterAddressStepScreen';

  constructor(props) {
    super(props)
    this.vehicleApi = new VehicleApi();
    this.editScreen = props.editScreen;
    this.useVehicleText = useVehicleTexts(this.editScreen);
    this.useLoadValues = useVehicleLoadValues();
  }

  componentDidMount() {

    BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.editScreen) {
        this.props.navigation.navigate("EditProfileMainScreen")
      } else {
        this.props.navigation.navigate("RegisterAddressStepScreen")
      }
      return true
    });

    this.useLoadValues.deleteInfoByStorage();
    this.loadInfo();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress")
  }

  /**
   * @description Carrega as informacoes do motorista logado ou do storage
   * (Se carregar do storage a tela foi fechada na hora do cadastro)
   */
  async loadInfo() {
    const data = await this.useLoadValues.getProviderVehicleInformation(this.props, this.editScreen);
    if (!!data?.value) {
      this.onChange.bind(this)(data.value);
    }
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
   * @param {boolean}  editScreen (Se é aberto vi perfil) Só salva as info no stoge caso esteja no cadastro iniciado do botão registrar
   * @param {Object} prevState Valores anteriores de cada campo.
   * @returns {Boolean} Caso for alterado algum valor de campo que precisa ser salvo no storage.
   */
  verifyToSaveInfo(prevState) {
    return !this.editScreen && !_.isEmpty(this.state.value);
  }

  /**
   * return const navigate = this.props.navigation
   */
  returnConstNavigate() {
    const { navigate } = this.props.navigation;
    return navigate;
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
   * BackHandler, go Back To Previous State
   * Ex: If the cam is actived, close the camera and show Register screen
   * If the register screen is open, so go to login screen.
   */
  goBackToPreviousState() {
    this.props.navigation.navigate(this.PREV_SCREEN);
  }

  /**
   * @description Verifica qual estado atualizar, visto que temos dois para a mesma coisa,
   * um para quando esta editando o cadastro do veiculo e um quando esta inserindo a primeira
   * vez as informacoes do veiculos
   */
  updateStateGlobalVehicle() {
    const action = this.editScreen
      ? this.props.changeProviderVehicle
      : this.props.changeRegisterVehicle;

    action(
      this.state.value.carNumber,
      this.state.value.carModel,
      this.state.value.carBrand,
      this.state.value.carColor,
      this.state.value.carManufaturingYear,
      this.state.value.carModelYear);
  }

  /**
   * Call the Register API and go to Map Screen
   */
  async registerVehicle() {
    try {
      this.setState({ isLoading: true });

      const value = this._formRef.getValue();

      if (value) {

        const id = this.editScreen ? this.props.provider._id : this.props.addProviderId;

        const response = await this.vehicleApi.registerOrUpdate(
          id,
          this.getVariables(value),
          this.props.latitude,
          this.props.longitude
        );

        this.setState({ isLoading: false });
        let responseJson = response.data

        if (parse.isSuccess(responseJson, this.returnConstNavigate()) == true) {
          this.updateStateGlobalVehicle();
          parse.showToast(strings('register.sucesseRegisterVehicle'), Toast.durations.LONG)

          if (!this.editScreen) {// Caso não seja a tela de edição e sim o cadastro de passo-a-passo
            this.props.navigation.navigate(this.NEXT_SCREEN)
          } else {
            this.props.navigation.navigate('EditProfileMainScreen')
          }
        } else {
          parse.showToast(responseJson.error_messages[0], Toast.durations.LONG)
        }
      } else {
        parse.showToast(strings("error.correctly_fill"), Toast.durations.SHORT)
      }

      this.setState({ isLoading: false });

    } catch (error) {
      this.setState({ isLoading: false });
      parse.showToast(strings("error.try_again"), Toast.durations.LONG)
      const keyError = !this.editScreen ? 'RegisterVehicleStepScreen' : 'EditVehicleStepScreen';
      handlerException(keyError, error);
    }
  }

  getVariables(value) {
    return {
      car_number: value.carNumber,
      car_model: value.carModel,
      car_brand: value.carBrand,
      car_color: value.carColor,
      car_manufactoring_year: value.carManufaturingYear,
      car_model_year: value.carModelYear,
    }
  }

  callRegisterVehicle() {
    return this.editScreen ? this.notifyEditVehicle() : this.registerVehicle();
  }

  handlePress() {
    if (this.editScreen) {
      this.props.navigation.goBack();
    } else {
      this.props.navigation.navigate(this.PREV_SCREEN)
    }
  }

  handleNextPress() {
    if (!this.editScreen) {
      this.props.navigation.navigate('RegisterBankStepScreen')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.parentContainer} keyboardShouldPersistTaps="handled">
            <DefaultHeader
              loading={this.state.isLoading}
              loadingMsg={this.useVehicleText.labelLoader}
              btnBack={true}
              btnBackListener={this.handlePress.bind(this)}
              btnNext={this.props.vehicleFilled && !this.editScreen}
              btnNextListener={this.handleNextPress.bind(this)}
              title={this.useVehicleText.labelTitle}
            />

            <View style={styles.sectionInputs}>
              <Form
                ref={ref => (this._formRef = ref)}
                type={this.getForm()}
                options={this.getOptionsInput()}
                value={this.state.value}
                onChange={this.onChange.bind(this)}
              />
              <Button
                text={this.useVehicleText.labelConfirm}
                onPress={() => this.callRegisterVehicle()}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export const mapDispatchToProps = (dispatch) => ({
  changeRegisterVehicle: (
    car_number,
    car_model,
    car_brand,
    car_color,
    car_manufactoring_year,
    car_model_year) =>
    dispatch(
      changeRegisterVehicle(
        car_number,
        car_model,
        car_brand,
        car_color,
        car_manufactoring_year,
        car_model_year)
    ),
  changeProviderVehicle: (
    car_number,
    car_model,
    car_brand,
    car_color,
    car_manufactoring_year,
    car_model_year) =>
    dispatch(
      changeProviderVehicle(
        car_number,
        car_model,
        car_brand,
        car_color,
        car_manufactoring_year,
        car_model_year)
    ),



});
