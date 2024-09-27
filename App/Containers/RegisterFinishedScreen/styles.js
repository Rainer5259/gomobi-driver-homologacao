import { StyleSheet } from "react-native"
//WhiteLabel styles
import { projectColors, blankBackground, PrimaryButton } from '../../Themes/WhiteLabelTheme/WhiteLabel'

export default StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: blankBackground
    },
    successImage: {
        alignSelf: 'center',
        marginTop: 140
    },
    containerTitle: {
        alignItems: 'center'
    },
    title: {
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#374750'
    },
    subTitle: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: '#333333',
        textAlign: 'center'
    },
    beginButton: {
        backgroundColor: PrimaryButton,
        width: '90%',
        height: 52,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 100
    },
    beginText: {
        fontFamily: 'Roboto',
        color: '#FFFFFF',
        fontSize: 16
    },
})