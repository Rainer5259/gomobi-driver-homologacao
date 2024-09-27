import { StyleSheet } from 'react-native'
import roundedButtonStyle from "../RoundedButton/styles";

export default StyleSheet.create({
  iconButton: {
    ...roundedButtonStyle.button,
    marginTop: 10
  },
  iconButtonText: {
    ...roundedButtonStyle.text,
    width: '70%',
    textAlign: 'left',
  },
  iconButtonImg: {
    width: '30%',
    height: '100%',
    textAlignVertical: 'center',
    alignItems: 'center'
  },
  iconButtonImgContainer: {
    flexDirection: "row",
    width: '100%',
  }
});
