// Modules
import { StyleSheet } from "react-native";

// Themes
import {
  secondBackground,
  BootstrapColors,
  loginFontColor,
  activeColor,
  PrimaryButton
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
  container: {
    backgroundColor: secondBackground
  },
  arrowButton: {
    alignItems: 'flex-start'
  },
  sectionLogin: {
    marginTop: 37,
    marginBottom: 5,
    width: 327,
    alignSelf: 'center'
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333333'
  },
  boxInfoPassword: {
    marginBottom: 20,
    marginTop: 20,
    color: loginFontColor
  },
  inputsArea: {
    marginTop: 19
  },
  labelFocused: {
    fontSize: 12,
    fontFamily: 'Avenir',
    color: activeColor
  },
  labelDefault: {
    fontSize: 12,
    fontFamily: 'Avenir',
  },
  inputFocused: {
    height: 40,
    marginBottom: 8,
    borderBottomColor: activeColor,
    borderBottomWidth: 1.5,
    color: BootstrapColors.darkGrey
  },
  recoveryButton: {
    backgroundColor: PrimaryButton,
    width: 327,
    height: 52,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15
  },
  recoveryText: {
    fontFamily: 'Roboto',
    color: '#FFFFFF',
    fontSize: 16
  },
});
