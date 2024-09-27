import { StyleSheet, Platform } from "react-native";
import { PrimaryButton, projectColors } from "../../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
  containerModalReferral: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 25,
    paddingTop: 10,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    marginTop: Platform.OS === 'ios' ? 20 : 0
  },
  titleModalReferral: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: '#222B45',
  },
  textCodeReferralWarning: {
    color: '#222B45',
    fontSize: 15,
    textAlign: "justify",
    marginTop: 10,
    marginBottom: 10
  },
  referralCode: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#eee",
  },
  closeButtonReferralModal: {
    display: 'flex',
    flex: 1,
    borderRadius: 5,
    backgroundColor: PrimaryButton,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    padding: 10
  },
  closeButtonText: {
    color: projectColors.white,
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
})
