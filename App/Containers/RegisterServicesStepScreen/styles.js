// Modules
import { StyleSheet} from "react-native";

// Themes
import { ApplicationStyles } from "../../Themes";
import {
  PrimaryButton,
  projectColors
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  parentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    backgroundColor: PrimaryButton,
    marginTop: 30
  },
  txtButtonRegister: {
    color: "#ffffff",
    fontWeight: "bold"
  },
  subtitleBox: {
    marginTop: 30,
    marginBottom: 15,
    marginHorizontal: 25
  },
  spaceCheckBokChild: {
    marginLeft: 7,
    width: 40,
    height: 40
  },
	subtitleText: {
		fontSize: 18, 
		color: "#647792", 
		fontWeight: "normal", 
		textAlign:'justify',
    paddingHorizontal: 25,
    marginBottom: 20 
	}
})


export function formStructConfigSelected(defaultStyleSheet) {
  const stylesheet = _.cloneDeep(defaultStyleSheet);


  stylesheet.textbox.normal.color = BootstrapColors.darkGrey;
  stylesheet.textbox.normal.fontSize = 12;
  stylesheet.textbox.normal.borderBottomColor = projectColors.green;
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
  stylesheet.controlLabel.normal.color = projectColors.green;

  stylesheet.controlLabel.error.fontSize = 12;
  stylesheet.controlLabel.error.fontWeight = "normal";
  stylesheet.controlLabel.error.color = BootstrapColors.danger;
  return stylesheet
}
