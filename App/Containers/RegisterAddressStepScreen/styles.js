// Modules
import { StyleSheet } from "react-native";
import _ from "lodash"

// Themes
import {
  PrimaryButton,
  projectColors,
  BootstrapColors,
  backgroundBlank,
  picker
} from "../../Themes/WhiteLabelTheme/WhiteLabel";
import { ApplicationStyles } from "../../Themes";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  parentContainer: {
    flex: 1,
    backgroundColor: backgroundBlank,
  },
  containerScrollSecondary: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 100
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
  txtState: {
    fontSize: 12,
    color: '#6c757d'
  },
  picker: {
    height: 50,
    width: 100,
  },
  textPicker: {
    color: '#343a40',
    fontSize: 14
  },
  itemPicker: {
    color: picker,
    fontSize: 12
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
