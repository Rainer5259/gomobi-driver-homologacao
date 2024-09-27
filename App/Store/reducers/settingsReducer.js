import {
    APPLICATION_PAGES,
    SETTINGS_UPDATED,
    LOAD_AUDIO_REQUEST_BEEP,
    LOAD_AUDIO_CANCELLATION_BEEP,
    ENABLED_LANGUAGES,
    CLICKER_UPDATED,
	PAYMENT_NOMENCLATURES,
    LOAD_AUDIO_CHAT_PROVIDER
} from '../actions/actionTypes'

const initialPaymentNomenclatures = {
	name_payment_balance: "", 
	name_payment_billing: "", 
	name_payment_card: "", 
	name_payment_carto: "", 
	name_payment_crypt: "", 
	name_payment_debitCard: "", 
	name_payment_machine: "", 
	name_payment_money: "", 
	name_payment_prepaid: ""
}

const initialState = {
    settings: null,
    aplicationPage: [],
    audio: '',
    audioCancellation: '',
    audioChatProvider: '',
    language: [],
    clicker: 'primary',
	payment_nomenclatures: initialPaymentNomenclatures
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SETTINGS_UPDATED:
            return {
                ...state,
                settings: action.settings
            }
        case LOAD_AUDIO_REQUEST_BEEP:
            return {
                ...state,
                audio: action.audio
            }
        case LOAD_AUDIO_CANCELLATION_BEEP:
            return {
                ...state,
                audioCancellation: action.audio
            }
        case LOAD_AUDIO_CHAT_PROVIDER:
            return {
                ...state,
                audioChatProvider: action.audio
            }
        case ENABLED_LANGUAGES:
            return {
                ...state,
                language: action.language
            }
        case APPLICATION_PAGES: {
            
            return {
                ...state,
                aplicationPage: action.page
            }
        }
        case CLICKER_UPDATED:
            return {
                ...state,
                clicker: action.clicker
            }
		case PAYMENT_NOMENCLATURES: {
			return {
				...state,
				payment_nomenclatures: action.nomenclatures
			}
		}
        default:
            return state
    }
}

export default reducer