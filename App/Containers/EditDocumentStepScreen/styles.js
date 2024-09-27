// Modules
import { StyleSheet, Platform } from "react-native"

// Themes
import { PrimaryButton } from "../../Themes/WhiteLabelTheme/WhiteLabel"

export default StyleSheet.create({
  centered: {
    alignItems: "center"
  },
  containerTitle: {
    width: '90%',
    alignSelf: 'center',
    marginTop: Platform.OS === 'android' ? 14 : 25
  },
  divider: {
    backgroundColor: '#B7B7B7',
    height: 1,
    marginTop: 5,
    marginBottom: 10,
    marginLeft: 8,
    marginRight: 8
	}
})
