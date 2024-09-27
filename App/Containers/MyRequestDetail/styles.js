// Modules
import { StyleSheet } from "react-native";

// Themes
import { projectColors, PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: projectColors.white,
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
  contAvatar: {
    backgroundColor: projectColors.lightGray
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
  contPrice: {
    alignItems: 'center'
  },
  labelService: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: projectColors.darkGray
  },
  textValue: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: PrimaryButton,
    fontWeight: 'bold',
    marginLeft: 6,
    marginTop: 6,
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
    color: projectColors.black,
    fontWeight: 'bold',
    marginLeft: 6
  },
  infoSecond: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,
    width: '90%'
  },
  contLoc: {
    marginRight: 20,
    marginLeft: 10,
    width: '85%'
  },
  boxSrcAddr: {
    flexDirection: 'row',
    width: '100%'
  },
  infoAddress: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: projectColors.lightBlack,
    marginLeft: 6,
    fontWeight: 'bold'
  },
  boxDestAddr: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8
  },
  divider: {
    backgroundColor: projectColors.lightGray,
    height: 1,
    marginTop: 20,
    marginLeft: 8,
    marginRight: 8
  },
  contPaymentAddrss: {
    marginLeft: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    maxWidth: 25,
    maxHeight: 25,
    marginLeft: 6
  },

  btnCleaning: {
    backgroundColor: projectColors.primaryGreen,
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginTop: 25,
  },
  txtCleaning: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: projectColors.white,
  },
  boxHelpBtn: {
    flexDirection: 'row',
    padding: 15
  },
})
