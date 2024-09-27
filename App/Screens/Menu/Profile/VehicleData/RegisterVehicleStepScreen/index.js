"use strict";

import { connect } from "react-redux";
import VehicleData, { mapDispatchToProps } from "../Components/VehicleData";

class RegisterVehicleStepScreen extends VehicleData {
  constructor(props) {
    super(props);
  }
}

const mapStateToProps = state => (
  {
    latitude: state.CoordinatesProviderReducer.latitude,
    longitude: state.CoordinatesProviderReducer.longitude,
    vehicleRegister: state.registerReducer.vehicleRegister,
    vehicleFilled: state.registerReducer.vehicleFilled,
    addProviderId: state.registerReducer.addProviderId,
    settings: state.settingsReducer.settings,
    editScreen: Boolean(false)
  }
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterVehicleStepScreen);
