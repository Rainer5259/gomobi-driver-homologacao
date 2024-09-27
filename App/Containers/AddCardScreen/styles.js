// Modules
import { StyleSheet } from "react-native";

// Themes
import {
    BootstrapColors,
    PrimaryButton
} from '../../Themes/WhiteLabelTheme/WhiteLabel';

export default StyleSheet.create({
    parentContainer: {
        flex: 1,
        padding: 0,
    },
    DefaultInputStyle: {
        height: 40,
        marginBottom: 8,
        borderBottomColor: BootstrapColors.grey,
        borderBottomWidth: 1,
        color: BootstrapColors.darkGrey
    },
    DefaultInputLabel: {
        fontSize: 12,
        color: BootstrapColors.muted
    },
    ErrorLabel: {
        fontSize: 12,
        fontWeight: "normal",
        color: BootstrapColors.danger
    },
    ButtonStyle: {
        width: '100%',
        backgroundColor: PrimaryButton,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25
    },
    BtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: 'space-between'
    },
    marginBottom: {
        marginBottom: 15
    },
    container2: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    container2Width: {
        marginBottom: 15,
        width: '48%'
    }
});
