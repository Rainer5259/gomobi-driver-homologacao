// Modules
import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";

// Themes
import {
	PrimaryButton,
	ColorServiceRequest,
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
	parentContainer: {
		flex: 1,
	},
	map: {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		position: "absolute",
		zIndex: -1
	},
	refuse: {
		flexDirection: 'row',
		padding: 15,
		color: ColorServiceRequest,
		fontWeight: 'bold',
	},
	star: {
		color: ColorServiceRequest,
		marginRight: 5
	},
	tipe: {
		color: ColorServiceRequest,
		fontWeight: "bold",
		fontSize: 18
	},
	refuseToucha: {
		borderRadius: 15,
		width: 100,
		height: 30,
		margin: 25,
		backgroundColor: PrimaryButton,
	},
	card: {
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
		backgroundColor: PrimaryButton,
		marginHorizontal: 15,

		padding: 15
	},
	avatar: {
		height: 80,
		width: 80,
		borderRadius: 50,
		marginRight: 10
	},

	distance: {
		color: ColorServiceRequest,
		textAlign: 'center',
		fontWeight: "bold",
		fontSize: 20,
	},
	dest: {
		color: ColorServiceRequest,
		textAlign: 'center',
		fontWeight: "bold",
		fontSize: 25
	},
	line: {
		height: 0.5,
		backgroundColor: ColorServiceRequest,
		marginVertical: 5
	},
	timeDest: {
		color: ColorServiceRequest,
		textAlign: 'center',
		fontWeight: "bold",
		fontSize: 20
	},
	slideButton: {
		backgroundColor: PrimaryButton,
		margin: 15
	},
	titleText: {
		fontFamily: 'Roboto',
		color: ColorServiceRequest,
		textAlign: 'center',
		flex: 1,
		fontSize: scale(16),
		fontWeight: "bold"
	},

	containerContentSlidingButton: {
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row"
	},
	icon_arrow_right_white: {
		width: scale(15),
		height: scale(15),
	},
	image: {
		flex: 1,
		height: 180,
		position: "absolute",
		top: 0,
	},
	refuse: {
		color: ColorServiceRequest
	},
	textSou: {
		fontSize: 16,
		color: ColorServiceRequest,
		fontWeight: "bold",
	},
	new: {
		marginTop: 5,
		color: ColorServiceRequest,
		textAlign: 'center',
		fontWeight: "bold",
		fontSize: 17
	},
	price: {
		fontSize: 50,
		fontWeight: "bold",
		color: ColorServiceRequest,
		textAlign: 'center',
	},

	inforCardTitleView: {
		backgroundColor: PrimaryButton,
		alignSelf: 'center',
		width: '80%',
    paddingVertical: 2,
    marginBottom: 2,
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8
	},
	inforCardTitleText: {
    color: '#fff',
    textAlign: 'center',
		fontWeight: 'bold',
    fontSize: 20
	},
})
