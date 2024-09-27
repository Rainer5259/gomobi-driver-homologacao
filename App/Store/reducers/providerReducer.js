import { CHANGE_PHOTO_PROVIDER, CHANGE_PROVIDER_BANK_ACCOUNT } from "../actions/actionProvider"

const initialState = {
    provider: {},
    basicProvider: {
        firstName: '',
        lastName: '',
        birthday: '',
        gender: '',
        document: '',
        phone: '',
        email: '',
        indicationCode: ''
    },
    addressProvider: {
        zipcode: '',
        address: '',
        complement: '',
        number: '',
        neighbour: '',
        city: '',
        state: ''
    },
    servicesProvider: [],
    vehicleProvider: {
        carNumber: '',
        carModel: '',
        carBrand: '',
        carColor: '',
        carManufaturingYear: '',
        carModelYea: ''
    },
    bankAccountProvider: {
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
        typePix: '',
        keyPix: ''
    },
    docs: [],
    documentsProvider: []
}


export default (state = initialState, action) => {
    switch (action.type) {
        case 'CHANGE_PROVIDER_DATA':
            return {
                ...state,
                provider: action.payload
            }
        case 'CHANGE_TOKEN':
            return {
                ...state,
                provider: {
                    ...state.provider,
                    _token: action.payload
                }
            }
        case CHANGE_PHOTO_PROVIDER:
            return {
                ...state,
                provider: {
                    ...state.provider,
                    _picture: action.payload.picture,
                    _token: action.payload.token
                }
            }
        case 'CHANGE_PROVIDER_BASIC': {
            return {
                ...state,
                basicProvider: {
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    birthday: action.payload.birthday,
                    gender: action.payload.gender,
                    typePerson: action.payload.typePerson,
                    document: action.payload.document,
                    cpf: action.payload.cpf,
                    cnpj: action.payload.cnpj,
                    phone: action.payload.phone,
                    email: action.payload.email,
                    indicationCode: action.payload.indicationCode
                }
            }
        }
        case 'CHANGE_PROVIDER_ADDRESS':
            return {
                ...state,
                addressProvider: {
                    ...state.addressProvider,
                    zipcode: action.payload.zipcode,
                    address: action.payload.address,
                    complement: action.payload.complement,
                    number: action.payload.number,
                    neighborhood: action.payload.neighborhood,
                    city: action.payload.city,
                    state: action.payload.state
                }
            }
        case 'CHANGE_PROVIDER_SERVICES':
            return {
                ...state,
                servicesProvider: action.payload
            }
        case 'CHANGE_PROVIDER_VEHICLE':
            return {
                ...state,
                vehicleProvider: {
                    carNumber: action.payload.carNumber,
                    carModel: action.payload.carModel,
                    carBrand: action.payload.carBrand,
                    carColor: action.payload.carColor,
                    carManufaturingYear: action.payload.carManufaturingYear,
                    carModelYear: action.payload.carModelYear,
                }
            }
        case CHANGE_PROVIDER_BANK_ACCOUNT:
            return {
                ...state,
                bankAccountProvider: {
                    accountTitular: action.payload.accountTitular,
                    birthday: action.payload.birthday,
                    typeTitular: action.payload.typeTitular,
                    document: action.payload.document,
                    typeAccount: action.payload.typeAccount,
                    bank: action.payload.bank,
                    agency: action.payload.agency,
                    agencyDigit: action.payload.agencyDigit,
                    account: action.payload.account,
                    accountDigit: action.payload.accountDigit,
                    typePix: action.payload.typePix,
                    keyPix: action.payload.keyPix
                }
            }
        case 'GET_DOCS':
            return {
                ...state,
                docs: action.payload
            }
        case 'CHANGE_PROVIDER_DOCUMENTS':
            return {
                ...state,
                documentsProvider: action.payload
            }
        default:
            return state
    }
}
