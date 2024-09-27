import { StyleSheet } from "react-native";
import { BootstrapColors, PrimaryButton } from '../../../../../Themes/WhiteLabelTheme/WhiteLabel';

export default StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  containerImage: {
    height: 220,
    position: 'relative',
  },
  containerFooter: {
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 50
  },
  input: {
    textTransform: 'uppercase',
    height: 50,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.41,
    borderBottomWidth: 1,
    color: 'black',
    borderColor: '#242E42',
  },
  inputContainer: {
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '300', // 350 não é válido
    fontStyle: 'italic',
    lineHeight: 20,
    letterSpacing: 2,
    color: '#242E42'
  },
  textShared: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 22,
    letterSpacing: 1,
    textAlign: 'center',
    color: '#242E42',
    width: '100%',
    padding: 20
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12
  },
});
