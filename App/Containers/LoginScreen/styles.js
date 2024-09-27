import { StyleSheet } from "react-native"
import {
  BootstrapColors,
} from "../../Themes/WhiteLabelTheme/WhiteLabel"

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.9,
    width: '100%',
  },
  titleSecond: {
    fontSize: 24,
    color: BootstrapColors.colorTitleForm,
    fontWeight: '900',
    letterSpacing: 0.8,
    paddingLeft:20,
    paddingBottom: 20
  },
  sectionLogin: {
    position: 'relative',
    flex: 1,
  },
  containerFields: {
    paddingTop:40,
    flex: 1
  },
  formFields: {
    position: 'absolute',
    width:'90%',
    zIndex:99,
    top: -100,
    backgroundColor: BootstrapColors.white,
    flex: 1,
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    fontSize: 16,
    color: BootstrapColors.colorH2,
    fontStyle: 'normal',
    lineHeight: 20,
    fontWeight: '600'
  },
  inputsArea: {
    position:'relative',
    flexDirection: 'row',
  },
  eyePassword: {
    position:'absolute',
    right: 8,
    top: 14,
    backgroundColor: BootstrapColors.white,
    borderRadius: 20
  },
  defaultInputStyle: {
    fontWeight: '400',
    fontSize: 16,
    height: 50,
    marginBottom: 18,
    borderColor: BootstrapColors.borderColorInput,
    borderWidth: 1,
    borderRadius: 8,
    color: BootstrapColors.darkGrey,
    flexDirection: 'row',
  },
  containerFooter: {
    position: 'absolute',
    bottom: 20,
    zIndex: 0,
    height: 30,
    flexDirection: 'row',
    alignSelf: 'center',
    textAlign: "center",
    alignItems: "center",
    justifyContent: 'flex-end'
  },
  textFooterOne: {
    color: BootstrapColors.colorH2,
    fontSize: 14,
    height: '100%',
    paddingTop: 6
  },
  textFooterTwo: {
    color: BootstrapColors.colorH2,
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 5
  },
})
