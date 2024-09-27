// Modules
import { StyleSheet, PixelRatio, Dimensions } from "react-native";

// Themes
import { ApplicationStyles } from "../../Themes";
import {
  BootstrapColors,
  projectColors
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

const boxWidth = Dimensions.get('window').width - 120

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  parentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 0,
    width: window.width,
    height: window.height
  },

  btnOk: {
    width: '100%',
    height: '100%',
    backgroundColor: projectColors.primaryGreen,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },

  areaConfirmAddress: {
  marginLeft: 20,
  marginRight: 20,
   height: 40,
  },

  txtBtn: {
    color: "#00afc5",
    fontSize: 11
  },

  txtBtnStyle: {
    color: "#ffffff",
    fontWeight: "bold"
  },
  viewPrincipal: {
    flex: 1,
    flexDirection: 'column',
  },
  useMyAddress: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",

    zIndex: -1,
    shadowOffset: { width: 1, height: 1 },
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: BootstrapColors.grey,
		height: "100%"
  },

});
