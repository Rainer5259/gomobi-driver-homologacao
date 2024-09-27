import * as constants from "../Util/Constants";
import { strings } from "../Locales/i18n";
import BackgroundGeolocation from "react-native-background-geolocation";
import { handlerException } from "./Exception";


var coords = null
var bgEnabled = false

function onLocation(location) {
  coords = location.coords;
}

export const Region = async () => {
  if (coords != null) {
    let region = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.00922 * 1.5,
      longitudeDelta: 0.00421 * 1.5,
    };
    coords = null;
    return region;
  } else {
    return null;
  }
};

function onHttp(http) {
}

export const getEnabled = () => {
	return bgEnabled;
};

export const onError = (error) => {
  handlerException('configBgLocation.onError', error);
};

export const BgLocationClear = () => {
  try {
    coords = null;
    BackgroundGeolocation.changePace(false);
    BackgroundGeolocation.removeListeners();
    BackgroundGeolocation.stop();
  } catch (error) {
    handlerException('configBgLocation.BgLocationClear', error);
  }
};

export const BgLocationStart = async () => {
	await BackgroundGeolocation.start().then((state) => {
		bgEnabled = state.enabled;
    BackgroundGeolocation.changePace(true);
  });
  // This handler fires whenever bgGeo receives a location update.
  BackgroundGeolocation.on("location", onLocation, onError);
  BackgroundGeolocation.on("http", onHttp, onError);
};

export const configBgLocation = (
  providerId,
  token,
  update_location_interval,
  update_location_fast_interval,
  distance_filter,
  disable_elasticity,
  heartbeat_interval,
  stop_timeout,
  requestId = null
) => {
  var destRoute = constants.UPDATE_CURRENT_PROVIDER_LOCATION;
  var interval = update_location_interval;

  if (requestId) {
    destRoute = constants.UPDATE_PROVIDER_LOCATION;
    interval = update_location_fast_interval;
  }

  BackgroundGeolocation.ready(
    {
      //configuração para android, onde o plugin utiliza de GPS+WIFI+3G. Gasta mais bateria e tem melhor precisão
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      //distância mínima que o dispositivo se moveu horizontalmente para então poder ser disparado um evento
      distanceFilter: distance_filter,
      //desabilita a variação de distanceFilter baseada na velocidade
      disableElasticity: disable_elasticity ? true : false,

      //permite o funcionamento em segundo plano
      stopOnTerminate: false,
      // habilitar headles
      enableHeadless: true,

      foregroundService: true,
      //Se debug for true, entao quando o prestador clicar no botao online/offline vai fazer um bip (som). Para desativar o som, colocar false
      debug: false,
      allowIdenticalLocations: false,
      locationUpdateInterval: interval * 1000,
      heartbeatInterval: heartbeat_interval,
      stopTimeout: stop_timeout,
      disableLocationAuthorizationAlert: true,

      notification: {
        title: strings("geolocation.bgTrackingTitle"),
        text: strings("geolocation.bgTrackingText"),
      },

      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,

      backgroundPermissionRationale: {
        title: strings("BGlocationPermissions.title"),
        message: strings("BGlocationPermissions.message"),
        positiveAction: strings("BGlocationPermissions.positiveAction"),
        negativeAction: strings("BGlocationPermissions.negativeAction"),
      },

      url: constants.BASE_URL + destRoute,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      httpRootProperty: ".",
      locationTemplate:
        '{"latitude":<%= latitude %>,"longitude":<%= longitude %>,"location_accuracy":<%= accuracy %>, "bearing":<%= heading %>, "timestamp": "<%= timestamp %>"}',
      params:
        requestId == null
          ? {
              provider_id: providerId,
              token: token,
            }
          : {
              provider_id: providerId,
              token: token,
              request_id: requestId,
            },
    },
    (state) => {
      BgLocationStart();
    }
  );
};
