// Modules
import { StyleSheet, PixelRatio, Platform, Dimensions } from "react-native";

// Themes
import { ApplicationStyles } from "../../Themes";
import {
  PrimaryButton
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  parentContainer: {
    flex: 1,
    backgroundColor: "#fff"
  },
  map: {
    top: 56,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    marginRight: 50,
    zIndex: -1,
    width: "100%",
    padding: 200
  },
  mapMarkerContainer: {
    left: '46%',
    position: 'absolute',
    top: '49.6%'
  },
  areaBottomButton: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 0,
    backgroundColor: "white",
    width: "100%",
    height: 130,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOk: {
    marginVertical: 10,
    width: "80%",
    height: 45,
    backgroundColor: PrimaryButton,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3
  },
  txtBtnStyle: {
    fontSize: 30,
    color: "white",
    fontWeight: "500"
  },
  addressText: {
    fontSize: 15,
    textAlign: 'center'
  },
});
