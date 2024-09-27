import { REQUEST_UPDATED, WAITING_REQUEST_UPDATED, REQUEST_COMPLETED, SET_REQUEST_NOTICE, RECEIVE_NOTICE, WAITING_RECEIVE_NOTICE } from './actionTypes'
import ProviderApi from "../../Services/Api/ProviderApi";
import NavigationService from '../../Services/NavigationService';

export const setRequestNotice = (request, user) => {
    return {
        type: SET_REQUEST_NOTICE,
        payload: {
            request,
            user
        }
    }
}


export const setReceiveNotice = data => {
    return {
        type: RECEIVE_NOTICE,
        payload: data
    }
}

export const setWaitingReceiveNotice = data => {
    return {
        type: WAITING_RECEIVE_NOTICE,
        payload: data
    }
}

export const requestUpdated = data => {
    return {
        type: REQUEST_UPDATED,
        data
    }
}

export const waitngRequestUpdated = data => {
    return {
        type: WAITING_REQUEST_UPDATED,
        data
    }
}

export const setBill = bill => {
    return {
        type: 'BILL_UPDATED',
        bill
    }
}

export const requestClear = () => {
    return {
        type: 'CLEAR'
    }
}

export const waitingRequestClear = () => {
    return {
        type: 'WAITING_CLEAR'
    }
}

export const setIdConversation = id => {
    return {
        type: 'SET_ID_CONVERSATION',
        payload: id
    }
}

export const requestFinish = request => {
    var apiProvider = new ProviderApi()
    return async dispatch => {

        await apiProvider.GetRequest(request.id, request.token, request.request_id)
            .then(response => {

                let responseJson = response.data

                dispatch({
                    type: REQUEST_COMPLETED,
                    responseJson
                })
            })

    }
}

export const requestInProgressAction = (request) => {

    return dispatch => {
        var apiProvider = new ProviderApi()

        apiProvider.GetRequest(request.id, request.token, request.request_id)
            .then(response => {

                let responseJson = response.data

                dispatch(requestUpdated(responseJson))

                NavigationService.navigate("ServiceUserBoardScreen")
            })

    }

}

export const requestAcceptedAction = (request) => {

    return dispatch => {
        var apiProvider = new ProviderApi()

        apiProvider.GetRequest(request.id, request.token, request.request_id)
            .then(response => {

                let responseJson = response.data

                dispatch(requestUpdated(responseJson))

                NavigationService.navigate("ServiceUserBoardScreen")
            })

    }

}
