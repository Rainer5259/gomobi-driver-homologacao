"use strict";

// Modules
import { Alert } from "react-native";
import { connect } from "react-redux";

// Locales
import { strings } from "../../../../../Locales/i18n";

// Components
import VehicleData, { mapDispatchToProps } from "../Components/VehicleData";

//Utils
import * as parse from '../../../../../Util/Parse';

class EditVehicleStepScreen extends VehicleData {


  componentDidMount() {
    super.componentDidMount();
    this.blockEditRecord();
  }

  /**
   * @description Se estiver pendende analise ou em analise o motorista nao pode alterar nenhuma informacao
   */
  blockEditRecord(){
    if (this.props.settings.is_approved_provider_name_update_enabled == 0
      && !['PENDENTE','EM_ANALISE'].includes(this.props.provider._status_id)) {
      this.setState({ editable: false });
    }
  }

  notifyEditVehicle() {
    Alert.alert(
      `${strings("profileProvider.warning")}`,
      `${strings("profileProvider.reEvaluation")}`,
      [
        {
          text: `${strings("general.cancel")}`,
          onPress: () => { },
          style: 'cancel',
        },
        { text: `${strings("general.confirm")}`, onPress: () => this.registerVehicle() },
      ],
      { cancelable: false },
    )
  }

  /**
    * Clear data and call logout function.
    */
  logout() {
    const { navigate } = this.props.navigation
    setTimeout(() => {
      this.setState({ isLoading: false })
      parse.logout(this.props.provider._id, this.props.provider._token, navigate)
    }, 2000)
  }
}

const mapStateToProps = state => (
  {
    vehicleProvider: state.providerReducer.vehicleProvider,
    provider: state.providerProfile.providerProfile,
    settings: state.settingsReducer.settings,
    editScreen: Boolean(true)
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditVehicleStepScreen);
