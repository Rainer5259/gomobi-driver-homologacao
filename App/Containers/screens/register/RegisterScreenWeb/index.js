import { useEffect, useState } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { currentLanguage, strings } from "../../../../Locales/i18n";
import { BootstrapColors, WBASE_URL } from "../../../../Themes/WhiteLabelTheme/WhiteLabel";
import WebView from "react-native-webview";

// Custom components
import DefaultHeader from "../../../../Components/DefaultHeader";

const URL_USER_REGISTER_WEB = `${WBASE_URL}/provider/signup?invite_code=Linkt-Gomobi&origem=mobile`;

const RegisterScreenWeb = (props) => {

  const [loading, setLoading] = useState(true);

  let backHandler;

  useEffect(() => {
    backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      props.navigation.goBack();
      return true;
    });

    setTimeout(() => {
      setLoading(false);
    }, 1500)

    return () => {
      backHandler.remove();
    }
  }, [])

  const getUrlWithParams = () => {
    let url = URL_USER_REGISTER_WEB + '&language=' + currentLanguage;
    let data = props.navigation?.state?.params || {};
    if (!!data.loginBy) {
      let login = data.loginSocial || {};
      url +=
        '&login_by=' + data.loginBy +
        '&email=' + (login.socialEmail || "") +
        '&first_name=' + (login.firstName || "") +
        '&last_name=' + (login.lastName || "") +
        '&external_id=' + (login.socialId || "");
    }
    return url;
  }

  return (
    <View style={{flex: 1, backgroundColor: BootstrapColors.white}}>
      <DefaultHeader
        loading={loading}
        loadingMsg={strings('load.Loading')}
        btnBack={true}
        btnBackListener={() => props.navigation.goBack()}
        title={strings('profileProvider.basicData')}
      />

      <WebView
        source={{ uri: getUrlWithParams() }}
        style={styles.webview}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  parentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 0
  },
});

export default RegisterScreenWeb;
