import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { handlerException } from '../Services/Exception';
import * as constants from '../Util/Constants';
import * as parse from '../Util/Parse';
import Toast from 'react-native-root-toast';

/**
 * Call Facebook API with reading permissions
 * API's Tutorial -> (https://github.com/facebook/react-native-fbsdk)
 */
const logInWithReadPermissions = () => {

  if (AccessToken.getCurrentAccessToken() != null) {
    LoginManager.logOut()
  }

  return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
    (result) => { if (!result.isCancelled) return result; },
    (error) => { handlerException('Facebook.loginWithReadPermissions', error); }
  );
}

const loadUserData = (response, doLogin) => {
  const user = response.json();
  const social = {
    socialId: user.id,
    socialEmail: user.email,
    firstName: user.first_name,
    lastName: user.last_name
  };

  doLogin(social, constants.FACEBOOK);
}

/**
 * Call Facebook API and get current user information.
 */
const getUserInformation = () => {
  return AccessToken.getCurrentAccessToken().then((data) => {
    return fetch(constants.FACEBOOK_GET_USER_URL + data.accessToken)
      .then((response) => response.json());
  });
}

const handleLoginExceptions = (error) => {
  parse.showToast(strings("error.not_registered"), Toast.durations.SHORT);
  handlerException('LoginMainScreen', error);
}

export default async function FacebookSignin(doLogin) {
  try {
    const facebookLogin = await logInWithReadPermissions();
    facebookLogin.then((result) => {
        if (!result.isCancelled) {
          getUserInformation().then(response => { loadUserData(response, doLogin); });
        }
      });
  } catch (error) {
    handleLoginExceptions(error);
  }
}
