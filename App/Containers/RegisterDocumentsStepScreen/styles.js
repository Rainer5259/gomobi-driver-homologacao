// Modules
import { StyleSheet,Platform } from "react-native"

// Themes
import {
  backgroundBlank,
  projectColors,
  PrimaryButton
} from "../../Themes/WhiteLabelTheme/WhiteLabel"

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundBlank,
	marginBottom: 10
  },
  centered: {
    alignItems: "center"
  },
  containerTitle: {
    paddingHorizontal: 25  
  },
  cloudImage: {
    alignSelf: 'center',
    marginTop: 19
  },
  buttonRegister: {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
    borderRadius: 5,
    overflow: "hidden",
    width: window.width,
    alignItems: "center",
    padding: 10,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    backgroundColor: PrimaryButton,
  },
  txtButtonRegister: {
    color: "#ffffff",
    fontWeight: "bold"
  },
  divider: {
    backgroundColor: '#B7B7B7',
    height: 1,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 8,
    marginRight: 8
	},
	principal: {
        marginBottom: 20,
    },
  text: {
        color: "#222B45",
        fontSize: 25,
        fontWeight: "bold"
    }
})
