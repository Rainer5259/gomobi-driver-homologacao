import { type } from 'ramda';
import { strings } from '../../Locales/i18n';
import ProviderApi from '../../Services/Api/ProviderApi';
import { handlerException } from '../../Services/Exception';

export const CHANGE_PROVIDER_BANK_ACCOUNT = 'CHANGE_PROVIDER_BANK_ACCOUNT';
export const CHANGE_PHOTO_PROVIDER = 'CHANGE_PHOTO_PROVIDER';

export const changeProviderData = (values) => {
    return {
        type: 'CHANGE_PROVIDER_DATA',
        payload: values,
    };
};

export const changePhotoProvider = (picture, token) => {
    return {
        type: CHANGE_PHOTO_PROVIDER,
        payload: { picture, token },
    };
};

export const changeToken = (value) => {
    return {
        type: 'CHANGE_TOKEN',
        payload: value,
    };
};

export const changeProviderBasic = (
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
  indicationCode
) => {
  return {
    type: 'CHANGE_PROVIDER_BASIC',
    payload: {
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
      indicationCode
    },
  };
};

export const changeProviderAddress = (
    zipcode,
    address,
    number,
    complement,
    neighborhood,
    city,
    state
) => {
    return {
        type: 'CHANGE_PROVIDER_ADDRESS',
        payload: {
            zipcode,
            address,
            number,
            complement,
            neighborhood,
            city,
            state,
        },
    };
};

export const changeProviderServices = (values) => {
    return {
        type: 'CHANGE_PROVIDER_SERVICES',
        payload: values,
    };
};

export const changeProviderVehicle = (
  carNumber,
  carModel,
  carBrand,
  carColor,
  carManufaturingYear,
  carModelYear
) => {
  return {
    type: 'CHANGE_PROVIDER_VEHICLE',
    payload: {
      carNumber,
      carModel,
      carBrand,
      carColor,
      carManufaturingYear,
      carModelYear
    },
  };
};

export const changeProviderBankAccount = (
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
    keyPix,
) => {
    return {
        type: CHANGE_PROVIDER_BANK_ACCOUNT,
        payload: {
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
            keyPix,
        },
    };
};

export const getDocs = (values) => {
    return {
        type: 'GET_DOCS',
        payload: values,
    };
};

export const changeProviderDocuments = (values) => {
    return {
        type: 'CHANGE_PROVIDER_DOCUMENTS',
        payload: values,
    };
};

export const getProviderBankAccount = (id, token) => {
    var apiProvider = new ProviderApi();
    return (dispatch) => {
        return new Promise(function (resolve, reject) {
            try {
                apiProvider
                    .GetProviderBankAccount(id, token)
                    .then((response) => {
                        if (response.data.success) {
                            if (response.data.bank) {
                                const { bank } = response.data;

                                const request_formatted = {
                                    accountTitular: bank.holder,
                                    birthday: bank.birthday_date,
                                    typeTitular: bank.person_type,
                                    document: bank.document,
                                    typeAccount: bank.account_type,
                                    bank: bank.bank.id,
                                    agency: bank.agency,
                                    agencyDigit: bank.agency_digit,
                                    account: bank.account,
                                    accountDigit: bank.account_digit,
                                };

                                dispatch({
                                    type: CHANGE_PROVIDER_BANK_ACCOUNT,
                                    payload: request_formatted,
                                });

                                const res = {
                                    success: true,
                                    responseJson: request_formatted,
                                };

                                resolve(res);
                            } else {
                                const request_formatted = {
                                    accountTitular: '',
                                    birthday: '',
                                    typeTitular: '',
                                    document: '',
                                    typeAccount: '',
                                    bank: '',
                                    agency: '',
                                    agencyDigit: '',
                                    account: '',
                                    accountDigit: '',
                                };
                                dispatch({
                                    type: CHANGE_PROVIDER_BANK_ACCOUNT,
                                    payload: request_formatted,
                                });
                                let message = strings(
                                    'register_bank.provider_bank_account_not_found'
                                );
                                if (response.data.message) {
                                    message = response.data.message;
                                }
                                reject({
                                    success: false,
                                    message,
                                });
                            }
                        } else {
                            reject(response);
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } catch (error) {
              handlerException('actionProvider.getProviderBankAccount', error);
              reject(error);
            }
        });
    };
};
