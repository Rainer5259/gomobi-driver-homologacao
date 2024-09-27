import React from 'react'
import * as ReactNavigation from 'react-navigation'
import { connect } from 'react-redux'
import AppNavigation from './AppNavigation'
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';

// Note: createReactNavigationReduxMiddleware must be run before reduxifyNavigator
const middleware = createReactNavigationReduxMiddleware(
  "root",
  state => state.nav,
);

// here is our redux-aware our smart component
function ReduxNavigation (props) {
  const { dispatch, nav } = props
  // const navigation = ReactNavigation.addNavigationHelpers({
  //   dispatch,
  //   state: nav
  // })

  return <AppNavigation/>
}

const mapStateToProps = state => ({ nav: state.nav })
export default connect(mapStateToProps)(ReduxNavigation)
