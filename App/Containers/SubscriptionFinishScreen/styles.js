// Modules
import { StyleSheet, Dimensions } from "react-native";

// Themes
import colors from "../../Themes/Colors";
import { ApplicationStyles } from "../../Themes";
import { projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";

const cardWidth = Dimensions.get('window').width - 50;

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    parentContainer: {
        flex: 1,
        backgroundColor: "#FBFBFB",
        padding: 0,
    },

    planDetails: {
        fontSize: 16,
        marginBottom: 5,
    },
    billetLink: {
        textAlign: "center",
        fontSize: 16,
        marginBottom: 5,
        color: colors.info
    },
    pixLink: {
        textAlign: "center",
        fontSize: 16,
        marginBottom: 5,
        color: colors.info
    },
    containerDetails: {
        flex: 1,
        backgroundColor: "#FBFBFB",
        padding: 0,
        paddingHorizontal: 25,
        justifyContent: 'space-between'
    },
    confirmButton: {
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
    addCard: {
        color: projectColors.primaryGreen,
        fontWeight: 'bold',
        paddingVertical: 10,
        fontSize: 16
    },
    listTypes: {
        margin: 5,
        width: '98%',
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
        alignItems: 'center'
    },
    iconCheck: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: projectColors.primaryGreen,
        borderRadius: 12,
        height: 20,
        width: 20
    },
    iconUncheck: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDD',
        borderRadius: 12,
        height: 20,
        width: 20
    },
    contentDetails: {
        backgroundColor: '#FFF',
        padding: 25,
        borderRadius: 5
    },
    planName: {
        fontWeight: 'bold',
        fontSize: 18,
        paddingVertical: 10
    },
    textContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    fontBold: {
        fontWeight: 'bold'
    },
    cancelText: {
        fontWeight: 'bold',
        color: '#8F8F8F'
    },
    cardIcon: {
        width: 50,
        height: 30,
        resizeMode: "contain"
    },
    nextButton: {
        marginTop: 15,
        marginBottom: 15
    },
});
