// Modules
import React, { Component } from "react";
import {
    View,
    BackHandler,
    Dimensions,
    ScrollView
  } from "react-native"
import _ from "lodash";
import HTML from 'react-native-render-html'
import { connect } from "react-redux"

// Components
import DefaultHeader from "../../Components/DefaultHeader";

// Locales
import { strings } from "../../Locales/i18n"

//Services
import ProviderApi from "../../Services/Api/ProviderApi"
class HelpScreen extends Component {
    constructor(props) {
        super(props)
        this.api = new ProviderApi()
        this.state = {
            isLoggingIn: false,
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
            this.props.navigation.goBack()
            return true
        })
    }

    /**
     * Component will be Unmounted, so close Listener and Watcher
     */
    componentWillUnmount() {
        this.backHandler.remove()
    }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <DefaultHeader
          loading={this.state.isLoggingIn}
          loadingMsg={strings('load.Loading')}
          btnBackListener={() => this.props.navigation.goBack()}
          title={this.props.financialHelp.title ? this.props.financialHelp.title : ''}
        />
        {this.props.financialHelp.content ? (
          <ScrollView style={{ flex: 1 }}>
            <HTML containerStyle={{ paddingHorizontal: 20 }}
              html={this.props.financialHelp.content}
              imagesMaxWidth={Dimensions.get('window').width}
            />
          </ScrollView>
        ) : null}
      </View>
    )
  }
}

const mapStateToProps = state => {
    const { aplicationPage } = state.settingsReducer
    const { financialHelp } = state.helpReducer
    return { aplicationPage, financialHelp }
}

const mapDispatchToProps = dispatch => {
    return {}
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpScreen)
