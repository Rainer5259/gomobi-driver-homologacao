// Modules
import { StyleSheet, Dimensions, Platform } from "react-native";

export default StyleSheet.create({
  parentContainer: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 0 : 25
  },
  webview: {
    paddingHorizontal: 25,
  },
});
