import _ from "lodash"
import { BootstrapColors, PrimaryButton, projectColors } from "../WhiteLabelTheme/WhiteLabel";

export default function formStructConfigSelected(defaultStyleSheet) {
  const stylesheet = _.cloneDeep(defaultStyleSheet);


  stylesheet.textbox.normal.color = BootstrapColors.darkGrey;
  stylesheet.textbox.normal.fontSize = 12;
  stylesheet.textbox.normal.borderBottomColor = BootstrapColors.primary;
  stylesheet.textbox.normal.borderTopWidth = 0;
  stylesheet.textbox.normal.borderLeftWidth = 0;
  stylesheet.textbox.normal.borderRightWidth = 0;

  stylesheet.textbox.error.color = BootstrapColors.darkGrey;
  stylesheet.textbox.error.fontSize = 12;
  stylesheet.textbox.error.borderBottomColor = BootstrapColors.danger;
  stylesheet.textbox.error.borderTopWidth = 0;
  stylesheet.textbox.error.borderLeftWidth = 0;
  stylesheet.textbox.error.borderRightWidth = 0;


  stylesheet.select.normal.borderBottomColor = BootstrapColors.white;
  stylesheet.select.normal.color = BootstrapColors.darkGrey;

  stylesheet.select.error.color = BootstrapColors.danger;

  stylesheet.errorBlock.color = BootstrapColors.danger;
  stylesheet.errorBlock.fontSize = 12;
  stylesheet.errorBlock.fontWeight = "bold";


  stylesheet.controlLabel.normal.fontSize = 12;
  stylesheet.controlLabel.normal.fontWeight = "normal";
  stylesheet.controlLabel.normal.color = PrimaryButton;

  stylesheet.controlLabel.error.fontSize = 12;
  stylesheet.controlLabel.error.fontWeight = "normal";
  stylesheet.controlLabel.error.color = BootstrapColors.danger;
  return stylesheet
}
