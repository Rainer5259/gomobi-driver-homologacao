// Modules
import { StyleSheet } from "react-native"

// Themes
import { firstBackground } from '../../Themes/WhiteLabelTheme/WhiteLabel'

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: firstBackground
    },
    containerTitle: {
        marginTop: 30,
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgLogo: {
        width: 350,
        height: 200,
    },
    containerButtons: {
        justifyContent: 'center',
        width: 327,
        marginBottom: '30%'
    },
});
