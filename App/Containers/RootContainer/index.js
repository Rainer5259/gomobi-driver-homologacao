// Modules
import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import { connect } from 'react-redux'

// Config
import ReduxPersist from '../../Config/ReduxPersist'

// Navigation
import ReduxNavigation from '../../Navigation/ReduxNavigation'

// Redux
import StartupActions from '../../Redux/StartupRedux'

// Styles
import styles from './styles'

class RootContainer extends Component {
  componentDidMount () {
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <ReduxNavigation />
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

export default connect(null, mapDispatchToProps)(RootContainer)
