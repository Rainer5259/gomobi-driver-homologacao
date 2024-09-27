// Modules
import { StyleSheet } from "react-native";

// Themes
import {
  projectColors,
  PrimaryButton
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: projectColors.white,
  },

  infoSecond: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    width: '90%'
  },
  boxSrcAddr: {
    flexDirection: 'row',
    width: '100%'
  },
  boxDestAddr: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8
  },

  labelService: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: projectColors.lightGray
  },
  infoAddress: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: projectColors.lightBlack,
    marginLeft: 6,
    fontWeight: 'bold'
  },
  infoService: {
    marginLeft: 20,
    flexDirection: 'row',
    marginTop: 8,
    width: '90%'
  },
  textService: {
    fontFamily: 'Roboto',
    fontSize: 15,
    color: projectColors.lightBlack,
    fontWeight: 'bold',
    marginLeft: 6
  },

  card: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    backgroundColor: projectColors.secondaryWhite,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20
  },
  divider: {
    backgroundColor: projectColors.lightGray,
    height: 1,
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8
  },

  contMap: {
    height: 170,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5
  },
  map: {
    flex: 2,
    width: '100%',
    marginTop: 10
  },
  contInfoCustomer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    justifyContent: 'space-between'
  },
  txtCustName: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold'
  },
  contRating: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  contLoc: {
    marginRight: 20,
    marginLeft: 10,
    width: '85%'
  },
  txtHelp: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: projectColors.white
  },
  txtSend: {
    fontFamily: 'Roboto',
    color: projectColors.white,
    fontWeight: 'bold'
  },
  contAvatar: {
    backgroundColor: projectColors.lightGray
  },
  contPayment: {
    flexDirection: 'row',
    marginRight: 20,
    alignItems: 'center'
  },
  txtPayment: {
    fontFamily: 'Roboto',
    fontSize: 11,
    color: projectColors.lightBlack
  },
  iconPayment: {
    marginLeft: 6
  },
  contPaymentAddrss: {
    marginLeft: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btnCleaning: {
    backgroundColor: PrimaryButton,
    marginTop: 10,
    paddingVertical: 6,
    width: '65%',
  },
  inputNote: {
    backgroundColor: projectColors.lightGray,
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  btnNote: {
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    marginTop: 30,
    marginBottom: 15,
    elevation: 5,
    borderRadius: 5,
    overflow: "hidden",
    width: '50%',
    alignSelf: 'center',
    alignItems: "center",
    height: 40,
    justifyContent: 'center',
    backgroundColor: PrimaryButton
  },
  txtCleaning: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: projectColors.white
  },
  btnConfirm: {
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
    marginBottom: 15,
    marginTop: 15,
  },
  viewConfirm: {
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
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 15,
    marginTop: 15,
  },

})
