// Modules
import { StyleSheet } from 'react-native'

// Themes
import { Fonts, Size } from '../../Themes';

export default StyleSheet.create({
    container: {
        flexBasis: 0,
        flexGrow: 1,
        flex: 1,
        backgroundColor: '#00000026',
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        margin: Size.normalize(10),
        padding: Size.normalize(10),
        borderRadius: Size.normalize(10)

    },
    title: {
        ...Fonts.style.h4,
        textAlign: 'center',
        color: "#000000",

    },
    subtitle: {
        ...Fonts.style.des,
        color: '#333',
        textAlign: 'center',
        marginBottom: Size.normalize(30)

    },
    image: {
        height: Size.normalize(185),
        width: Size.normalize(185)
    },
    header : {
        alignItems: 'center',
        paddingTop: Size.normalize(16),
        marginBottom: Size.normalize(10)
    },
    body: {
        flex: 4,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: Size.normalize(20)
    },
    footer: {
    }

});
