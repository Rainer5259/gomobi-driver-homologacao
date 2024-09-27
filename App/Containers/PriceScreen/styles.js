import { StyleSheet } from "react-native";
import { BootstrapColors, projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";
import { Colors } from "../../Themes";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.transparent
  },
  sectionInputs: {
    marginTop: 10,
    paddingLeft:30,
    paddingRight:30,
    paddingBottom: 100
  },
  parentContainer: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  titleText: {
    fontSize: 16,
    color: "#50565A",
    fontWeight: "normal",
    textAlign: 'justify',
    paddingHorizontal: 25,
    marginTop:20
  },
  buttonOpacity: {
    marginTop: 10
  },
  buttonSave: {
    backgroundColor: BootstrapColors.primary,
    borderRadius: 5,
  },
  buttonReset: {
    backgroundColor: projectColors.secondaryGreen,
    borderRadius: 5,
  },
  txtButtonSave: {
    color: "#ffffff",
    fontWeight: "bold"
  },
});