// Modules
import styled from "styled-components/native";
import { StyleSheet, Animated, Platform } from "react-native";
import { scale } from "react-native-size-matters";

// Themes
import { PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
	parentContainer: {
		flex: 1
	},
	map: {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		position: "absolute",
		zIndex: -1
	},
	direction: {
		marginRight: 20
	},
	infomap: {

		backgroundColor: "#4B4B4B",
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		margin: Platform.OS === 'android' ? 10 : 25,
		padding: 20,
		borderRadius: 5,
	},

	line: {
		height: 0.3,
		backgroundColor: '#FFF',
		marginVertical: 5
	},

	locationCurrent: {
		color: '#FFF',
		fontWeight: 'bold',
		fontSize: 16,
		marginBottom: 5
	},
	locationArrived: {
		color: '#FFF',
		fontWeight: 'bold',
	},
	locationArrival: {
		color: '#FFF',
		fontSize: 11
	},
	navigationOnPress: {
		borderRadius: 15,
		height: 30,
		marginTop: 8,
		backgroundColor: PrimaryButton,
    paddingHorizontal: 12,
		justifyContent: 'center',
		alignSelf: 'flex-end',
		alignItems: 'center',
    elevation: 3,
	},
	waitingOnPress: {
		marginLeft: 10,
		borderRadius: 15,
		height: 30,
		backgroundColor: PrimaryButton,
    paddingHorizontal: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	navigation: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
	inforCard: {
		backgroundColor: '#FFF',
		alignSelf: 'center',
		height: '100%',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10
	},
	toggle: {
		marginVertical: 15,
		width: 50,
		height: 4,
		borderRadius: 5,
		backgroundColor: "#e4e9f2",
		alignSelf: "center"
	},
	infoUser: {
		justifyContent: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		marginBottom: 20
	},
	avatar: {
		height: 40,
		width: 40,
		borderRadius: 50,
		marginHorizontal: 10
	},
	circleShare: {
		height: 35,
		width: 35,
		justifyContent: 'center',
		alignSelf: 'flex-end',
		alignItems: 'center',
		borderRadius: 50,
		backgroundColor: '#FFF',
    elevation: 3,
		marginTop: 8,
	},
	mapButton: {
		height: 35,
		width: 35,
		justifyContent: 'center',
		alignSelf: 'flex-end',
		alignItems: 'center',
		borderRadius: 50,
		backgroundColor: '#FFF',
    elevation: 3,
		marginTop: 8,
	},
	icon: {
		height: 35,
		width: 35,
		justifyContent: 'center',
		alignSelf: 'center',
		alignItems: 'center',
		borderRadius: 50,
		backgroundColor: '#FFF',
    elevation: 3,

	},
	text: {
		fontWeight: 'bold',
		marginHorizontal: 10
	},
	textIcon: {
		marginBottom: 5,
		flexDirection: 'row',
		alignItems: 'center'
	},
	slideButton: {
		elevation: 10,
		position: "relative",
		borderRadius: 3,
		backgroundColor: PrimaryButton,
		marginHorizontal: 20,
		marginBottom: Platform.OS === 'android' ? 10 : 20,

	},
	containerContentSlidingButton: {
		alignItems: "center",
		justifyContent: "space-evenly",
		flexDirection: "row"
	},
	titleText: {
		textAlign: 'center',
		flex: 1,
		fontSize: scale(14),
		color: "#ffffff",
		fontWeight: "bold",
	},
	icon_arrow_right_white: {
		width: scale(15),
		height: scale(15),
	},
	line2: {
		height: 0.3,
		backgroundColor: '#C3C3C3',
		marginVertical: 5
	},
	areaInfo: {

		flexDirection: 'row',
	},
	textDes: {
		color: '#333',
		paddingBottom: 4,
	},
	textValue: {
		fontWeight: 'bold',
		width: "85%"
	},
	textValuePasage: {
		fontWeight: 'bold',
		width: "95%"
	},
	iconCallUser: {
		backgroundColor: '#F5F5F5',
		borderRadius: 50,
		height: 35,
		width: 35,
		top: -10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	emergencyButton: {
		width: 45,
		height: 45,
		justifyContent: "center",
		alignItems: "center"
	},
	contUserInfo: {
		flexDirection: 'row',
		width: '60%',
		alignSelf: 'center'
	},
	textBoarding: {
		fontFamily: 'Roboto',
		color: '#2e2e2e'
	},
	waitingRideIcon: {
		height: 35,
		width: 35,
		justifyContent: 'center',
		alignSelf: 'flex-end',
		alignItems: 'center',
		borderRadius: 50,
		backgroundColor: PrimaryButton,
    elevation: 3,
		marginTop: 8,
	},
});

export const RouteInfoView = styled(Animated.View)`
    width: 95%;
    align-self: center;
    background-color: white;
    position:absolute;
    height:${(props) => props.type ? '500px' : '480px'};
    elevation:3;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
`
