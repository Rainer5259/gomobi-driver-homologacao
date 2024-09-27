// Modules
import React, { Component } from "react";
import {
  View,
  Platform,
  Image,
  Alert,
  BackHandler,
  Dimensions,
  StatusBar,
  PermissionsAndroid
} from "react-native";
import _ from "lodash";
import { isEmpty } from "lodash";
import { connect } from "react-redux";
import * as Progress from "react-native-progress";
var Push = require("react-native-push-notification");
import NetInfo from "@react-native-community/netinfo";

// Locales
import { strings } from "../../Locales/i18n";

// Services
import NotificationService from "../../Services/pushNotifications";
import ProviderApi from "../../Services/Api/ProviderApi";
import { Region } from "../../Services/configBgLocation";
import { handlerException } from '../../Services/Exception';

// Themes
import {
  progressBarBorderColor,
  PrimaryButton,
  BootstrapColors
} from "../../Themes/WhiteLabelTheme/WhiteLabel";
import images from "../../Themes/WhiteLabelTheme/Images";

// Services
import NavigationService from "../../Services/NavigationService";

// Store
import {
  settingsAction,
  aplicationPage,
  audio,
  audioCancellation,
  audioChatProvider,
  setPaymentNomenclatures
} from "../../Store/actions/actionSettings";
import { providerAction } from "../../Store/actions/providerProfile";
import { requestUpdated } from "../../Store/actions/request";
import { changeProviderData } from "../../Store/actions/actionProvider";
import { setServiceList } from "../../Store/actions/actionServices";


//Utils
import * as constants from "../../Util/Constants";
import UserUtil from "../../Util/User";
import * as parse from "../../Util/Parse";

// Styles
import styles from "./styles";
import Spinner from "./Components/Spinner";

