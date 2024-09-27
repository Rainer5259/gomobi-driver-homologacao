import '../Config';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import RootContainer from './RootContainer';
import CoordinatesProvider from '../Services/CoordinatesProvider';
import {View, StyleSheet} from 'react-native';
import WebSocketServer from '../Util/WebSocketServer';
import * as constants from '../Util/Constants';
// import {ErrorBoundary} from 'use-log-errors';
import RequestNotice from '../Services/RequestNotice';
import GeolocationNotice from '../Services/GeolocationNotice';
import RNBootSplash from 'react-native-bootsplash';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {store, persistor} from '../Store/storeConfig';
import {strings} from '../Locales/i18n';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {RootSiblingParent} from 'react-native-root-siblings';
import {PrimaryButton} from '../Themes/WhiteLabelTheme/WhiteLabel';
import { DefaultMessage } from '../Services/pushNotifications';



messaging().setBackgroundMessageHandler(async (message) => {
	let title = null;
	let messageBody = null;
	if(message.notification.title) {
		title = message.notification.title;
	}
	if(message.notification.body) {
		messageBody = message.notification.body;
	}
	DefaultMessage(title, messageBody);
});

const errorOptions = {
	message: strings('errorBoundary.message'),
	buttonTitle: strings('errorBoundary.buttonTitle'),
	buttonColor: PrimaryButton,
};

function HeadlessCheck({ isHeadless }) {
	if (isHeadless) {
	  return null;
	}

	return <App />;
}

function App() {
	let init = async () => {
		constants.socket = WebSocketServer.connect();
	};

	useEffect(() => {
		init().finally(() => {
			RNBootSplash.hide({duration: 250});
		});
	}, []);

	return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<View style={styles.parentContainer}>
						<RootSiblingParent>
							<RootContainer />
							<GeolocationNotice />
							<RequestNotice />
							<CoordinatesProvider />
						</RootSiblingParent>
					</View>
				</PersistGate>
			</Provider>
	);
}

const styles = StyleSheet.create({
	parentContainer: {
		flex: 1,
		backgroundColor: '#ffffff',
		padding: 0,
	},
});

AppRegistry.registerComponent('app', () => HeadlessCheck);
export default App;
