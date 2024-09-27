import AsyncStorage from '@react-native-community/async-storage';
import { NativeModules } from 'react-native';
import Reactotron, { networking } from 'reactotron-react-native';

if (__DEV__) {
  const { scriptURL } = NativeModules.SourceCode;
  const scriptHostname = scriptURL.split('://')[1].split(':')[0];
  const tron = Reactotron.configure({ host: scriptHostname })
    .useReactNative()
    .setAsyncStorageHandler(AsyncStorage)
    .use(
      networking({
        ignoreContentTypes: /^(image)\/.*$/i,
        ignoreUrls: /\/(logs|symbolicate)$/,
      }),
    )
    .connect();

  console.tron = tron;
}