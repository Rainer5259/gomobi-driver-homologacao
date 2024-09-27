"use strict";
// Modules
import React, { Component } from "react";
import {
  Platform,
  BackHandler,
  Keyboard,
} from "react-native";
import Toast from "react-native-root-toast";
import Geolocation from "react-native-geolocation-service";

// Locales
import { strings } from "../../../../../Locales/i18n";

// Models
import Provider from "../../../../../Models/Provider";

// Services
import ProviderApiFormData from "../../../../../Services/Api/ProviderApiFormData";

/**
 * @description Labels fields
 */

// Utils
import * as parse from "../../../../../Util/Parse";
import * as constants from "../../../../../Util/Constants";

//Components
import Container from "../../../../../Components/Views/Container";
import useValidator from "../../../../../Hooks/useValidator";
import useBasicData, {
  BIRTH_DATE,
  CNPJ,
  CONFIRM_PASSWORD,
  DOCUMENT,
  EMAIL,
  FIRST_NAME,
  GENDER,
  LAST_NAME,
  PASSWORD,
  PHONE,
  TYPE_PERSON,
  msgErrorFirstName,
  msgErrorLastName,
  msgErrorDocument,
  msgErrorDocumentCnpj,
  msgErrorEmptyDocument,
  msgErrorEmptyDocumentCnpj,
  msgErrorEmail,
  msgErrorEmptyEmail,
  msgErrorBirthDate18,
  msgErrorDate,
  msgErrorPhone,
  msgErrorGender,
  msgErrorPassword,
  msgErrorConfirmPassword,
  msgErrorPasswordDiff,
  msgErrorPasswordLength,
  INDICATION_CODE,
} from "./../hooks/useBasicData";

import _, { times } from "lodash";
import moment from "moment";
import { handlerException } from "../../../../../Services/Exception";
import AcceptTerms from "../../../../../Components/AcceptTerms";
import Avatar from "../../../../../Components/Avatar";
import ModalReferrals from "../../../../../Components/Modal/Referrals";

import useLoadValuesRBSS from "../hooks/useLoadValuesRBSS";
import { Images } from "../../../../../Themes";

import { providerAction } from "../../../../../Store/actions/providerProfile";
import { changeProviderBasic, changeProviderData, changeToken } from "../../../../../Store/actions/actionProvider";
import { changeProviderId, changeRegisterBasic, resetRegister } from "../../../../../Store/actions/actionRegister";

export default class BasicData extends Component {

  PREV_SCREEN = "EditProfileMainScreen"
  NEXT_SCREEN = "RegisterAddressStepScreen";

  useValidator = useValidator();
  useBasicData = useBasicData();
  useLoadValues = useLoadValuesRBSS();

  constructor(props) {
    super(props);

    this._imageUpload = React.createRef();
    this.state = {
      value: {
        firstName: "",
        lastName: "",
        document: "",
        birthday: moment().format('L'),
        gender: "",
        document2: "",
        typePerson: "",
        ddd: "",
        phone: "",
        email: "",
        indicationCode: "",
        password: "",
        confirmPassword: "",
      },
      picture: "",
      avatarSource: Images.avatar_register,
      errors: new Map(),
      social_unique_id: "",
      isLoggingIn: false,
      provider_referral_field: this.providerReferralField(),
      editable: !this.isPendent(),
      editableIndicationCode: true,
      termsAccepted: false,
      modalReferral: false,
      modalVisible: false,
    };

    // Device data
    this.deviceData = {
      token: "0",
      type: Platform.OS,
    };

    this.rotation = 0;
    this.login_by = "manual";

    // API settings
    this.api = new ProviderApiFormData();
  }

  /**
 * @description Carrega as informacoes do motorista logado ou do storage
 * (Se carregar do storage a tela foi fechada na hora do cadastro)
 */
  async loadInfo() {
    const data = await this.useLoadValues.getProviderInformation(this.props, this.state);
    if (data) {
      this.setState({
        value: {
          ...this.state.value, ...data.value
        },
        editableIndicationCode: !data.value[INDICATION_CODE]
      });
    }
  }

  isPendent = () => {
    return this.props.settings.is_approved_provider_name_update_enabled == 0 &&
      !["PENDENTE", "EM_ANALISE"].includes(this.props.provider._status_id);
  }

