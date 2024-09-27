// Modules
import { StyleSheet, PixelRatio } from "react-native";
import _ from "lodash";

// Themes
import { ApplicationStyles } from "../../Themes";
import {
  PrimaryButton,
  uploadButton,
  projectColors,
  BootstrapColors
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
    marginTop: 30,
    backgroundColor: PrimaryButton,
	maxHeight: 40
  },
  txtButtonRegister: {
    color: "#ffffff",
    fontWeight: "bold"
  },
  contCheck: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
    paddingHorizontal: 20
  },
  screen: {
    backgroundColor: "#ffffff",

    top: 55,
    left: 0,
    right: 0,
    zIndex: 0,
    flex: 1,
    width: window.width
  },
  sectionInputs: {
    marginTop: 10,
    paddingHorizontal: 30,
    paddingBottom: 80
  },
})