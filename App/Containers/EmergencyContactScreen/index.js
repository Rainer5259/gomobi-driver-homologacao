// Modules
import React, { Component } from "react";
import { ScrollView, View, BackHandler } from "react-native";
import { connect } from "react-redux";

// Components
import EmergencyContacts from "../../Components/EmergencyContacts";

// Locales
import { strings } from "../../Locales/i18n";


//Themes
import { projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

// Util
import * as constants from "../../Util/Constants";

// Store
import { saveEmergencyContacts } from "../../Store/actions/actionEmergencyContacts";

// Styles
import styles from "./styles";
import DefaultHeader from "../../Components/DefaultHeader";

class EmergencyContactScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };

    this.willFocus = this.props.navigation.addListener("willFocus", () => {});
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("MainScreen");
      return true;
    });
  }

  componentWillUnmount() {
    if (this.backHandler) {
      this.backHandler.remove();
    }
    this.willFocus.remove();
  }

  render() {
    const { providerProfile } = this.props;
    const { settings } = this.props;
    return (
      <ScrollView style={styles.parentContainer}>
        <DefaultHeader
          loading={this.state.isLoading}
          loadingMsg={strings('load.Loading')}
          btnBackListener={this.props.navigation.navigate("MainScreen")}
          title={strings('emergency_contact.emergency_contacts')}
        />
        <View style={styles.webview}>
          <EmergencyContacts
            value={this.props.emergencyContacts?.label}
            language={settings.language}
            primaryColor={projectColors.primaryColor}
            route={constants.BASE_URL + constants.API_VERSION}
            params={{
              id: providerProfile._id,
              token: providerProfile._token,
              ledger_id: providerProfile._ledger_id,
            }}
            getOptionsToShareRequest={option => {
                this.props.saveEmergencyContacts(option)
              }
            }
          />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  const { providerProfile } = state.providerProfile;
  const { settings } = state.settingsReducer;
  const { emergencyContacts } = state.EmergencyContactsReducer

  return { providerProfile, settings, emergencyContacts };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveEmergencyContacts: values => dispatch(saveEmergencyContacts(values)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmergencyContactScreen);
