import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'
import { settingsReducer } from '../Reducers/settings.reducer'
import { providerProfileReducer } from '../Reducers/providerProfile.reducer'

/* ------------- Assemble The Reducers ------------- */

export const reducers = combineReducers({
  nav: require('./NavigationRedux').reducer,
  github: require('./GithubRedux').reducer,
  search: require('./SearchRedux').reducer,
  settingsReducer,
  providerProfileReducer
})

export default () => {
  let { store, sagasManager, sagaMiddleware } = configureStore(reducers, rootSaga)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers
      store.replaceReducer(nextRootReducer)

      const newYieldedSagas = require('../Sagas').default
      sagasManager.cancel()
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas)
      })
    })
  }
  return store
}
