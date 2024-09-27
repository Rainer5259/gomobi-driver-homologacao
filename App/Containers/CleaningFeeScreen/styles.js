// Modules
import { StyleSheet,Platform } from "react-native"

// Themes
import { projectColors, PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel"

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: projectColors.white
    },
    contToolbar: {
        marginTop: Platform.OS === 'android' ? 0 : 25 ,
    },
    body: {
        marginTop: 20,
        paddingHorizontal: 25
    },
    textSubTitle: {
        fontSize: 18,
        color: "#647792",
        fontWeight: "normal",
        textAlign:'justify',
        marginBottom: 20,
    },
    inputNote: {
        backgroundColor: '#F1F1F1',
        paddingLeft: 15,
        width: '100%',
        alignSelf: 'center',
        borderRadius: 5,
        borderColor: '#AAA',
        borderWidth: .5,
        textAlignVertical: 'top'
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
})
