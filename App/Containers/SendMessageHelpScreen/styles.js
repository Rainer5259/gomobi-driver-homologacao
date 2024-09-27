// Modules
import { StyleSheet,Platform } from "react-native"

// Themes
import { projectColors } from "../../Themes/WhiteLabelTheme/WhiteLabel"

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: projectColors.white
    },
    contToolbar: {
        paddingHorizontal: 25,
       marginTop: Platform.OS === 'android' ? 0 : 25
    },
    body: {
        marginTop: 20
    },

})
