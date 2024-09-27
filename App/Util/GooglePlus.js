import { GoogleSignin as GoogleSignInApi, statusCodes } from '@react-native-google-signin/google-signin';
import { WGCM_WEB_KEY, IOS_KEY } from "../Themes/WhiteLabelTheme/WhiteLabel";
import { handlerException } from '../Services/Exception';
import * as constants from '../Util/Constants';
import * as parse from '../Util/Parse';
import Toast from 'react-native-root-toast';

/**
 * Configure Google Plus
 * API's Tutorial -> (https://github.com/react-native-google-signin/google-signin)
 */
const config = () => {
  GoogleSignInApi.configure({
    //scopes: ["https://www.googleapis.com/auth/plus.login"], // what API you want to access on behalf of the user, default is email and profile
    //iosClientId: "", // only for iOS
    webClientId: WGCM_WEB_KEY, // client ID of type WEB for your server (needed to verify user ID and offline access)
    offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //hostedDomain: "", // specifies a hosted domain restriction
    //forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
    //accountName: "", // [Android] specifies an account name on the device that should be used
    //forceCodeForRefreshToken: true,
  });
}

const loadUserData = (response, doLogin) => {
  const user = response.user;
  const social = {
    socialId: user.id,
    socialEmail: user.email,
    firstName: user.givenName,
    lastName: user.familyName
  };

  doLogin(social, constants.GOOGLE);
}

const handleLoginExceptions = (error) => {
  handlerException('LoginMainScreen', error);

  let description;
  if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    // user cancelled the login flow
    // usuário cancelou o fluxo de login
  } else if (error.code === statusCodes.IN_PROGRESS) {
    // operation (e.g. sign in) is in progress already
    description = 'Outro login sendo processado';
    // operação (por exemplo, o login) já está em andamento
  } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    // play services not available or outdated
    description = 'Serviços da Play não disponíveis';
    // serviços de execução não disponível ou desatualizado
  } else {
    // some other error happened
    // algum outro erro ocorreu
    description = "Erro [" + error.code + "]";
  }
  if (description) {
    // description = strings("error.not_registered");
    parse.showToast(description, Toast.durations.SHORT);
    console.log("LoginMainScreen", "Error on social login", description, error);
  }
}

/**
 * Call the Google Plus SignIn API
 */
export default async function GoogleSignin(doLogin) {
  try {
    await GoogleSignInApi.hasPlayServices();
    config(doLogin);

    await GoogleSignInApi.signIn().then((response) => loadUserData(response, doLogin));
  } catch (error) {
    handleLoginExceptions(error);
  }
}