//React Native Fs
const dimensions = Dimensions.get("window");
const imageWidth = dimensions.width;
const imageHeight = dimensions.height;

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.userUtil = new UserUtil();
    this.providerApi = new ProviderApi();

    constants.bubbleStarted = false;
    this.state = {
      progress: 0,
      settings: false,
      isConnected: false
    };
  }

  componentDidMount() {
    this.askLocationPermission();

    NavigationService.setTopLevelNavigator(this.props.navigation);
    NotificationService.configure();
    if (Platform.OS === constants.IOS) {
      Push.checkPermissions((permissions) => {
        if (permissions.alert == false) {
          Alert.alert(strings("splash.deniedPermissionTitle"), strings("splash.goToSettings"));
        }
      });
    }
  }

  handleConnectivityChange = state => {
    console.log(state)
    if (state.isConnected) {
      this.setState({ isConnected: true }, () => {
        this.startDownload();
      });
    } else {
      this.setState({ isConnected: false }, () => {
        this.showAlert();
      });
    }
  };


  /**
   * Treat ProminentDisclosure to access fine location
   *
   */
  askLocationPermission = () => {
    // Asking provider to allow or deny the permission to access location
    if (Platform.OS == constants.ANDROID) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(response => {
        if (response) {
          NetInfo.addEventListener(this.handleConnectivityChange);
          Region();
        } else {
          this.navigateToScreen("ProminentDisclosure");
        }
      });
    } else {
      this.startDownload();
      NetInfo.addEventListener(this.handleConnectivityChange);
      Region();
    }

  };

  /**
   * Check if the download is completed
   */
  checkProgressBar = async () => {
    let prog = this.state.progress + 0.25;
    this.setState({ progress: prog });

    if (this.state.progress > 0.98) {
      this.setState({ progress: 1 });

      let screen = "LoginMainScreen";
      if (!!this.props.providerProfile) {
        if (this.props.providerProfile._id == "") {
          this.props.onProviderAction({ _id: "", _token: "", _is_active: "" });
        } else {
          this.props.changeProviderData(this.props.providerProfile);
          screen = "MainScreen";
        }
      }
      this.navigateToScreen(screen);
    }
  };

  /**
   * return const navigate = this.props.navigation
   */
  returnConstNavigate() {
    const { navigate } = this.props.navigation;
    return navigate;
  }

  /**
   * Get all the information from the webservice
   */
  startDownload() {
    if (this.state.isConnected) {
      //Types JSON
      this.providerApi
        .GetVehicleTypesServer()
        .then(response => {
          const responseJson = response.data;
          if (parse.isSuccess(responseJson, this.returnConstNavigate())) {
            this.props.setServiceList(responseJson.types);
            this.checkProgressBar();
          }
        })
        .catch(error => {
          handlerException('SplashScreen.startDownload.GetVehicleTypesServer', error);
        });

      //ApplicationPages JSON
      this.providerApi
        .GetApplicationPagesServer()
        .then(response => {
          var responseJson = response.data;
          if (parse.isSuccess(responseJson, this.returnConstNavigate())) {
            this.props.onAplicationPage(responseJson.informations);
            this.setState({ application: true });
            this.checkProgressBar();
          }
        })
        .catch(error => {
          handlerException('SplashScreen.startDownload.GetApplicationPagesServer', error);
        });

      //Settings JSON
      this.providerApi
        .GetSettingsServer()
        .then(response => {
          var responseJson = response.data;
          if (parse.isSuccess(responseJson, this.returnConstNavigate())) {

            // verifica se o audio de nova corrida vai usar o upload novo
            if (responseJson.audio_new_ride) {
              this.pingAudioUrl(responseJson.audio_new_ride, 'audio_new_ride');
            } else {
              this.pingAudioUrl(responseJson.beep_url, 'beep_url');
            }
            // verifica se o audio de cancelamento vai utilizar o novo upload
            if (responseJson.audio_ride_cancelation) {
              this.pingAudioUrl(responseJson.audio_ride_cancelation, 'audio_ride_cancelation');
            } else {
              this.pingAudioUrl(responseJson.audio_push_cancellation, 'audio_push_cancellation');
            }
            //carregar notificação de chat provider
            if (responseJson.audio_chat_provider) {
              this.pingAudioUrl(responseJson.audio_chat_provider, 'audio_chat_provider');
            }

            const button_slider = isEmpty(responseJson.button_slider)
              ? false
              : responseJson.button_slider;

            const settings = { ...responseJson, button_slider };

            this.props.onSettings(settings);

            this.setState({ settings: true });
            this.checkProgressBar();
          }
        })
        .catch(error => {
          handlerException('SplashScreen.startDownload.GetSettingsServer', error);
        });

      this.providerApi.getPaymentNomenclatures().then(
        (response) => {
          if (response && response.data)
            this.props.setPaymentNomenclatures(response.data);
        }
      );

      this.checkProgressBar();
    }
  }

  /**
   * Checa se a url do audio está funcionando
   *
   * @param {*} url
   * @param {*} beepType
   */
  async pingAudioUrl(url, beepType) {
    this.providerApi
      .pingAudio(url)
      .then(response => {
        if (response.data.success) {
          if (beepType == 'audio_new_ride' || beepType == 'beep_url') {
            this.props.loadAudioRequestBeep(url);
          } else if (beepType == 'audio_push_cancellation' || beepType == 'audio_ride_cancelation') {
            this.props.loadAudioCancellationBeep(url);
          } else if (beepType == 'audio_chat_provider') {
            this.props.loadAudioChatProvider(url);
          }
        }
      })
      .catch(error => {
        handlerException('SplashScreen.pingAudioUrl', error);
      });
  }

  showAlert() {
    if (Platform.OS == constants.ANDROID) {
      Alert.alert(
        strings("splash.internet_conn_error_title"),
        strings("splash.internet_conn_error"),
        [
          {
            text: strings("splash.internet_conn_exit"),
            onPress: () => BackHandler.exitApp(),
            style: "cancel"
          },
          {
            text: strings("splash.internet_conn_try_again"),
            onPress: () => this.startDownload()
          }
        ],
        { cancelable: false }
      );
    } else if (Platform.OS == constants.IOS) {
      Alert.alert(
        strings("splash.internet_conn_error_title"),
        strings("splash.internet_conn_error"),
        [
          {
            text: strings("splash.internet_conn_try_again"),
            onPress: () => this.startDownload()
          }
        ],
        { cancelable: false }
      );
    }
  }

  renderSplash(has_full_splash) {
    return (
      <Image
        source={images.splash_full}
        style={{ maxWidth: imageWidth, maxHeight: imageHeight }}
      />
    );
  }

  render() {
    return (
      <View style={{ backgroundColor: PrimaryButton, width: dimensions.width, height: dimensions.height }}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        {Platform.OS !== "ios" ? (
          <StatusBar
            hidden={false}
          />
        ) : (
          <StatusBar hidden={false} />
        )}

        <View style={[styles.container, {backgroundColor: PrimaryButton}]}>
          <Spinner></Spinner>

          <View>
            <Progress.Bar
              progress={this.state.progress}
              indeterminate={false}
              width={124}
              height={1}
              borderRadius={5}
              borderWidth={0.1}
              borderColor={progressBarBorderColor}
              color={BootstrapColors.white}
            />
          </View>
        </View>
      </View>
    );
  }

  /**
   * Go from SplashScreen to Another Screen
   */
  navigateToScreen(screen, request_id) {
    const { navigate } = this.props.navigation;
    if (screen == "ServiceUserBoardScreen") {
      navigate(screen, { screen: "ServiceUserBoardScreen", request_id: request_id });
    }
    if (screen == "ProminentDisclosure") {
      navigate(screen, { handleConnectivityChange: this.handleConnectivityChange.bind(this) });
    }
    navigate(screen, { screen: "SplashScreen" });
  }
}

const mapStateToProps = state => {
  const { providerProfile } = state.providerProfile;
  const { settings } = state.settingsReducer;
  const { request } = state.request;

  return { settings, request, providerProfile };
};

const mapDispatchToProps = dispatch => {
  return {
    onSettings: settings => dispatch(settingsAction(settings)),
    onProviderAction: provider => dispatch(providerAction(provider)),
    onRequestUpdated: request => dispatch(requestUpdated(request)),
    onAplicationPage: page => dispatch(aplicationPage(page)),
    loadAudioRequestBeep: value => dispatch(audio(value)),
    loadAudioCancellationBeep: value => dispatch(audioCancellation(value)),
    loadAudioChatProvider: value => dispatch(audioChatProvider(value)),
    changeProviderData: (values) => dispatch(changeProviderData(values)),
    setServiceList: (values) => dispatch(setServiceList(values)),
    setPaymentNomenclatures: value => dispatch(setPaymentNomenclatures(value))
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreen);
