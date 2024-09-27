import { StyleSheet } from 'react-native'
import { projectColors } from '../../Themes/WhiteLabelTheme/WhiteLabel';
import { Colors, Fonts, Metrics } from '../../Themes';

export default StyleSheet.create({
    button: {
      height: 50,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      backgroundColor: projectColors.primaryColor
    },
    text: {
      color: Colors.snow,
      height: '100%',
      textAlign: "center",
      textAlignVertical: 'center',
      textTransform: "uppercase",
      fontWeight: "bold",
      fontSize: Fonts.size.medium,
      //marginVertical: Metrics.baseMargin,
    }
});
