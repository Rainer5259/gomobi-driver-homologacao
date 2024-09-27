"use strict";
import { connect } from "react-redux";
// Modules
import BasicData, { mapDispatchToProps } from "../components/BasicData";

class EditBasicStepScreen extends BasicData {

}

const mapStateToProps = (state) => ({
  settings: state.settingsReducer.settings,
  provider: state.providerProfile.providerProfile,
  providerProfile: state.providerProfile.providerProfile,
  basicProvider: state.providerReducer.basicProvider,
  editScreen: Boolean(true)
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBasicStepScreen);
