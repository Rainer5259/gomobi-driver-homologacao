//@flow
import { PermissionsAndroid, Platform } from "react-native";
import Toast from "react-native-root-toast";
import { strings } from "../Locales/i18n";
import * as parse from '../Util/Parse';

export const permissionsAction = {
  requestLocationPermission,
  requestCameraPermission,
  requestReadExternalStorage,
  requestWriteExternalStorage,
  requestCallPermission,
};

function isPermissionGranted(permissionRequest) {
  return permissionRequest !== PermissionsAndroid.RESULTS.DENIED;
}

async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    ]);

    if (granted['android.permission.ACCESS_FINE_LOCATION'] === 'never_ask_again' || granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      parse.showToast(strings("splash.neverAskAgain"), Toast.durations.LONG)
    }

    if (granted['android.permission.ACCESS_FINE_LOCATION'] === 'granted' || granted === PermissionsAndroid.RESULTS.GRANTED || Platform.OS !== 'android') {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}

async function requestCameraPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    return isPermissionGranted(granted);
  }
  return false;
}

async function requestReadExternalStorage() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    if (isPermissionGranted(granted)) {
      try {
        const grantedCamera = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        return isPermissionGranted(grantedCamera);
      } catch (err) {
        console.warn(err);
      }
    }
  } else {
    return true;
  }
  return false;
}

async function requestWriteExternalStorage() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
      return isPermissionGranted(granted);
    } else {
      return true;
    }
  } catch (err) {
    console.warn(err);
  }
  return false;
}

async function requestCallPermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CALL_PHONE);
      return isPermissionGranted(granted);
    } else {
      return true;
    }
  } catch (err) {
    console.warn(err);
  }
  return false;
}
