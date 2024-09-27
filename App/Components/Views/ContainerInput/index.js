import { StyleSheet, View, Text } from "react-native";
import { BootstrapColors, PrimaryButton } from "../../../Themes/WhiteLabelTheme/WhiteLabel";
import TitleInput from "../../Texts/TitleInput";

const ContainerInput = ({ children, hasError, onFocused, label, msgError, visible = true }) => {


  const styleDinamic = hasError
    ? { borderBottomColor: BootstrapColors.danger }
    : { borderBottomColor: onFocused ? PrimaryButton : BootstrapColors.grey }

  return (
    <>
      {visible &&
        <View style={[styles.containerForm, styleDinamic]}>
          <TitleInput label={label} hasError={hasError} onFocused={onFocused} />
          <View style={[styles.input, styleDinamic]}>
            {children}
          </View>
          {!!hasError && (
            <Text style={styles.error}>{msgError}</Text>
          )}
        </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  containerForm: {
    position: "relative",
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
  },
  error: {
    position: "absolute",
    bottom: -17,
    color: BootstrapColors.danger,
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default ContainerInput;