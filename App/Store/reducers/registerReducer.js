import { object } from "prop-types"

const initialState = {
    addProviderId: null,
    visibleSecurityCode: false,
    basicSocialRegister: {
        socialId: '',
        socialFirstName: '',
        socialLastName: '',
        socialEmail: '',
        type: '',
        deviceToken: '',
        loginBy: ''
    },
    basicRegister: {
        firstName: '',
        lastName: '',
        document: '',
        birthday: null,
        gender: '',
        phone: '',
        email: '',
        picture: ''
    },
    addressRegister: {
        zipCode: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
    },
    arrayRegisterServices: [],
    vehicleRegister: {
        carNumber: '',
        carModel: '',
        carBrand: '',
        carColor: '',
        carManufaturingYear: '',
        carModelYear: '',
    },
    bankAccountRegister: {
        accountTitular: '',
        birthday: '',
        typeTitular: '',
        document: '',
        typeAccount: '',
        bank: '',
        agency: '',
        agencyDigit: '',
        account: '',
        accountDigit: ''
    },
    docs: [],
    addDocs: [],
    addDocsSaved: false,
    basicFilled: false,
    addressFilled: false,
    servicesFilled: false,
    vehicleFilled: false,
    bankAccountFilled: false,
    form: {
      providerId: '',
      ear: 0,
      categorySelected : [],
      ownVehicle: 0,
      conduapp: 0,
      certificate: null,
      chassi: null,
      renavam: null,
      cityPlate: null,
      statePlate: null,
      manufaturingYear: null,
      modelYear: null,
      category: [
        {
          id: 'A',
          name: 'A'
        },
        {
          id:'B',
          name:'B'
        },
        {
          id:'C',
          name: 'C'
        },
        {
          id: 'D',
          name: 'D'
        },
        {
          id: 'E',
          name: 'E'
        },
        {
          id: 'AB',
          name: 'AB'
        },
        {
          id: 'AC',
          name: 'AC'
        },
        {
          id: 'AD',
          name: 'AD'
        }
      ],
    }
}


export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_PROVIDER_ID':
            return {
                ...state,
                addProviderId: action.payload
            }
        case 'CHANGE_REGISTER_BASIC_SOCIAL':
            return {
                ...state,
                basicSocialRegister: {
                    socialId: action.payload.socialId,
                    socialFirstName: action.payload.socialFirstName,
                    socialLastName: action.payload.socialLastName,
                    socialEmail: action.payload.socialEmail,
                    type: action.payload.type,
                    deviceToken: action.payload.deviceToken,
                    loginBy: action.payload.loginBy
                }
            }
        case 'RESET_REGISTER_BASIC_SOCIAL':
            return {
                ...state,
                basicSocialRegister: initialState.basicSocialRegister
            }
        case 'CHANGE_REGISTER_BASIC':
            return {
                ...state,
                basicRegister: {
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    document: action.payload.document,
                    birthday: action.payload.birthday,
                    gender: action.payload.gender,
                    phone: action.payload.phone,
                    email: action.payload.email,
                    picture: action.payload.picture
                },
                basicFilled: true
            }
        case 'CHANGE_REGISTER_BASIC_PHONE':
            return {
                ...state,
                basicRegister: {
                    firstName: initialState.basicRegister.firstName,
                    lastName: initialState.basicRegister.lastName,
                    document: initialState.basicRegister.document,
                    birthday: initialState.basicRegister.birthday,
                    gender: initialState.basicRegister.gender,
                    phone: action.payload,
                    email: initialState.basicRegister.picture,
                    picture: initialState.basicRegister.picture
                }
            }
        case 'RESET_REGISTER_BASIC':
            return {
                ...state,
                basicRegister: initialState.basicRegister
            }
        case 'CHANGE_REGISTER_ADDRESS':
            return {
                ...state,
                addressRegister: {
                    zipCode: action.payload.zipCode,
                    address: action.payload.address,
                    number: action.payload.number,
                    complement: action.payload.complement,
                    neighborhood: action.payload.neighborhood,
                    city: action.payload.city,
                    state: action.payload.state
                },
                addressFilled: true
            }
        case 'RESET_REGISTER_ADDRESS': {
            return {
                ...state,
                addressRegister: initialState.addressRegister
            }
        }
        case 'CHANGE_REGISTER_SERVICES': {
            return {
                ...state,
                arrayRegisterServices: action.payload,
                servicesFilled: true
            }
        }
        case 'RESET_REGISTER_SERVICES': {
            return {
                ...state,
                arrayRegisterServices: initialState.arrayRegisterServices
            }
        }
        case 'CHANGE_REGISTER_VEHICLE': {
            return {
                ...state,
                vehicleRegister: {
                    carNumber: action.payload.carNumber,
                    carModel: action.payload.carModel,
                    carBrand: action.payload.carBrand,
                    carColor: action.payload.carColor,
                    carManufaturingYear: action.payload.carManufaturingYear,
                    carModelYear: action.payload.carModelYear
                },
                vehicleFilled: true
            }
        }
        case 'RESET_REGISTER_VEHICLE': {
            return {
                ...state,
                vehicleRegister: initialState.vehicleRegister
            }
        }
        case 'CHANGE_REGISTER_BANK_ACCOUNT':
            return {
                ...state,
                bankAccountRegister: {
                    accountTitular: action.payload.accountTitular,
                    birthday: action.payload.birthday,
                    typeTitular: action.payload.typeTitular,
                    document: action.payload.document,
                    typeAccount: action.payload.typeAccount,
                    bank: action.payload.bank,
                    agency: action.payload.agency,
                    agencyDigit: action.payload.agencyDigit,
                    account: action.payload.account,
                    accountDigit: action.payload.accountDigit
                },
                bankAccountFilled: true
            }
        case 'RESET_REGISTER_BANK_ACCOUNT':
            return {
                ...state,
                bankAccountRegister: initialState.bankAccountRegister
            }
        case 'GET_DOCS':
            return {
                ...state,
                docs: action.payload
            }
        case 'CHANGE_ADD_PROVIDER_DOCS':
            return {
                ...state,
                addDocs: action.payload,
                addDocsSaved: true
            }
        case 'SAVE_ADD_DOCS':
            return {
                ...state,
                addDocsSaved: action.payload
            }
        case 'CHANGE_VISIBLE_SECURITY_CODE':
            return {
                ...state,
                visibleSecurityCode: action.payload
            }
        case 'RESET_REGISTER':
            return {
                ...state,
                addProviderId: initialState.addProviderId,
                basicRegister: initialState.basicRegister,
                addressRegister: initialState.addressRegister,
                arrayRegisterServices: initialState.arrayRegisterServices,
                vehicleRegister: initialState.vehicleRegister,
                bankAccountRegister: initialState.bankAccountRegister,
                docs: initialState.docs,
                addDocs: initialState.addDocs,
                addDocsSaved: initialState.addDocsSaved,
                basicFilled: initialState.basicFilled,
                addressFilled: initialState.addressFilled,
                servicesFilled: initialState.servicesFilled,
                vehicleFilled: initialState.vehicleFilled,
                bankAccountFilled: initialState.bankAccountFilled
            }
        case 'ADITIONAL_INFO_DOCS':
          return {
            ...state,
            form: action.payload
          }
        default:
            return state
    }
}
