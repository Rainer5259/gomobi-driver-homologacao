// Modules
import { StyleSheet } from 'react-native'
import _ from "lodash"

// Themes
import { BootstrapColors, projectColors } from '../../Themes/WhiteLabelTheme/WhiteLabel'

export default StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    uploadButton: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'dashed',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginTop: 15
    },
    uploadText: {
        fontFamily: 'Roboto',
        fontSize: 16,
        marginLeft: 10
    },
    containerIconUpload: {
        height: 30,
        width: 50,
        borderRadius: 25,
        marginRight: 15,
        justifyContent: 'center'
    },
    txtValidate: {
        fontFamily: 'Roboto',
        fontSize: 11,
        color: projectColors.gray,
        marginBottom: 5
    },
})

export function formStructConfigSelected(defaultStyleSheet) {
  const stylesheet = _.cloneDeep(defaultStyleSheet);
  stylesheet.textbox.normal.color = BootstrapColors.darkGrey;
  stylesheet.textbox.normal.fontSize = 12;
  stylesheet.textbox.normal.borderBottomColor = projectColors.green;
  stylesheet.textbox.normal.borderTopWidth = 0;
  stylesheet.textbox.normal.borderLeftWidth = 0;
  stylesheet.textbox.normal.borderRightWidth = 0;

  stylesheet.textbox.error.color = BootstrapColors.darkGrey;
  stylesheet.textbox.error.fontSize = 12;
  stylesheet.textbox.error.borderBottomColor = BootstrapColors.danger;
  stylesheet.textbox.error.borderTopWidth = 0;
  stylesheet.textbox.error.borderLeftWidth = 0;
  stylesheet.textbox.error.borderRightWidth = 0;


  stylesheet.select.normal.borderBottomColor = BootstrapColors.white;
  stylesheet.select.normal.color = BootstrapColors.darkGrey;

  stylesheet.select.error.color = BootstrapColors.danger;

  stylesheet.errorBlock.color = BootstrapColors.danger;
  stylesheet.errorBlock.fontSize = 12;
  stylesheet.errorBlock.fontWeight = "bold";


  stylesheet.controlLabel.normal.fontSize = 12;
  stylesheet.controlLabel.normal.fontWeight = "normal";
  stylesheet.controlLabel.normal.color = projectColors.green;

  stylesheet.controlLabel.error.fontSize = 12;
  stylesheet.controlLabel.error.fontWeight = "normal";
  stylesheet.controlLabel.error.color = BootstrapColors.danger;
  return stylesheet
}
