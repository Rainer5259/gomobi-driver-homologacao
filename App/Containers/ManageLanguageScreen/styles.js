// Modules
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: "#FBFBFB",
      padding: 0,
      paddingHorizontal: 25,
    },
    card: {
      flexDirection: "row",
      justifyContent: "center",
      width: "100%",
      marginBottom: 15,
      paddingVertical: 15,
      backgroundColor: "#fff",
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    textMessage: {
      fontSize: 16,
    },
    iconCheck: {
      position: "absolute",
      right: 20,
      alignSelf: "center",
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#d9f2e1',
      borderRadius: 12,
      height: 23,
      width: 38,
    },
    flag: {
      position: "absolute",
      left: 20,
      alignSelf: "center",
      justifyContent: 'center',
      alignItems: 'center',
      height: 23,
      width: 38,
    },
})
