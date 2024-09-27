// Modules
import { StyleSheet } from "react-native";

// Themes
import { PrimaryButton, projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 0
  },
  loading: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  imgBlankState: {
    width: 150,
    height: 150
  },
  areaBlankState: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
  },
  txtBlankState: {
    color: "#cccccc"
  },
  btnRequestItem: {
    marginTop: 10,
    marginBottom: 10,
    elevation: 5,
    backgroundColor: projectColors.white,
    width: '90%',
    alignSelf: 'center',
    shadowOffset: { height: 0, width: 0 },
    shadowColor: 'transparent',
    shadowOpacity: 0,
    borderRadius: 5
  },
  boxInformation: {
    padding: 2,
    paddingBottom: 15,
    paddingTop: 15,
  },
  infoFirst: {
    flex: 1,
    width: "100%"
  },
  infoTime: {
    fontFamily: 'Roboto',
    fontSize: 13,
    color: '#222B45',
    marginLeft: 10
  },
  contCustomer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  infoCustomer: {
    fontFamily: 'Roboto',
    fontSize: 17,
    color: projectColors.black,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  textValue: {
    fontFamily: 'Roboto',
    fontSize: 17,
    color: PrimaryButton,
    fontWeight: 'bold',
    marginLeft: 6,
    marginTop: 12,
    marginRight: 10
  },
  infoService: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 8,
    width: '90%'
  },
  labelService: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: projectColors.lightGray
  },
  textService: {
    fontFamily: 'Roboto',
    fontSize: 15,
    color: projectColors.black,
    fontWeight: 'bold',
    marginLeft: 6
  },
  infoAddress: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: projectColors.lightBlack,
    marginLeft: 6,
    fontWeight: 'bold'
  },
  infoSecond: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 20
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
  screen: {
    backgroundColor: projectColors.white,
    left: 0,
    right: 0,
    zIndex: 0,
    flex: 1,
    width: window.width
  },
});
