import { REQUEST_UPDATED, REQUEST_COMPLETED, REQUEST_IN_PROGRESS_ACTION, SET_REQUEST_NOTICE, RECEIVE_NOTICE, WAITING_SET_REQUEST_NOTICE, WAITING_REQUEST_UPDATED, WAITING_RECEIVE_NOTICE } from '../actions/actionTypes'

const initialState = {
    request: null,
    user: null,
    bill: null,
    conversationId: 0,
    receive_notice: false,
    waiting_request: null,
    waiting_user: null,
    waiting_receive_notice: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_REQUEST_NOTICE:
            return {
                ...state,
                request: action.payload.request,
                user: action.payload.user
            }
        case REQUEST_UPDATED:
            return {
                ...state,
                request: action.data.request,
                user: action.data.user
            }
        case WAITING_SET_REQUEST_NOTICE:
            return {
                ...state,
                waiting_request: action.payload.request,
                waiting_user: action.payload.user
            }
        case WAITING_REQUEST_UPDATED:
            return {
                ...state,
                waiting_request: action.data.request,
                waiting_user: action.data.user
            }
        case 'BILL_UPDATED':
            return {
                ...state,
                bill: action.bill
            }
        case REQUEST_COMPLETED:

            return {
                ...state,
                request: action.request
            }
        case REQUEST_IN_PROGRESS_ACTION:

            return {
                ...state,
                request: action.request
            }
        case 'SET_ID_CONVERSATION':
            return {
                ...state,
                conversationId: action.payload
            }
        case RECEIVE_NOTICE:
            return {
                ...state,
                receive_notice: action.payload
            }
        case WAITING_RECEIVE_NOTICE:
            return {
                ...state,
                waiting_receive_notice: action.payload
            }
        case 'CLEAR': {
            return {
                ...state,
                request: null,
                receive_notice: false
            }
        }
        case 'WAITING_CLEAR': {
            return {
                ...state,
                waiting_request: null,
                waiting_receive_notice: false
            }
        }
        default:
            return state
    }
}

export default reducer
