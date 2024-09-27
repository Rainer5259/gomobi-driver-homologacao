// Modules
import { StyleSheet } from "react-native";

// Themes
import { ApplicationStyles } from "../../Themes/";
import { PrimaryButton, projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  parentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contCheckDisabled:{
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderColor: "#ddd",
    backgroundColor: '#eee',
  },
  contCheck: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderColor: "#ddd",
    backgroundColor: '#fff',
  },
  spaceCheckBokChild: {
    marginLeft: 7,
    width: 40,
    height: 40
  },
  centered: {
    alignItems: "center"
  },
  subtitleText: {
    fontFamily: 'roboto',
    color: projectColors.lightBlack,
    textAlign: "center",
    fontSize: 16
  },
  subtitleBox: {
    marginTop: 30,
    marginBottom: 15
  },
  view: {
    backgroundColor: "#ffffff"
  },
  areaFilters: {
    backgroundColor: "#fefefe",
    flex: 100,
    minHeight: window.height,
    position: "relative",
    paddingHorizontal: 30
  },
  rowFilters: {
    flexWrap: "wrap",
    flexDirection: "row"
  },
  column: {
    flex: 50
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
})
