import { StyleSheet, Text } from "react-native";
import { BootstrapColors, PrimaryButton } from "../../../Themes/WhiteLabelTheme/WhiteLabel";


const TitleInput = ({ label, onFocused, hasError }) => {

  const textSelected = hasError
  ? { color: BootstrapColors.danger }
  : { color: onFocused ? PrimaryButton : styles.label.color }

  return (
    <Text style={[styles.label, textSelected]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: 'normal',
    textTransform: 'uppercase'
  },
});


export default TitleInput;