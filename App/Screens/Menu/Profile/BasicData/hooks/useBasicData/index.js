import DateInput from "../../../../../../Components/Date/DateInput";
import TextInputField from "../../../../../../Components/Date/TextInputField";
import Lookup from "../../../../../../Components/Lookup";
import PhoneNumberInput from "../../../../../../Components/Phone/PhoneNumberInput";
import RadioInput from "../../../../../../Components/RadioInput";
import { strings } from "../../../../../../Locales/i18n";

export const FIRST_NAME = 'firstName';
export const LAST_NAME = 'lastName';
export const BIRTH_DATE = 'birthday';
export const TYPE_PERSON = 'typePerson';
export const DOCUMENT = 'document';
export const CNPJ = 'document2';
export const PHONE = 'phone';
export const EMAIL = 'email';
export const GENDER = 'gender';
export const INDICATION_CODE = 'indicationCode';
export const PASSWORD = 'password';
export const CONFIRM_PASSWORD = 'confirmPassword';



export const msgErrorFirstName = strings('register.empty_first_name');
export const msgErrorLastName = strings('register.empty_last_name');
export const msgErrorDocument = strings('register.invalid_document2');
export const msgErrorDocumentCnpj = strings('register.invalid_document3');
export const msgErrorEmptyDocument = strings('register.empty_document');
export const msgErrorEmptyDocumentCnpj = strings('register.empty_document2');
export const msgErrorEmail = strings('recover_password.type_valid_email');
export const msgErrorEmptyEmail = strings('register.empty_email');
export const msgErrorBirthDate18 = strings('register.under_eighteen');
export const msgErrorDate = strings('register.empty_birth_date');
export const msgErrorPhone = strings('register.insert_valid_phone');
export const msgErrorGender = strings('register.empty_gender');
export const msgErrorPassword = strings('register.empty_password');
export const msgErrorConfirmPassword = strings('register.empty_confirm_password');
export const msgErrorPasswordDiff = strings('register.error_confirm_password');
export const msgErrorPasswordLength = strings("register.empty_password_length");


const useBasicData = () => {
  /**
   * @description retorna tres opções, Masculino, Feminino e outro.
   * @returns array de generos
   */
  const getGenders = () => {
    return [{
      label: strings('register.choose_your_gender'),
      value: null,
      key: 3
    }, {
      label: strings('register.male'),
      value: 'male',
      key: 2
    }, {
      label: strings('register.female'),
      value: 'female',
      key: 1
    }, {
      label: strings('register.other'),
      value: 'other',
      key: 0
    }];
  }

  /**
   * 
   * @returns Array de campos ordenados,
   * @description Nome do campo, descrição e o component que vai renderizar.
   */
  const getFields = () => {
    return [
      , {
        name: TYPE_PERSON,
        label: strings('register.account_type'),
        Component: RadioInput,
        items: [
          { label: 'Individual', option: 'f' },
          { label: 'Corporativo', option: 'j' }]
      }, {

        name: FIRST_NAME,
        label: strings('register.first_name'),
        Component: TextInputField,
        nextField: LAST_NAME
      }, {
        name: LAST_NAME,
        label: strings('register.last_name'),
        Component: TextInputField,
        nextField: EMAIL
      }, {
        name: EMAIL,
        label: strings('register.email'),
        Component: TextInputField,
        nextField: [DOCUMENT, CNPJ]
      }, {
        name: DOCUMENT,
        nextField: PHONE,
        label: strings('register.document'),
        Component: TextInputField,
        type: 'cpf'
      },
      {
        name: CNPJ,
        nextField: PHONE,
        label: 'CNPJ',
        Component: TextInputField,
        type: 'cnpj'
      },
      {
        name: PHONE,
        nextField: BIRTH_DATE,
        label: strings('register.phone'),
        Component: PhoneNumberInput,
      }, {
        name: BIRTH_DATE,
        nextField: GENDER,
        label: strings('register.birth_day'),
        Component: DateInput,
      }, {
        name: GENDER,
        nextField: PASSWORD,
        label: strings('register.gender'),
        Component: Lookup,
        items: getGenders()
      },
      {
        name: PASSWORD,
        label: strings('register.password'),
        Component: TextInputField,
        nextField: CONFIRM_PASSWORD,
        secureTextEntry: true,
      },
      {
        name: CONFIRM_PASSWORD,
        label: strings('register.confirm_password'),
        Component: TextInputField,
        nextField: INDICATION_CODE,
        secureTextEntry: true,
      },
      {
        name: INDICATION_CODE,
        label: strings('register.indication_code'),
        Component: TextInputField,
        nextField: false
      }
    ];
  }

  return { getFields }
}

export default useBasicData;