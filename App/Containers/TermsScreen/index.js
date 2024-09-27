// Modules
import React, { Component } from "react";
import {
  View,
  BackHandler
} from "react-native"
import _ from "lodash";
import Toast from "react-native-root-toast"
import { connect } from "react-redux"

// Components
import DefaultHeader from "../../Components/DefaultHeader";

// Locales
import i18n, { strings } from "../../Locales/i18n"

//Services
import ProviderApi from "../../Services/Api/ProviderApi"

//Utils
import * as parse from "../../Util/Parse"
import WebView from "react-native-webview";
import { BootstrapColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

class TermsScreen extends Component {
  constructor(props) {
    super(props)
    this.api = new ProviderApi()
    this.state = {
      title: "",
      content: "",
      isLoggingIn: true,
    }
  }

  /**
   * return const navigate = this.props.navigation
   */
  returnConstNavigate() {
    const { navigate } = this.props.navigation
    return navigate
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack()
      return true
    })

    this.getTerm()
  }


  /**
   * If exists page_id then use, otherwise search for the first position of array application to set param
   */
  async getTerm() {
    try {
      let pageID = null
      if (this.props.navigation.state.params !== undefined && this.props.navigation.state.params.page_id !== undefined
        && this.props.navigation.state.params.page_id !== null) {
        pageID = this.props.navigation.state.params.page_id
      } else {
        pageID = this.props.aplicationPage[0].id
      }

      if (pageID !== null) {
        let response = await this.api.GetTerms(pageID)
        let responseJson = response.data
        if (parse.isSuccess(responseJson, this.returnConstNavigate()) == true) {
          this.setState({
            isLoggingIn: false,
            title: responseJson.title,
            content: responseJson.content
          })
        } else {
          this.setState({ isLoggingIn: false })
          parse.showToast(strings("error.try_again"), Toast.durations.LONG)
        }
      }
    } catch (error) {
      this.setState({ isLoggingIn: false })
      parse.showToast(strings("error.try_again"), Toast.durations.LONG)
    }
  }

  /**
   * Component will be Unmounted, so close Listener and Watcher
   */
  componentWillUnmount() {
    this.backHandler.remove()
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: BootstrapColors.white }}>
        <DefaultHeader
          loading={this.state.isLoggingIn}
          loadingMsg={strings("load.Loading")}
          btnBack={true}
          btnBackListener={() => this.props.navigation.goBack()}
          title={this.state.title}
        />
        <WebView
          containerStyle={{ paddingHorizontal: 25 }}
          automaticallyAdjustContentInsets={false}
          scalesPageToFit={false}
          javaScriptEnabled={true}
          source={{
            html: this.state.content
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  const { aplicationPage } = state.settingsReducer
  return { aplicationPage }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermsScreen)
