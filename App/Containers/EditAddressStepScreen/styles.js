// Modules
import { StyleSheet, PixelRatio } from "react-native";
import _ from "lodash"

// Themes
import { ApplicationStyles } from "../../Themes";
import {
  PrimaryButton,
  projectColors,
  BootstrapColors,
  backgroundBlank,
  picker
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  parentContainer: {
    flex: 1,
    backgroundColor: backgroundBlank,
  },
  sectionInputs: {
    marginTop: 10,
    paddingBottom: 100
  },
  containerFormPrimary: {
    justifyContent: 'space-between'
  },
  containerFormNumber: {
    width: 60,
    marginRight: 10
  },
  containerFormNeighborhood: {
    width: 250
  },
  containerFormCity: {
    width: 230,
    marginRight: 10
  },
  containerFormState: {
    marginTop: 3,
    justifyContent: 'center'
  },
  containerScrollSecondary: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 100
  },
  txtState: {
    fontSize: 12,
    color: '#6c757d'
  },
  picker: {
    height: 50,
    width: 100,
    color: picker,
    fontSize: 12
  },
  itemPicker: {
    color: picker,
    fontSize: 12
  },
  textPicker: {
    color: '#343a40',
    fontSize: 14
  },
  buttonRegister: {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
    borderRadius: 5,
    overflow: "hidden",
    flex: 1,
    width: window.width,
    alignItems: "center",
    padding: 10,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    backgroundColor: PrimaryButton
  },
  txtButtonRegister: {
    color: "#ffffff",
    fontWeight: "bold"
  },
})


export function formStructConfigSelected(defaultStyleSheet) {
  const stylesheet = _.cloneDeep(defaultStyleSheet);
  // Textbox
  /* Normal */
  stylesheet.textbox.normal.color = BootstrapColors.darkGrey;
  stylesheet.textbox.normal.fontSize = 12;
  stylesheet.textbox.normal.borderBottomColor = projectColors.green;
  stylesheet.textbox.normal.borderTopWidth = 0;
  stylesheet.textbox.normal.borderLeftWidth = 0;
  stylesheet.textbox.normal.borderRightWidth = 0;
  /* Error */
  stylesheet.textbox.error.color = BootstrapColors.darkGrey;
  stylesheet.textbox.error.fontSize = 12;
  stylesheet.textbox.error.borderBottomColor = BootstrapColors.danger;
  stylesheet.textbox.error.borderTopWidth = 0;
  stylesheet.textbox.error.borderLeftWidth = 0;
  stylesheet.textbox.error.borderRightWidth = 0;
  // Select
  /* Normal */
  stylesheet.select.normal.borderBottomColor = BootstrapColors.white;
  stylesheet.select.normal.color = BootstrapColors.darkGrey;
  /* Error */
  stylesheet.select.error.color = BootstrapColors.danger;
  // Error Block
  stylesheet.errorBlock.color = BootstrapColors.danger;
  stylesheet.errorBlock.fontSize = 12;
  stylesheet.errorBlock.fontWeight = "bold";
  // Control label
  /* Normal */
  stylesheet.controlLabel.normal.fontSize = 12;
  stylesheet.controlLabel.normal.fontWeight = "normal";
  stylesheet.controlLabel.normal.color = projectColors.green;
  /* Error */
  stylesheet.controlLabel.error.fontSize = 12;
  stylesheet.controlLabel.error.fontWeight = "normal";
  stylesheet.controlLabel.error.color = BootstrapColors.danger;
  return stylesheet
}
