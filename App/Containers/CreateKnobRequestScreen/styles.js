// Modules
import { StyleSheet, Dimensions } from "react-native";
import _ from "lodash"

// Themes
import {
  PrimaryButton,
  projectColors,
  BootstrapColors
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

const btnWidth = Dimensions.get('window').width - 25;
const cardWidth = Dimensions.get('window').width - 50

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	containerAddress: {
		backgroundColor: '#fff',
		paddingHorizontal: 20,
		top: -2,
		elevation: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent:"space-around",
		alignItems: "center",
		paddingBottom: 15
	},
	touchSource: {
		height: 35,
		backgroundColor: "#F5F5F5",
		justifyContent: "center",
		paddingHorizontal: 10,
		marginBottom: 10
	},
	touchDestino: {
		height: 35,
		backgroundColor: "#F5F5F5",
		justifyContent: "center",
		paddingHorizontal: 10,
	},
	areaBottomEstimative: {
		bottom: 0
	},
	userDataText: {
		fontSize: 18,
		color: "#647792",
		fontWeight: "normal",
		textAlign:'justify',
		marginTop: 15
	},
	titleText: {
		fontSize: 18,
		color: "#647792",
		fontWeight: "normal",
		textAlign:'justify',
		paddingHorizontal: 25,
		marginBottom: 20
	},
	button_knob_request: {
		alignContent: "center",
		alignItems: "center",
		marginVertical: 10
	},
	button: {
		backgroundColor: PrimaryButton,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 3,
		height: 50,
		width: btnWidth,
		marginHorizontal: 25
	},
	paymentContainer: {
		width: cardWidth,
		backgroundColor: "#fff",
		borderRadius: 4,
		paddingLeft: 5,
		paddingRight: 5,
		paddingVertical: 15,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		alignSelf: 'center',
	},
	paymentCardModal: {
		margin: 5,
		width: cardWidth,
		backgroundColor: "#fff",
		borderRadius: 4,
		borderWidth: 0,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: {
		  width: 0,
		  height: 2,
		},
		shadowOpacity: 0.23,
		shadowRadius: 2.62,
		elevation: 3,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 25,
		marginRight: 25
	},
	flag: {
    resizeMode: 'contain',
    height: 35,
    width: 45,
  },
	textMessage: {
    fontSize: 16,
		paddingLeft: 30,
  },
  iconCheck: {
    position: "absolute",
    right: 20,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PrimaryButton,
    borderRadius: 12,
    height: 23,
    width: 38,
  },
	addStop: {
		flex: 0.1,
		width: 25,
		height: 35,
		alignItems: 'center'
	},
	touchStop: {
		flex: 0.9,
		height: 35,
		backgroundColor: "#F5F5F5",
		justifyContent: "center",
		paddingHorizontal: 10,
		marginBottom: 10
	},
});

export function formStructConfigSelected(defaultStyleSheet) {
  const stylesheet = _.cloneDeep(defaultStyleSheet);
  // Textbox
  /* Normal */
  stylesheet.textbox.normal.color = BootstrapColors.darkGrey;
  stylesheet.textbox.normal.fontSize = 12;
  stylesheet.textbox.normal.borderBottomColor = projectColors.green;
  stylesheet.textbox.normal.borderTopWidth = 0;
  stylesheet.textbox.normal.borderLeftWidth = 0;
  stylesheet.textbox.normal.borderRightWidth = 0;
  /* Error */
  stylesheet.textbox.error.color = BootstrapColors.darkGrey;
  stylesheet.textbox.error.fontSize = 12;
  stylesheet.textbox.error.borderBottomColor = BootstrapColors.danger;
  stylesheet.textbox.error.borderTopWidth = 0;
  stylesheet.textbox.error.borderLeftWidth = 0;
  stylesheet.textbox.error.borderRightWidth = 0;
  // Select
  /* Normal */
  stylesheet.select.normal.borderBottomColor = BootstrapColors.white;
  stylesheet.select.normal.color = BootstrapColors.darkGrey;
  /* Error */
  stylesheet.select.error.color = BootstrapColors.danger;
  // Error Block
  stylesheet.errorBlock.color = BootstrapColors.danger;
  stylesheet.errorBlock.fontSize = 12;
  stylesheet.errorBlock.fontWeight = "bold";
  // Control label
  /* Normal */
  stylesheet.controlLabel.normal.fontSize = 12;
  stylesheet.controlLabel.normal.fontWeight = "normal";
  stylesheet.controlLabel.normal.color = projectColors.green;
  /* Error */
  stylesheet.controlLabel.error.fontSize = 12;
  stylesheet.controlLabel.error.fontWeight = "normal";
  stylesheet.controlLabel.error.color = BootstrapColors.danger;
  return stylesheet
}
