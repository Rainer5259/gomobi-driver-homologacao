import Reactotron from "reactotron-react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { AppRegistry } from "react-native";
import App from "./App/Containers/App";


const tron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

console.tron = tron;

if (!__DEV__) {
	global.console = {
		info: () => {},
		log: () => {},
		assert: () => {},
		warn: () => {},
		debug: () => {},
		error: () => {},
		time: () => {},
		timeEnd: () => {},
	};
}

AppRegistry.registerComponent("UberCloneProvider", () => App);
