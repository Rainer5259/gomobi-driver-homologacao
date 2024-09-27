import { StyleSheet, Switch, Text, TouchableOpacity } from "react-native";
import { BootstrapColors } from "../../Themes/WhiteLabelTheme/WhiteLabel";
import { strings } from "../../Locales/i18n";
import { View } from "react-native";

const AcceptTerms = (
  {
    value,
    setTermsAccepted,
    onPress
  }
) => {

  return (
    <View style={styles.terms}>
      <Switch
        value={value}
        onValueChange={setTermsAccepted} />
      <Text style={{ marginTop: 5 }}>
        {strings("register.terms_msg")}
      </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.termsAccepted}>
          {strings("register.terms_of_use")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

//</TouchableOpacity><TouchableOpacity onPress={() => navigate("TermsScreen")}>

export const styles = StyleSheet.create({
  termsAccepted: {
    color: BootstrapColors.primary,
    marginTop: 5
  },
  terms: {
    flexDirection: "row",
    marginBottom: 15
  },

});

export default AcceptTerms;