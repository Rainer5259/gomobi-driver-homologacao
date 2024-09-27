// Modules
import React, { Component } from "react";
import { View, Platform } from "react-native";
import VersionNumber from 'react-native-version-number';
import { WebView } from 'react-native-webview';

// Components
import DefaultHeader from "../../Components/DefaultHeader";

// Locales
import { strings } from "../../Locales/i18n";

// Util
import * as constants from '../../Util/Constants';
import { BootstrapColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

class VersionScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: BootstrapColors.white }}>
        <DefaultHeader
          btnBack={true}
          btnBackListener={() => this.props.navigation.goBack()}
          title={strings('versionScreen.title')}
        />
        <WebView containerStyle={{ paddingHorizontal: 20 }}
          useWebKit={true}
          automaticallyAdjustContentInsets={false}
          scalesPageToFit={false}
          javaScriptEnabled={true}
          source={{ uri: `${constants.GET_VERSION_NOTES}${VersionNumber.appVersion}` }} />
      </View>
    );
  }
}

export default VersionScreen;
