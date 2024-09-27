// Modules
import { Dimensions, StyleSheet } from "react-native";

// Themes
import {
  BootstrapColors,
  projectColors,
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({

  parentContainer: {
    flex: 1,
    height: window.height,
    backgroundColor: BootstrapColors.primary
  },
  body: {
    flex: 1,
    position: "relative",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatar: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 10,
    zIndex: 2
  },
  formContainerWhite: {
    backgroundColor: BootstrapColors.white,
    flex: 1,
    padding: 16,
    paddingTop: 60,
    borderRadius: 8,
    position: "relative"
  },
  areaMessageAvaliate: {
    paddingHorizontal: 3,
  },
  userArea: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -50,
    zIndex: 1,
  },

  nameUserTxt: {
    letterSpacing: 0.3,
    fontWeight: "500",
    fontSize: 18,
    lineHeight: 20,
    textAlign: 'center',
    paddingTop: 10
  },

  textAreaComentary: {
    height: 100,
    width: '100%',
    borderColor: BootstrapColors.lightGreyOpacity,
    borderWidth: 1,
    textAlign: "left",
    textAlignVertical: "top",
    letterSpacing: 0.4,
    fontWeight: "400",
    fontSize: 20,
    lineHeight: 20,
    backgroundColor: BootstrapColors.lightGreyOpacity,

  },
  card: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 15,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textMessage: {
    color: "#222",
    fontSize: 16,
    marginBottom: 5
  },
  iconCheck: {
    position: "absolute",
    right: 20,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    height: 23,
    width: 38,
  },
  areaValue: {
    borderBottomWidth: 1,
    borderBottomColor: "#AAAAAA60",
    justifyContent: "space-between",
    alignContent: "center",
    flexDirection: "row",
  },
  textName: {
    fontSize: 16,
  },
  areaPrice: {
    justifyContent: "space-between",
    alignContent: "center",
    flexDirection: "row"
  },
  txtPrice: {
    color: projectColors.primaryColor,
    fontSize: 16,
    marginRight: 5
  },
  questionRaceTxt: {
    letterSpacing: 0.3,
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    paddingVertical: 12
  },
  feedbackTxt: {
    letterSpacing: 0.4,
    fontWeight: "400",
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
    color: BootstrapColors.grey,
    paddingVertical: 8
  }

});
