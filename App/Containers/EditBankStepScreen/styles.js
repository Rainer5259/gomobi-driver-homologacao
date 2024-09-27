// Modules
import { StyleSheet } from "react-native";
import _ from "lodash";

// Themes
import { ApplicationStyles } from "../../Themes";
import {
  PrimaryButton,
  projectColors,
  BootstrapColors
} from "../../Themes/WhiteLabelTheme/WhiteLabel";


export default StyleSheet.create({
  ...ApplicationStyles.screen,
  parentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  centered: {
    alignItems: "center"
  },
  contCheck: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    paddingHorizontal: 20
  },
  sectionInputs: {
    marginTop: 10,
    paddingHorizontal: 30,
    paddingBottom: 80
  },
  birthDate: {
    height: 40,
    width: '100%',
    borderBottomWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginBottom: 16,
    borderColor: projectColors.gray,
  },
  birthDateText: {
      fontSize: 16,
      marginLeft: 10
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
