'use strict';

// Modules
import React, { Component } from 'react';
import {
  ScrollView,
  Text,
  View,
  BackHandler,
} from 'react-native';
import moment from 'moment';
import BankForm from 'react-native-bank';
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import { Picker as SelectPicker } from '@react-native-picker/picker';
import useValidator from '../../Hooks/useValidator';

// Components
import Button from '../../Components/RoundedButton';
import TextInputField from '../../Components/Date/TextInputField';
import Lookup from '../../Components/Lookup';

// Locales
import { strings } from '../../Locales/i18n';

// Services
import ProviderApi from '../../Services/Api/ProviderApiFormData';

// Styles
import styles, { formStructConfigSelected } from './styles';


let t = require('tcomb-form-native-codificar');
let Form = t.form.Form;
const stylesheet = formStructConfig(t.form.Form.stylesheet);
const stylesheetSelected = formStructConfigSelected(t.form.Form.stylesheet);

// Store
import {
  changeProviderBankAccount,
  getProviderBankAccount,
} from '../../Store/actions/actionProvider';

// Themes
import {
  formStructConfig,
  projectColors,
} from '../../Themes/WhiteLabelTheme/WhiteLabel';

// Utils
import * as parse from '../../Util/Parse';
import * as constants from '../../Util/Constants';
import DefaultHeader from '../../Components/DefaultHeader';
import { MaskService } from 'react-native-masked-text';

const TypeAccount = t.enums({
  conta_corrente: strings('bank_account.current_account'),
  conta_corrente_conjunta: strings('bank_account.joint_current_account'),
  conta_poupanca: strings('bank_account.saving_account'),
  conta_poupanca_conjunta: strings('bank_account.joint_saving_account'),
});

const banksArray = t.enums({
  bank: 'empty',
});

const validatorIsEmpty = (value) => {
  return !value && strings('register_bank.msg_empty_value');
}

const validatorMaskType = (value, type, options) => {
  return validatorIsEmpty(value) ||
    (!MaskService.isValid(type, value, options) && strings('register_bank.msg_invalid_value'));
};

const validatorEmail = (value) => {
  return validatorIsEmpty(value) ||
    (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) && strings('register_bank.msg_invalid_email'));
}

const pixTypes = [
  {
    value: "random_key",
    type: null,
    options: null,
    label: strings('register_bank.pix_random_key'),
    validator: validatorIsEmpty
  },
  {
    value: "phone",
    type: "cel-phone",
    label: strings('register_bank.pix_phone'),
    options: { withDDD: true, maskType: 'BRL' },
    validator: validatorMaskType
  },
  {
    value: "cpf",
    type: "cpf",
    label: strings('register_bank.pix_cpf'),
    validator: validatorMaskType

  },
  {
    value: "cnpj",
    type: "cnpj",
    label: strings('register_bank.pix_cnpj'),
    validator: validatorMaskType
  },
  {
    value: "email",
    type: null,
    options: null,
    label: strings('register_bank.pix_email'),
    validator: validatorEmail
  }
];

class EditBankStepScreen extends Component {
  constructor(props) {
    super(props);

    this.useValidator = useValidator();

    this.state = {
      update: false,
      valueBank: {
        bank: 1,
        agency: '',
        account: '',
        accountDigit: '',
        agencyDigit: '',
        typeAccount: '',
      },
      valueOtherPerson: {
        typeTitular: '',
      },
      valueTitular: {
        accountTitular: '',
        document: '',
        birthDate: '',
      },
      pix: {
        type: '',
        value: ''
      },
      pixInput: {
        details: {},
        msgError: ""
      },
      document_type: strings('register.document'),
      isLoggingIn: false,
      banks: banksArray,
      maxDocument: 14,
      checkboxState: true,
      isFocusedAccountTitular: false,
      isFocusedDocumentTitular: false,
      isFocusedAccount: false,
      errorAccountTitular: false,
      errorDocumentTitular: false,
      errorMsgDocumentTitular: null,
      errorAccount: false,
      errorAccountDigit: false,
      returnScreen:
        this.props.navigation.state &&
          this.props.navigation.state.params &&
          this.props.navigation.state.params.returnScreen
          ? this.props.navigation.state.params.returnScreen
          : false,
    };

    this.didFocus = this.props.navigation.addListener('didFocus', () => {
      this.setState({ isLoggingIn: false });
    });

    this.api = new ProviderApi();
  }

