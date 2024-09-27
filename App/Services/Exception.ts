import { Platform } from "react-native";
import VersionNumber from "react-native-version-number";
import { WPROJECT_NAME, WBASE_URL, debugMode } from "../Themes/WhiteLabelTheme/WhiteLabel";
import NetInfo from "@react-native-community/netinfo";

const params = `?version_code=${VersionNumber.appVersion}&version_os=${
  Platform.OS
}_${Platform.Version}&error=`;
const appTypeUri = `/api/lib/rn-log-error${params}`;

export const handlerException = async (origin?: string, error?: any): Promise<void> => {
  const stack = error.stack ? error.stack : '';
  let errorReport = String(error) + ' ' + stack ;

  const connection = {
    type: '',
    details: ''
  };

  await NetInfo.fetch().then(state => {
    connection.type = state.type;
    connection.details = state.details;
  });

  if (debugMode) {
    console.error(WPROJECT_NAME, errorReport);
  } else {
    try {
      fetch(`${WBASE_URL}${appTypeUri}${errorReport}&app=${WPROJECT_NAME}&origin=${origin}&native=false&connection=${JSON.stringify(connection)}`);
    } catch (error) {
      console.log("handlerException", error);
    }
  }
}
