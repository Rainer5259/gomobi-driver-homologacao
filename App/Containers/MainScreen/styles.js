// Modules
import { StyleSheet } from "react-native";

// Themes
import { ApplicationStyles } from "../../Themes";
import { PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  parentContainer: {
    flex: 1
  },
  mapButton: {
    padding: 7,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(255,255,255,1)",
    marginLeft: 'auto',
    marginRight: 10,
    borderRadius: 25,
    zIndex: 1
  },
  map: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    zIndex: -1
  },
  recentralizeImage: {
    width: 30,
    height: 30,
  },
  areaBottomButtons: {
    flexDirection: "column",
    zIndex: -1,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 0,
  },
  knobButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 100,
  },
  knobText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  btnStatus: {
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtButtons: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#ffffff"
  },
  footerInfoDriver: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingBottom: 10,
    paddingTop: 8,
    width: '100%'
  },
  infoDriverColumn: {
    width: '33%',
    alignItems: 'center'
  },
  infoDriverLineValue: {
    fontFamily: 'roboto',
    color: '#282F39',
    fontWeight: 'bold',
    fontSize: 15
  },
  infoDriverLineDesc: {
    fontFamily: 'roboto',
    color: '#7F7F7F',
    fontSize: 13
  },
});
