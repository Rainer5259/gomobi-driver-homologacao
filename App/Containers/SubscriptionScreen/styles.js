// Modules
import { StyleSheet, Dimensions } from "react-native";

// Themes
import { ApplicationStyles } from "../../Themes/";
import {
    projectColors
  } from "../../Themes/WhiteLabelTheme/WhiteLabel";

const cardWidth = Dimensions.get('window').width - 50;

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    parentContainer: {
        flex: 1,
        backgroundColor: "#FBFBFB",
        padding: 0,
    },
    containerList: {
        flex: 1,
        backgroundColor: "#FBFBFB",
        padding: 0
    },
    listPlanTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingVertical: 10
    },
    selectPayment: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingVertical: 10
    },
    listPlanItem: {
        width: '98%',
        backgroundColor: "#fff",
        borderRadius: 4,
        elevation: 3,
        paddingLeft: 20,
        paddingRight: 10,
        paddingVertical: 10,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    nextBtn: {
        backgroundColor: projectColors.primaryGreen,
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nextTxt: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
    iconCheck: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: projectColors.primaryGreen,
        borderRadius: 12,
        height: 23
    },
    checkBoxStyle: {
        borderWidth: 0,
        paddingLeft: 0,
        marginLeft: 0
    },
    containerCheckBox: {
        flex: 1,
        padding: 0,
        paddingHorizontal: 25,
        justifyContent: 'space-between'
    },
    containerCheckBox: {
        backgroundColor: '#FFF',
        padding: 25,
        borderRadius: 5
    },
    nextButton: {
        marginTop: 15,
        marginBottom: 15
    },
});
