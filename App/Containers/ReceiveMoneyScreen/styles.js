// Modules
import { StyleSheet } from "react-native";
import { PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FBFBFB'
    },
    toobar: {
        height: '10%',
        width: '100%',
        backgroundColor: PrimaryButton,
        alignItems: 'center',
        paddingHorizontal: 10,
        flexDirection: 'row',
    },
    what: {
        fontWeight: '700'
    },
    painel: {
        flex: 1,
        padding: 20,
    },
    footer: {
        width: '100%',
        marginLeft: 20,
        bottom: 0,
        position: 'absolute'
    },
    buttonPront: {
        height: 50,
        marginBottom: 20,
        width: '100%',
        backgroundColor: PrimaryButton,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    textButton: {
        color: '#FFF'
    }
});
