import { Text } from 'react-native'
import DebugConfig from './DebugConfig'
import AppConfig from './AppConfig'

import { YellowBox } from 'react-native';

// Allow/disallow font-scaling in app
// Text.defaultProps.allowFontScaling = AppConfig.allowTextFontScaling

if (__DEV__) {
  // If ReactNative's yellow box warnings are too much, it is possible to turn
  // it off, but the healthier approach is to fix the warnings.  =)
  console.disableYellowBox = !DebugConfig.yellowBox;

  //warnings about websocket is 'normal' for all updated react native apps;
  YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
  ]);
}