  providerReferralField() {
    return this.props.settings.show_provider_referral_field == "1" ? false : true;
  }


  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.props.editScreen) {
        this.props.navigation.navigate("EditProfileMainScreen")
      } else {
        this.exitRegister();
      }

      return true
    });

    // Getting the provider information
    await this.loadInfo();

    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    if (this.props.editScreen) {

      Geolocation.getCurrentPosition(
        (position) => {
          let region2 = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922 * 1.5,
            longitudeDelta: 0.00421 * 1.5,
          };

          this.setState({
            region: region2,
            lastLat: position.coords.latitude,
            lastLong: position.coords.longitude,
          });
        },
        (error) => {
          Geolocation.getCurrentPosition(
            (position) => {
              let region2 = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.00922 * 1.5,
                longitudeDelta: 0.00421 * 1.5,
              };

              this.setState({
                region: region2,
                lastLat: position.coords.latitude,
                lastLong: position.coords.longitude,
              });
            },
            (error) => {
              this.useValidator.showAlert(2);
              this.setState({ region: 0, lastLat: 0, lastLong: 0 });
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 1000,
        }
      );
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress")
  }

  /**
   * return const navigate = this.props.navigation
   */
  returnConstNavigate() {
    const { navigate } = this.props.navigation;
    return navigate;
  }

  onPress() {
    this.register();
  }

  onChange(field, value) {
    this.setState({ value: { ...this.state.value, [field]: value } });
  }

  verifyFields() {
    return this.handleValidation();
  }

  setValueDocument = () => {
    const value = this.getValue(TYPE_PERSON) == 'f' ?
      this.getValue(DOCUMENT) :
      this.getValue(CNPJ)
    this.state.value.document = this.useValidator.removeSpecialCaracter(value);
  }

  getDateBirthDay() {
    return moment(this.state.value.birthday, 'DD-MM-YYYY');
  }

  getValueDate = () => {
    const date = this.getDateBirthDay().format('DD-MM-YYYY');
    return date;
  }

  getLatitude() {
    return !this.props.editScreen ? this.props.latitude : this.state.lastLat.toString()
  }

  getLongitude() {
    return !this.props.editScreen ? this.props.longitude : this.state.lastLong.toString()
  }

  hasNeedToVerifyTerms() {
    return !this.props.editScreen && this.state.termsAccepted;
  }

  cleanFieldsInvisibility() {
    if (this.getValue(TYPE_PERSON) === 'j') {
      this.state.value.gender = "";
      this.state.value.birthday = "";
      this.state.value.lastName = "";
    }
  }

  actionPost() {

    this.cleanFieldsInvisibility();
    return this.api.RegisterOrUpdateBasicData(
      {
        provider_id: this.props.editScreen ? this.props.provider._id : null,
        first_name: this.state.value.firstName,
        last_name: this.state.value.lastName,
        document: this.state.value.document,
        email: this.state.value.email,
        password: this.state.value.password,
        confirm_password: this.state.value.confirmPassword,
        gender: this.state.value.gender,
        phone: this.state.value.phone,
        phone_valid: 1,
        referral_code: this.state.value.indicationCode?.toLocaleLowerCase(),
        picture: this.state.picture,
        rotation: this.rotation,
        accept_terms: true,
        device_token: this.deviceData.token,
        device_type: this.deviceData.type,
        login_by: this.login_by,
        social_unique_id: this.state.social_unique_id,
        birthday: this.state.value.birthday,
        Latitude: this.getLatitude(),
        Longitude: this.getLongitude(),
      }
    );
  }

  /**
   *
   * @param {ResponseJson} responseJson method called when is updated driver basic info
   */
  changeProviderEditTreatment(responseJson) {
    if (!this.props.editScreen) return;

    this.changeInfoBasic();

    let changedToken = responseJson.provider.token;
    this.props.changeToken(changedToken);
    let arrayProviderAux = this.props.providerProfile;
    arrayProviderAux._token = changedToken;
    this.props.onProviderAction(arrayProviderAux);
    Provider.require(Provider);
    Provider.restore(constants.PROVIDER_STORAGE).then((provider) => {
      if (provider !== null) {
        this.provider = provider;
        this.provider.setToken(changedToken);
        this.provider.store(constants.PROVIDER_STORAGE);
      }
    });
  }

  /**
   *
   * @param {ResponseJson} responseJson method called when is a new driver
   */
  changeProviderRegisterTreatment(responseJson) {
    if (this.props.editScreen) return;
    this.props.changeProviderId(responseJson.provider.id);
    this.changeInfoBasic();
  }

  changeInfoBasic() {
    const action = this.props.editScreen ?
      this.props.changeProviderBasic :
      this.props.changeRegisterBasic;

    let cpf, cnpj;
    switch (this.state.value.typePerson) {
      case 'f': cpf = this.state.value.document; break;
      case 'j': cnpj = this.state.value.document; break;
      default: break;
    }

    action(
      this.state.value.firstName,
      this.state.value.lastName,
      this.getValueDate(),
      this.state.value.ddd,
      this.state.value.gender,
      this.state.value.typePerson,
      this.state.value.document,
      cpf,
      cnpj,
      this.state.value.phone,
      this.state.value.email,
      this.state.value.indicationCode,
      this.state.picture
    );
  }

  /**
  * Call the Update API
  */
  async register() {

    if (this.verifyFields()) {
      if (!this.props.editScreen && !this.state.termsAccepted) {
        parse.showToast(strings("register.accept_terms_of_use"));
        return;
      }
      this.setValueDocument();
      this.setState({ isLoggingIn: true });

      try {
        const response = await this.actionPost();

        const responseJson = response.data;

        this.setState({ isLoggingIn: false });
        if (parse.isSuccess(responseJson, this.returnConstNavigate()) == true) {

          this.changeProviderEditTreatment(responseJson);
          this.changeProviderRegisterTreatment(responseJson);

          this.setState({ editableIndicationCode: !this.state.value?.indicationCode });
          parse.showToast(
            strings("register.successRegisterBasic"),
            Toast.durations.LONG
          );

          this.props.navigation.navigate(this.props.editScreen ?
            "EditProfileMainScreen" :
            "RegisterAddressStepScreen");

        } else {
          parse.showToast(responseJson.error_messages[0], Toast.durations.LONG);
        }
      } catch (error) {
        this.setState({ isLoggingIn: false });
        parse.showToast(strings("error.try_again"), Toast.durations.LONG);

        handlerException(this.props.editScreen ?
          "EditProfileMainScreen" :
          "RegisterAddressStepScreen", error);

      } finally {
        this.setState({ isLoggingIn: false });
      }
    } else {
      parse.showToast(strings("error.correctly_fill"), Toast.durations.SHORT);
    }
  }

  /**
   * @description Metodo retorna true caso nao tenha fielEvent que quer dizer que esta sendo chamado no submit do form,
   * no caso sendo uma garantia de validar todos os campos antes de enviar para a API
   * @param {String} field
   * @param {String} fieldEvent
   * @returns boolean
   */
  verifyByFieldOrAll(field, fieldEvent, ignoreValue) {
    return ([undefined, null, field].includes(fieldEvent)) && (ignoreValue || !this.state.value[field]);
  }

  /**
   * @description Verifica se o evento atual é no campo de cpf or cnpj e se a informacao esta valida
   * @param {String} fieldEvent
   * @returns
   */
  checkCPF = (fieldEvent, type) => {
    return this.getValue(TYPE_PERSON) == 'f' &&
      this.verifyByFieldOrAll('document', fieldEvent, true) &&
      !this.useValidator.isValidCPForCNPF('cpf', this.state.value.document);
  }

  checkCnpj = (fieldEvent, type) => {
    return this.getValue(TYPE_PERSON) == 'j' &&
      this.verifyByFieldOrAll('document2', fieldEvent, true) &&
      !this.useValidator.isValidCPForCNPF('cnpj', this.state.value.document2);
  }

  /**
   * @description Quando o campo estiver vazio usa as mensagens de f ou j conforme o valor do campo typePerson
   * @description Quando o campo estiver com valor inválido usa as mensagens
   * de fi ou ji conforme o valor do campo typePerson concatenado com i de invalido
   * @returns {String} Mensagem de erro para cpf ou cnpj
   */
  getMsgPerson = () => {
    return {
      'f': msgErrorDocument,
      'j': msgErrorDocumentCnpj,
      'fi': msgErrorEmptyDocument,
      'ji': msgErrorEmptyDocumentCnpj,
    }
  }

  getMsgErrorCpfCnpj = (name) => {
    return this.getMsgPerson()[`${this.getValue(TYPE_PERSON)}${this.isNull(TYPE_PERSON) ? 'i' : ''}`];
  }

  checkEmail = (fieldEvent) => {
    return this.verifyByFieldOrAll('email', fieldEvent, true)
      && !this.useValidator.isValidEmail(this.state.value.email);
  }

  getValue = (name) => {
    return this.state.value[name];
  }

  isNull = (name) => {
    return !this.getValue(name);
  }

  hasVerifyGenderBirthdayLastName() {
    return this.getValue(TYPE_PERSON) === 'f';
  }


  checkBirthDay(newErrors, fieldEvent) {
    if (!this.hasVerifyGenderBirthdayLastName()
      && !this.verifyByFieldOrAll(BIRTH_DATE, fieldEvent, true)) return newErrors;

    const birthDate = moment(this.state.value.birthday, 'DD/MM/YYYY');
    const today = moment();
    const age = today.diff(birthDate, 'years');

    let msg = '';

    if (!birthDate) {
      msg = msgErrorDate;
    } else if (age < 18) {
      msg = msgErrorBirthDate18;
    }

    return this.setMsgError(msg, BIRTH_DATE, newErrors);
  }

  setMsgError(msg, field, newErrors) {
    if (msg) {
      newErrors.set(field, msg)
    } else {
      newErrors.delete(field);
    }
    return newErrors;
  }

  hasPasswordsDiff(confirmPassword) {
    return (confirmPassword &&
      this.state.value.password !== confirmPassword)
  }

  hasErrorLengthMinPassword(password) {
    return password.length < 6;
  }

  checkPicture = (newErrors, fieldEvent) => {

    if (this.props.editScreen) return newErrors;
    if (fieldEvent) return newErrors;

    const picture = this.state.picture;
    let msg = '';

    if (!picture) {
      msg = strings("register.empty_picture");
      this.useValidator.showAlert(0);
    }

    return this.setMsgError(msg, 'picture', newErrors);
  };

  checkPassword(newErrors, fieldEvent) {
    if (this.props.editScreen) return newErrors;
    if (!this.verifyByFieldOrAll(PASSWORD, fieldEvent, true)) return newErrors;

    const password = this.state.value.password;
    let msg = '';

    if (!password) {
      msg = msgErrorPassword;
    } else if (this.hasErrorLengthMinPassword(password)) {
      msg = msgErrorPasswordLength;
    }
    return this.setMsgError(msg, PASSWORD, newErrors);
  }

  checkConfirmPassword(newErrors, fieldEvent) {
    if (this.props.editScreen) return newErrors;
    if (!this.verifyByFieldOrAll(CONFIRM_PASSWORD, fieldEvent, true)) return newErrors;

    const confirmPassword = this.state.value.confirmPassword;
    let msg = '';

    if (!confirmPassword) {
      msg = msgErrorConfirmPassword;
    } else if (this.hasPasswordsDiff(confirmPassword)) {
      msg = msgErrorPasswordDiff;
    }

    return this.setMsgError(msg, CONFIRM_PASSWORD, newErrors);
  }

  /**
   * @description Evento generico de tratar erros por evento de blur onde é passado o nome do campo
   * @description Evento dispara no submit do form sem passar parametro, por isso a chamada do metodo verifyByFieldOrAll
   * @param {String} fieldEvent
   * @returns
   */
  handleValidation = (fieldEvent) => {
    let newErrors = this.state.errors;

    if (this.verifyByFieldOrAll('firstName', fieldEvent))
      newErrors.set(FIRST_NAME, msgErrorFirstName);
    else newErrors.delete(FIRST_NAME);

    if (this.hasVerifyGenderBirthdayLastName() && this.verifyByFieldOrAll('lastName', fieldEvent))
      newErrors.set(LAST_NAME, msgErrorLastName);
    else newErrors.delete(LAST_NAME);

    if (this.verifyByFieldOrAll('phone', fieldEvent))
      newErrors.set(PHONE, msgErrorPhone);
    else newErrors.delete(PHONE);

    if (this.hasVerifyGenderBirthdayLastName() && this.verifyByFieldOrAll('gender', fieldEvent))
      newErrors.set(GENDER, msgErrorGender);
    else newErrors.delete(GENDER);

    if (this.checkCPF(fieldEvent))
    newErrors.set(DOCUMENT, this.getMsgErrorCpfCnpj(fieldEvent));
    else newErrors.delete(DOCUMENT);

    if (this.checkCnpj(fieldEvent))
    newErrors.set(CNPJ, this.getMsgErrorCpfCnpj(fieldEvent));
    else newErrors.delete(CNPJ);

    if (this.checkEmail(fieldEvent))
    newErrors.set(EMAIL, this.isNull(fieldEvent) ? msgErrorEmptyEmail : msgErrorEmail);
    else newErrors.delete(EMAIL);

    newErrors = this.checkPicture(newErrors, fieldEvent);
    newErrors = this.checkBirthDay(newErrors, fieldEvent);
    newErrors = this.checkPassword(newErrors, fieldEvent);
    newErrors = this.checkConfirmPassword(newErrors, fieldEvent);


    this.setState({ errors: newErrors });

    return newErrors.size === 0;
  };

  setError = (fieldEvent) => {
    this.handleValidation(fieldEvent)
  }

  clearError = (field) => {
    const cloneErrors = _.clone(this.state.errors);
    cloneErrors.delete(field);
    this.setState({ errors: cloneErrors });
  }

  /**
   * @description Quando for cnpj precisamos esconder
   * data de nascimento e genero, por se tratar de empresa.
   *
   * @description Quando a opcao de cpf for selecionar
   * esconde o campo cnpj e deixa visble o campo cpf e assim ao contrario
   *
   * @description se estiver na tela de novo motorista mostra os campos de senha
   * @param {String} fieldName NOME do campo
   * @returns boolean
   */
  onChangeVisible = (fieldName) => {
    if ([BIRTH_DATE, GENDER, LAST_NAME].includes(fieldName)) {
      return this.getValue(TYPE_PERSON) === 'f';
    } else if ([DOCUMENT].includes(fieldName)) {
      return this.getValue(TYPE_PERSON) === 'f';
    } else if ([CNPJ].includes(fieldName)) {
      return this.getValue(TYPE_PERSON) === 'j';
    } else if ([PASSWORD, CONFIRM_PASSWORD].includes(fieldName)) {
      return !this.props.editScreen;
    }
    return true;
  }

  /**
   *
   * @param {String} nextField campo a ser focado
   * @description verifica qual tipo de pessoa selecionada para saber em qual campo vai focar,
   * @returns
   */
  submitFirstName(nextField, eventField) {
    if (![FIRST_NAME].includes(eventField)) return nextField;
    let next = this.getValue(TYPE_PERSON) === 'f' ? LAST_NAME : EMAIL;
    return next;
  }

  /**
 *
 * @param {String} nextField campo a ser focado
 * @description verifica qual tipo de pessoa selecionada para saber em qual campo vai focar,
 * @returns
 */
  submitCpfOrCNPJ(nextField, eventField) {
    if (![CNPJ, DOCUMENT].includes(eventField)) return nextField;

    let next = this.getValue(TYPE_PERSON) === 'f' ? BIRTH_DATE :
      this.props.editScreen ? INDICATION_CODE : PASSWORD;
    return next;
  }

  submitEmail(nextField, eventField) {
    if (![EMAIL].includes(eventField)) return nextField;
    let next = this.getValue(TYPE_PERSON) === 'f' ? DOCUMENT : CNPJ;
    return next;
  }

  /**
   *
   * @param {String} nextField campo a ser focado
   * @description Quando esta na tela de edicao os campos de senhas não existem, entao o foco vai
   * para o campo de indicacao quando estao invisiveis e quando estao visiveis o foco para para o campo password
   * @returns
   */
  submitGender(nextField, eventField) {
    if (![GENDER].includes(eventField)) return nextField;
    return this.props.editScreen ? INDICATION_CODE : PASSWORD;
  }

  submitPhone(nextField, eventField) {
    if (![PHONE].includes(eventField)) return nextField;
    let next = this.props.editScreen ? INDICATION_CODE : PASSWORD;
    next = this.getValue(TYPE_PERSON) === 'f' ? BIRTH_DATE : next;
    return next;
  }

  /**
   *
   * @param {String} nextField campo a ser focado
   * @param {String} eventField campo efetuando o submit
   * @returns
   */
  onSubmitEditing = (nextField, eventField) => {

    nextField = this.submitFirstName(nextField, eventField);
    nextField = this.submitEmail(nextField, eventField);
    nextField = this.submitCpfOrCNPJ(nextField, eventField);
    nextField = this.submitGender(nextField, eventField);
    nextField = this.submitPhone(nextField, eventField);

    if (typeof nextField === 'boolean') {
      return this.register();
    }

    if (nextField) {
      const ref = this[`ref${nextField}`];
      ref.focus();
    }
  }

  addRef(name, ref) {
    this[`ref${name}`] = ref;
  }

  handlePress() {
    if (!this.props.editScreen) {
      this.exitRegister()
    } else {
      this.props.navigation.navigate(this.PREV_SCREEN)
    }
  }

  handleNextPress() {
    if (!this.props.editScreen) {
      this.props.navigation.navigate(this.NEXT_SCREEN);
    }
  }

  getLabelButtonSave() {
    return this.props.editScreen ? "register.save" : "register.next_step";
  }

  getLabelLoader() {
    return this.props.editScreen ? "register.updating" : "register.creating-provider";
  }

  setImageState(image) {
    this.setState({
      avatarSource: { uri: image.picture.uri },
      picture: image.picture,
      modalVisible: false,
    });

    this.state.errors.delete('picture');
  }

  photoBothEnable(visible) {
    this.setState({ modalVisible: visible });
  }

  /**
  * Validate open mode according of settings user_picture
  */
  changePhoto() {
    if (this.props.settings.provider_picture == 'camera') {
      this._imageUpload.current.launchCamera()
    } else if (this.props.settings.provider_picture == 'gallery') {
      this._imageUpload.current.launchImageLibrary()
    } else {
      this.photoBothEnable(true);
    }
  }

  navigateToScreenTerms() {
    this.props.navigation.navigate("TermsScreen");
  }

  handleAcceptTerms() {
    this.setState({ termsAccepted: !this.state.termsAccepted });
  }

  getLabel = (name, label) => {
    if (name == FIRST_NAME) {
      return this.getValue(TYPE_PERSON) === 'j' ? 'Razão social' : label;
    }
    return label;
  }

  render() {
    return (
      <Container
        actionForm={() => this.register()}
        labelAction={strings(this.getLabelButtonSave())}
        isLoading={this.state.isLoggingIn}
        labelLoader={strings(this.getLabelLoader())}
        //disabledButtonAction={this.state.editable}

        headerProps={{
          handleBackPress: this.handlePress.bind(this),
          handleNextPress: this.handleNextPress.bind(this),
          isBackButtonVisible: true,
          isNextButtonVisible: this.props.basicFilled,
          title: strings("profileProvider.basicData")
        }}>

        {!this.props.editScreen &&
          <Avatar
            refImage={this._imageUpload}
            modalVisible={this.state.modalVisible}
            photoBothEnable={this.photoBothEnable.bind(this)}
            setImageState={this.setImageState.bind(this)}
            changePhoto={this.changePhoto.bind(this)}
            avatarSource={this.state.avatarSource}
          />
        }
        {this.useBasicData.getFields().map((
          { name,
            label,
            Component,
            type,
            nextField,
            items,
            secureTextEntry
          }) =>
          <Component
            inputRef={ref => this.addRef(name, ref)}
            key={name}
            label={this.getLabel(name, label)}
            name={name}
            value={this.state.value[name]}
            type={type}
            setDDD={(ddd) => this.setState({ ...this.state.value, ddd })}
            ddd={this.state.value.ddd}
            items={items}
            error={{ msgError: this.state.errors.get(name) }}
            setError={this.setError.bind(this)}
            clearError={this.clearError.bind(this)}
            visible={this.onChangeVisible.bind(this, name)()}
            onValueChange={this.onChange.bind(this)}
            onSubmitEditing={this.onSubmitEditing.bind(this, nextField, name)}
            nextField={nextField}
            editable={this.state.editable && (name != INDICATION_CODE || this.state.editableIndicationCode)}
            secureTextEntry={secureTextEntry}
          />
        )}

        {!this.props.editScreen &&
          <>
            <AcceptTerms
              value={this.state.termsAccepted}
              onPress={this.navigateToScreenTerms.bind(this)}
              setTermsAccepted={this.handleAcceptTerms.bind(this)}
            />

            <ModalReferrals
              modalReferral={this.state.modalReferral}
              setModalReferral={(modalReferral) => this.setState({ modalReferral })}
              copyReferralCode={(code) => this.copyReferralCode(code)}
            />
          </>
        }
      </Container>
    );
  }
}

export const mapDispatchToProps = (dispatch) => ({
  changeProviderId: value => dispatch(changeProviderId(value)),
  onProviderAction: (provider) => dispatch(providerAction(provider)),
  changeProviderData: (values) => dispatch(changeProviderData(values)),
  changeToken: (value) => dispatch(changeToken(value)),
  resetRegister: () => dispatch(resetRegister()),
  changeProviderBasic: (
    firstName,
    lastName,
    birthday,
    ddd,
    gender,
    typePerson,
    document,
    cpf,
    cnpj,
    phone,
    email,
    indicationCode,
    picture
  ) => dispatch(changeProviderBasic(
    firstName,
    lastName,
    birthday,
    ddd,
    gender,
    typePerson,
    document,
    cpf,
    cnpj,
    phone,
    email,
    indicationCode,
    picture)),
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
    )
});