  componentDidMount() {
    BackHandler.addEventListener('backPress', () => {
      this.props.navigation.navigate('EditProfileMainScreen');
      return true;
    });

    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);

    this.getProviderBankInformation();
  }

  /*
   * Read the provider information from params
   */
  async getProviderBankInformation() {
    if (!this.props.bankAccountProvider.account) {
      this.setState({ isLoadingAccount: true });
      const { _id, _token } = this.props.provider;
      await this.props
        .getProviderBankAccount(_id, _token)
        .catch((error) => {
          parse.showToast(error.message, Toast.durations.SHORT);
        });
      this.setState({ isLoadingAccount: false });
    }

    let providerName =
      this.props.basicProvider.firstName +
      this.props.basicProvider.lastName;
    let valueCheckbox =
      this.props.bankAccountProvider.accountTitular == providerName
        ? true
        : false;
    
     const pixType = this.props.bankAccountProvider?.typePix || 'random_key';

    this.setState({
      checkboxState: valueCheckbox,
      valueBank: {
        agency: this.props.bankAccountProvider.agency,
        account: this.props.bankAccountProvider.account,
        agencyDigit: this.props.bankAccountProvider.agencyDigit,
        accountDigit: this.props.bankAccountProvider.accountDigit,
        typeAccount: this.props.bankAccountProvider.typeAccount,
        bank: this.props.bankAccountProvider.bank,
      },
      valueOtherPerson: {
        typeTitular: this.props.bankAccountProvider.typeTitular,
      },
      valueTitular: {
        accountTitular: this.props.bankAccountProvider.accountTitular,
        document: this.props.bankAccountProvider.document,
        birthDate: this.props.bankAccountProvider.birthday
      },
      pix: {
        type: pixType,
        value: this.props.bankAccountProvider.keyPix
      },
      pixInput: {
        details: pixTypes.find(i => i.value = pixType) || {},
        msgError: ""
      },
      isLoadingAccount: false,
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('backPress');
    this.didFocus.remove();
  }

  formatDate(date) {
    if (typeof date === 'string' && date && date.includes('/')) {
      const [DD, MM, YYYY] = date.split('/');
      return moment(`${YYYY}-${MM}-${DD}`).toDate();
    } else if (typeof date === 'string' && date && date.includes('-')) {
      return moment(date).toDate();
    } else {
      return moment().subtract(18, 'years').toDate();
    }
  };

  getTitularForm() {
    return t.struct({
      accountTitular: t.String,
      document: t.String,
    });
  }

  getForm() {
    return t.struct({
      typeAccount: t.maybe(TypeAccount),
      bank: this.state.banks,
    });
  }

  /**
   * Focus to next input on press next button at keyboard
   * @param {String} input
   * @param {Boolean} hasMask
   */
  focusToNext(input, hasMask = false) {
    if (hasMask)
      this._formRef.getComponent(input).refs.input._inputElement.focus();
    else this._formRef.getComponent(input).refs.input.focus();
  }

  getOptionsInputTitular() {
    let optionsInput = {
      fields: {
        accountTitular: {
          stylesheet: this.state.isFocusedAccountTitular
            ? stylesheetSelected
            : stylesheet,
          hasError: this.state.errorAccountTitular,
          error: strings('register.empty_account_titular'),
          label: strings('register.account_titular'),
          onFocus: () => this.focusAccountTitular(),
          onBlur: () => this.checkAccountTitular(),
        },
        document: {
          stylesheet: this.state.isFocusedDocumentTitular
            ? stylesheetSelected
            : stylesheet,
          maxLength:
            this.props.settings.language !== 'ao'
              ? this.state.maxDocument
              : null,
          hasError: this.state.errorDocumentTitular,
          error: this.state.errorMsgDocumentTitular,
          label: this.state.document_type,
          keyboardType:
            this.props.settings.language !== 'ao'
              ? 'numeric'
              : null,
          onFocus: () => this.focusDocument(),
          onBlur: () =>
            this.props.settings.language !== 'ao'
              ? this.checkDocumentTitular()
              : null,
        },
      },
    };
    return optionsInput;
  }

  focusAccountTitular() {
    this.setState({
      errorAccountTitular: false,
      isFocusedAccountTitular: true,
    });
  }

  checkAccountTitular() {
    this.setState({ isFocusedAccountTitular: false });
    if (!this.state.valueTitular.accountTitular) {
      this.setState({
        accountTitularMsgError: strings(
          'register.empty_account_titular'
        ),
        errorAccountTitular: true,
      });
      return true;
    } else {
      this.setState({ accountTitularMsgError: null });
      return false;
    }
  }

  focusDocument() {
    this.setState({
      errorMsgDocumentTitular: null,
      isFocusedDocumentTitular: true,
      errorDocumentTitular: false,
    });
  }

  checkDocumentTitular() {
    this.setState({ isFocusedDocumentTitular: false });
    if (this.state.valueTitular.document) {
      let formatedDocument = this.state.valueTitular.document;
      formatedDocument = formatedDocument.replace('.', '');
      formatedDocument = formatedDocument.replace('.', '');
      formatedDocument = formatedDocument.replace('-', '');
      formatedDocument = formatedDocument.replace('/', '');

      let errorDocument = null;
      if (
        this.state.valueOtherPerson.typeTitular == 'individual' ||
        this.state.valueOtherPerson.typeTitular == '' ||
        this.state.valueOtherPerson.typeTitular == undefined
      ) {
        errorDocument = !this.checkCPF(formatedDocument);
      } else {
        errorDocument = !this.validateCNPJ(formatedDocument);
      }

      if (errorDocument === true) {
        let msgError =
          this.state.valueOtherPerson.typeTitular == 'company'
            ? strings('register.invalid_document3')
            : strings('register.invalid_document2');
        this.setState({
          errorMsgDocumentTitular: msgError,
          errorDocumentTitular: true,
        });
        return true;
      } else {
        this.setState({
          errorMsgDocumentTitular: null,
          errorDocumentTitular: false,
        });
        return false;
      }
    } else {
      let msgError =
        this.state.valueOtherPerson.typeTitular == 'company'
          ? strings('register.empty_document2')
          : strings('register.empty_document');
      this.setState({
        errorMsgDocumentTitular: msgError,
        errorDocumentTitular: true,
      });
      return true;
    }
  }

  checkAccount() {
    this.setState({ isFocusedAccount: false });
    if (!this.state.valueAccount.account) {
      this.setState({
        errorMsgAccount: strings('register.empty_account_titular'),
        errorAccount: true,
      });
      return true;
    } else {
      this.setState({ errorMsgAccount: null });
      return false;
    }
  }

  checkAccountDigit() {
    this.setState({ isFocusedAccountDigit: false });
    if (!this.state.valueAccountDigit.accountDigit) {
      this.setState({
        errorMsgAccountDigit: strings('register.empty_account_digit'),
        errorAccountDigit: true,
      });
      return true;
    } else {
      this.setState({ errorMsgAccountDigit: null });
      return false;
    }
  }

  checkAgency() {
    this.setState({ isFocusedAgency: false });
    if (!this.state.valueAgency.agency) {
      this.setState({
        errorMsgAgency: strings('register.empty_agency'),
        errorAgency: true,
      });
      return true;
    } else {
      if (this.state.valueAgency.agency.length < 2) {
        this.setState({
          errorMsgAgency: strings('register.agency_min'),
          errorAgency: true,
        });
        return true;
      } else {
        this.setState({ errorMsgAgency: null });
        return false;
      }
    }
  }

  checkAgencyDigit() {
    this.setState({ isFocusedAgencyDigit: false });
    if (!this.state.valueAgencyDigit.agencyDigit) {
      this.setState({
        errorMsgAgencyDigit: strings('register.empty_agency_digit'),
        errorAgencyDigit: true,
      });
      return true;
    } else {
      this.setState({ errorMsgAgencyDigit: null });
      return false;
    }
  }

  /**
   * Validation of the document, function find on: http://www.geradordecpf.org/funcao-javascript-validar-cpf.html
   * @param {string} cpf
   */
  checkCPF = (cpf) => {
    var numeros, digitos, soma, i, resultado, digitos_iguais;
    digitos_iguais = 1;
    if (cpf.length < 11) return false;
    for (i = 0; i < cpf.length - 1; i++)
      if (cpf.charAt(i) != cpf.charAt(i + 1)) {
        digitos_iguais = 0;
        break;
      }
    if (!digitos_iguais) {
      numeros = cpf.substring(0, 9);
      digitos = cpf.substring(9);
      soma = 0;
      for (i = 10; i > 1; i--) soma += numeros.charAt(10 - i) * i;
      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado != digitos.charAt(0)) return false;
      numeros = cpf.substring(0, 10);
      soma = 0;
      for (i = 11; i > 1; i--) soma += numeros.charAt(11 - i) * i;
      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado != digitos.charAt(1)) return false;
      return true;
    } else return false;
  };

  /**
   * Change default values, if checkbox is true or false
   */
  onPressCheckbox() {
    this.setState({ checkboxState: !this.state.checkboxState });
  }

  onChangeOtherTitular(value) {
    if (
      value == 'individual' ||
      value == '' ||
      value == undefined
    ) {
      this.setState({
        valueOtherPerson: { typeTitular: value },
        document_type: strings('register.document'),
        maxDocument: 14,
        valueTitular: {
          accountTitular: '',
          document: '',
        }
      });
    } else if (value == 'company') {
      this.setState({
        valueOtherPerson: { typeTitular: value },
        document_type: strings('register.document'),
        maxDocument: 18,
        valueTitular: {
          accountTitular: '',
          document: '',
        }
      });
    }
  }

  onChangeTitular(value) {
    const titularType = this.state.valueOtherPerson.typeTitular;

    if (
      titularType == 'individual' ||
      titularType == '' ||
      titularType == undefined
    ) {
      value.document =
        this.props.settings.language !== 'ao'
          ? this.maskCpf(value.document)
          : value.document;
    } else if (titularType == 'company') {
      value.document =
        this.props.settings.language !== 'ao'
          ? this.maskCnpj(value.document)
          : value.document;
    }
    this.setState({ valueTitular: value });
  }

  maskCpf(cpf) {
    if (cpf != undefined) {
      cpf = cpf.replace(/\D/g, '');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return cpf;
  }

  maskCnpj(cnpj) {
    if (cnpj != undefined) {
      cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
      cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
      cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
    }
  }

  /**
   * Validation of the document, function find on: http://www.geradorcnpj.com/javascript-validar-cnpj.htm
   * @param {string} cnpj
   */
  validateCNPJ = (document) => {
    let cnpj = document;
    if (!cnpj) {
      return false;
    }
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14) return false;

    if (
      cnpj == '00000000000000' ||
      cnpj == '11111111111111' ||
      cnpj == '22222222222222' ||
      cnpj == '33333333333333' ||
      cnpj == '44444444444444' ||
      cnpj == '55555555555555' ||
      cnpj == '66666666666666' ||
      cnpj == '77777777777777' ||
      cnpj == '88888888888888' ||
      cnpj == '99999999999999'
    )
      return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
  };

  /**
   * return const navigate = this.props.navigation
   */
  returnConstNavigate() {
    const { navigate } = this.props.navigation;
    return navigate;
  }

  /**
   * Call the Register API Bank data
   */
  async registerBankData() {
    let errorDocument = false;
    let errorAccountTitular = false;

    if (!this.state.checkboxState) {
      errorDocument =
        this.props.settings.language !== 'ao'
          ? this.checkDocumentTitular()
          : false;
      errorAccountTitular = this.checkAccountTitular();
    }

    if (
      errorDocument == false &&
      errorAccountTitular == false
    ) {
      this.setState({ isLoggingIn: true });

      let document = 0;
      let accountTitular = '';
      if (!this.state.checkboxState) {
        accountTitular = this.state.valueTitular.accountTitular;
        if (this.props.settings.language !== 'ao') {
          if (this.state.valueOtherPerson.typeTitular == 'company') {
            document = this.state.valueTitular.document.replace(
              /[^\d]+/g,
              ''
            );
          } else {
            document = this.state.valueTitular.document;
            document = document.replace('.', '');
            document = document.replace('.', '');
            document = document.replace('-', '');
          }
        } else {
          document = this.state.valueTitular.document;
        }
      } else {
        document = this.props.basicProvider.document;
        accountTitular =
          this.props.basicProvider.firstName +
          ' ' +
          this.props.basicProvider.lastName;
        birth = this.props.basicProvider.birthday;
      }

      try {
        const response = await this.api.RegisterBankAccount(
          this.props.provider._id,
          this.state.valueBank.account,
          this.state.valueBank.accountDigit,
          this.state.valueBank.agency,
          this.state.valueBank.agencyDigit,
          accountTitular,
          this.state.valueOtherPerson.typeTitular
            ? this.state.valueOtherPerson.typeTitular
            : 'individual',
          document,
          document,
          this.state.valueBank.bank,
          this.state.valueBank.typeAccount,
          this.state.valueTitular?.birthDate,
          null,
          null,
          this.state.pix?.type,
          this.state.pix?.value
        );
        this.setState({ isLoggingIn: false });
        let responseJson = response.data;

        if (
          parse.isSuccess(responseJson, this.returnConstNavigate()) ==
          true
        ) {
          this.props.changeProviderBankAccount(
            accountTitular,
            this.state.valueTitular?.birthDate,
            this.state.valueOtherPerson.typeTitular
              ? this.state.valueOtherPerson.typeTitular
              : 'individual',
            document,
            this.state.valueBank.typeAccount,
            this.state.valueBank.bank,
            this.state.valueBank.agency,
            this.state.valueBank.agencyDigit,
            this.state.valueBank.account,
            this.state.valueBank.accountDigit,
            this.state.pix?.type,
            this.state.pix?.value
          );
          parse.showToast(
            strings('register.sucessRegisterBankData'),
            Toast.durations.LONG
          );

          if (this.state.returnScreen) {
            this.props.navigation.navigate(this.state.returnScreen);
          } else {
            this.props.navigation.navigate('EditProfileMainScreen');
          }
        } else {
          parse.showToast(responseJson.error, Toast.durations.LONG);
        }
      } catch (error) {
        this.setState({ isLoggingIn: false });

        parse.showToast(
          strings('error.try_again'),
          Toast.durations.LONG
        );
      }
    } else {
      parse.showToast(
        strings('error.correctly_fill'),
        Toast.durations.SHORT
      );
    }
  }

  setValueBank(valueBank) {
    if (valueBank) {
      this.setState({
        valueBank: Object.assign({}, this.state.valueBank, valueBank),
      });
    }
  }

  render() {
    return (
      <ScrollView
        style={styles.parentContainer}
        keyboardShouldPersistTaps="handled">
        <DefaultHeader
          loading={this.state.isLoggingIn || this.state.isLoadingAccount}
          loadingMsg={this.state.isLoggingIn
            ? strings('register_bank.updating')
            : strings('register_bank.loadingAccount')}
          btnBackListener={() => this.props.navigation.goBack()}
          title={strings('register_steps.bank_data')}
        />

        <CheckBox
          title={strings('register.same_titular')}
          checked={this.state.checkboxState}
          containerStyle={styles.contCheck}
          checkedColor={projectColors.green}
          onPress={() => this.onPressCheckbox()}
        />

        <View style={styles.sectionInputs}>
          {!this.state.checkboxState ? (
            <>
              <Text
                style={{
                  color: '#6c727c',
                  fontSize: 12,
                }}
              >
                {strings('register_bank.account_type_titular')}
              </Text>
              <SelectPicker
                selectedValue={this.state.valueOtherPerson.typeTitular}
                style={{
                  inputAndroid: { color: 'black' },
                  inputIOS: {
                    fontSize: 16,
                    marginBottom: 8,
                    paddingStart: 8,
                  },
                }}
                onValueChange={(state) => this.onChangeOtherTitular(state)}
                placeholder={{
                  label: strings(
                    'register_bank.empty_type_titular'
                  ),
                  value: null,
                }}
              >
                <SelectPicker.Item label={strings('bank_account.individual')} value="individual" />
                <SelectPicker.Item label={strings('bank_account.corporative')} value="company" />
              </SelectPicker>
            </>
          ) : null}

          <BankForm
            ref={(ref) => (this.formRef = ref)}
            stylesheet={stylesheet}
            initialData={this.state.valueBank}
            params={{
              id: '',
              token: '',
              lang: this.props.settings.language,
            }}
            route={constants.BANKLIB_URL}
            onSubmit={(value) => {
              this.setValueBank(value);
              if (this.state.update) this.registerBankData();
            }}
          />
          <Lookup
            inputRef={(ref) => this._refPixType = ref}
            label={strings('register_bank.label_pix_type')}
            items={pixTypes}
            holdData={true}
            onValueChange={(n, v, details) => {
              this.setState({
                pix: { type: v, value: '' },
                pixInput: { details: details },
              });
            }}
            value={this.state.pix.type}
          />
          <TextInputField
            inputRef={(ref) => this._refPixValue = ref}
            label={strings('register_bank.label_pix_value')}
            type={this.state.pixInput.details?.type}
            options={this.state.pixInput.details?.options}
            value={this.state.pix.value}
            rawValue={true}
            error={this.state.pixInput}
            secureTextEntry={false}
            setError={() => {
              if (!!this.state.pix) {
                if (!this.state.pix.value) {
                  this.state.pixInput.msgError = strings('register_bank.msg_empty_value');
                } else if (!!this.state.pixInput.details) {
                  let details = this.state.pixInput?.details;
                  if (!!details?.validator) {
                    this.state.pixInput.msgError = details.validator(this.state.pix.value, details.type, details.options) || "";
                  }
                }
              }
            }}
            onValueChange={(name, value) => this.setState({ pix: { ...this.state.pix, value: value } })}
            clearError={() => { this.setState({ pixInput: { ...this.state.pixInput, msgError: "" } }) }}
            editable={!!this.state.pix.type}
          />

          <Button
            onPress={() => {
              this.setState({ update: true }, () =>
                this.formRef.submitForm()
              );
            }}
            text={strings('register.save')}
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  settings: state.settingsReducer.settings,
  bankAccountProvider: state.providerReducer.bankAccountProvider,
  provider: state.providerProfile.providerProfile,
  basicProvider: state.providerReducer.basicProvider,
});

const mapDispatchToProps = (dispatch) => ({
  getProviderBankAccount: (id, token) =>
    dispatch(getProviderBankAccount(id, token)),
  changeProviderBankAccount: (
    accountTitular,
    birthday,
    typeTitular,
    document,
    typeAccount,
    bank,
    agency,
    agencyDigit,
    account,
    accountDigit,
    typePix,
    keyPix
  ) =>
    dispatch(
      changeProviderBankAccount(
        accountTitular,
        birthday,
        typeTitular,
        document,
        typeAccount,
        bank,
        agency,
        agencyDigit,
        account,
        accountDigit,
        typePix,
        keyPix
      )
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditBankStepScreen);