import {
    createStore,
    combineReducers,
    compose,
    applyMiddleware
} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';

import thunk from 'redux-thunk'

import requestReducer from './reducers/request'
import settingsReducer from './reducers/settingsReducer'
import providerProfileReducer from './reducers/providerProfile'
import ChatReducer from './reducers/ChatReducer'
import registerReducer from './reducers/registerReducer'
import providerReducer from './reducers/providerReducer'
import requestsReducer from './reducers/requestsReducer'
import reportReducer from './reducers/reportReducer'
import servicesReducer from './reducers/servicesReducer'
import destinationReducer from './reducers/destinationReducer'
import helpReducer from './reducers/helpReducer'
import CoordinatesProviderReducer from './reducers/CoordinatesProviderReducer'
import EmergencyContactsReducer from './reducers/emergencyContactsReducer'
import setSigDataReducer from "./reducers/sig";



import BgGeolocationReducer from './reducers/BgGeolocationReducer'

const reducers = combineReducers({
    settingsReducer: settingsReducer,
    providerProfile: providerProfileReducer,
    request: requestReducer,
    ChatReducer: ChatReducer,
    registerReducer: registerReducer,
    providerReducer: providerReducer,
    requestsReducer: requestsReducer,
    reportReducer: reportReducer,
    servicesReducer: servicesReducer,
    helpReducer: helpReducer,
    destinationReducer: destinationReducer,
    CoordinatesProviderReducer: CoordinatesProviderReducer,
    BgGeolocationReducer: BgGeolocationReducer,
    EmergencyContactsReducer: EmergencyContactsReducer,
    sigData: setSigDataReducer
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['providerProfile', 'destinationReducer', 'settingsReducer', 'request'],
    timeout: null,
};

const persistedReducer = persistReducer(persistConfig, reducers)


const store = createStore(persistedReducer, applyMiddleware(thunk));

const persistor = persistStore(store);


export { store, persistor }
