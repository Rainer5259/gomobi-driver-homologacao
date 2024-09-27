// Modules
import { StyleSheet } from "react-native";
import { ApplicationStyles } from "../../Themes";
import { scale } from "react-native-size-matters";

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: 'space-evenly'
  },
  slideButton: {
    elevation: 1,
    borderRadius: 3,
    backgroundColor: '#FF7B7B',
    marginHorizontal: 20,
    marginBottom: 10
  },
  containerContentSlidingButton: {
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row"
  },
  icon_arrow_right_white: {
    width: scale(15),
    height: scale(15),
  },
  titleText: {
    textAlign: 'center',
    marginLeft:'30%',
    fontSize: scale(14),
    color: "#ffffff",
  },
  info: {
    flex: 1,
    margin: 20,
    alignItems: 'center',
    marginTop: 10
  },
  image: {
    flex: 1,
    width: '90%',
    resizeMode: 'contain',
	  margin: 20
  },
  boxInfo: {
    flexDirection: 'row',
    alignSelf:'stretch',
    justifyContent: 'space-between',
    margin: 10,
    marginTop: 5
  },
  valueCollected: {
	  fontWeight: "bold",
    fontSize: 18
  },
  invoiceText: {
	  fontSize: 15
  },
});
