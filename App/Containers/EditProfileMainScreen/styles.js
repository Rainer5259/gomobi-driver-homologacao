// Modules
import { StyleSheet } from "react-native"

// Themes
import { ApplicationStyles } from "../../Themes"
import { projectColors, backgroundBlankFaded } from '../../Themes/WhiteLabelTheme/WhiteLabel'

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    parentContainer: {
        flex: 1,
        backgroundColor: backgroundBlankFaded,
    },
    contImage: {
        marginTop: 10,
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: 130,
        height: 130,
        borderRadius: 80,
        backgroundColor: projectColors.white,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 80
    },
    divider: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: projectColors.lightGray,
        width: '95%',
        alignSelf: 'center'
    },
    imgBackCont: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 100,
        width: '100%',
        alignSelf: 'center'
    },
    contIconCamera: {
        backgroundColor: projectColors.secondaryWhite,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        borderRadius: 120,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        height: 35,
        width: 35,
    },
    contMenuList: {
        width: '95%',
        alignSelf: 'center',
        marginTop: 15,
        marginBottom: 10,
	  },
    btnMenuItem: {
        flexDirection: 'row',
        marginBottom: 20
    },
    imgMenuItem: {
        width: 24,
        height: 24
    },
    nameMenuList: {
        fontFamily: 'Roboto',
        fontSize: 18,
        color: projectColors.lightBlack,
        fontWeight: '500',
        marginLeft: 20
    },
    contTitleBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    },
})
