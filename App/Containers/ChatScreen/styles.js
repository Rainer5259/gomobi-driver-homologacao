// Modules
import { StyleSheet } from "react-native"

//Themes
import { ColorBackgroundRightChat } from "../../Themes/WhiteLabelTheme/WhiteLabel";

export default StyleSheet.create({
    container: {
        flex: 1
    },
    messageText: {
        color: '#211F1F'
    },
    messageTextRight: {
        color: '#211F1F'
    },
    time: {
        color: '#9aa2ab'
    },
    timeRight: {
        color: '#fff'
    },
    leftBubble: {
        backgroundColor: '#FBFBFB',
        marginTop: 10
    },
    rightBubble: {
        backgroundColor: ColorBackgroundRightChat,
        elevation: 5,
        marginTop: 10
    },
    contImg: {
        marginRight: 15,
        marginBottom: 5,
    },
    leftBubble: {
        marginLeft: -30,
        backgroundColor: '#FBFBFB',
        marginTop: 10,
        elevation: 5,
    },
})
