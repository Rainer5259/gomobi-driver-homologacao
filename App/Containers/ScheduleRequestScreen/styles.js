// Modules
import { StyleSheet } from "react-native";
import { scale} from "react-native-size-matters";

// Themes
import {
	PrimaryButton,
	ColorServiceRequest,
} from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
	parentContainer: {
		flex: 1
	},
	avatar: {
		height: 80,
		width: 80,
		borderRadius: 50,
		marginRight: 10
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
})
