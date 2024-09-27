import {Alert} from 'react-native';
import Toast from 'react-native-root-toast';
import {strings} from '../Locales/i18n';
import Provider from '../Models/Provider';

import {Images} from '../Themes';

//Services
import ProviderApi from '../Services/Api/ProviderApi';
import * as constants from '../Util/Constants';

import RNProviderBubble from 'react-native-provider-bubble';

import {store} from '../Store/storeConfig';
import {changeProviderData} from '../Store/actions/actionProvider';
import { handlerException } from '../Services/Exception';

/**
 * Funtion that check if request was a success or not.
 * @param {*} json
 */
export function isSuccess(json, navigate = null) {
	if (json.success == true) {
		return true;
	} else {
		showErrorMessage(json, navigate);
		return false;
	}
}

/**
 * Receive a JSON and print a Toast Error Message to user
 * @param {*} json
 */
export function showErrorMessage(json, navigate) {
	var msg = getErrorMessage(json, navigate);
	if (msg != true) {
		//if getErrorMessage != Unauthorized access
		showToast(msg, Toast.durations.SHORT);
	}
}

/**
 * Receive a JSON and get the error message from JSON.
 * @param {*} json
 */
export function getErrorMessage(json, navigate) {
	var msg = strings('error.error');

	if (json.error_messages != null && json.error_messages != '') {
		msg = JSON.stringify(json.error_messages);
		msg = msg.substring(2, msg.length - 2);
	} else if (json.msg != null && json.msg != '') {
		if (json.errors.length >= 1) {
			var all_errors = '';
			for (let i = 0; i < json.errors.length; i++)
				all_errors = all_errors + '\n' + json.errors[i] + '\n';
			Alert.alert(
				'Atente-se aos erros:',
				all_errors,
				[{text: 'OK'}],
				{cancelable: false}
			);
		}
		msg = JSON.stringify(json.msg);
		msg = msg.substring(1, msg.length - 1);
	} else if (json.error != null && json.error != '') {
		if (
			json.error == 'Acesso não autorizado' ||
			json.error == 'Unauthorized access'
		) {
			if (navigate) {
				Alert.alert(
					strings('error.error_validating_account'),
					strings('error.error_validating_account_msg'),
					[
						{text: 'OK', onPress: () => clearData(navigate)},
					],
					{cancelable: false}
				);
				clearInterval(constants.markerInterval);
			}
			return true;
		}

		if (json.error.messages != null && json.error.messages != '') {
			msg = JSON.stringify(json.error.messages);
			msg = msg.substring(2, msg.length - 2);
		} else {
			msg = JSON.stringify(json.error);
			msg = msg.substring(1, msg.length - 1);
		}
	}

	return msg;
}

/**
 * Show Toast to Android and iOS
 * @param {Toast Message} msg
 * @param {DURATION} duration
 */
export function showToast(msg, duration = Toast.durations.LONG) {
	if (typeof msg !== 'string') {
		if (typeof msg === null) msg = '';
		else {
			msg = JSON.stringify(msg);
		}
	}

	if (
		msg != 'Nenhum Prestador de Serviço encontrado' &&
		msg != 'No Provider Available'
	)
		Toast.show(msg, {
			duration: duration,
			position: Toast.positions.BOTTOM + 10,
			shadow: false,
			animation: true,
			hideOnPress: true,
      containerStyle: { height: 48 },
      textStyle: { fontSize: 18 }, // Tamanho original: 16
			delay: 0,
		});
}

/**
 * Show Toast to Android and iOS
 * @param {String} imageURL
 */
export function getImageURL(imageURL) {
	if (imageURL != null && imageURL != undefined && imageURL != '') {
		image_http = {uri: imageURL};
	} else {
		image_http = Images.avatar_register;
	}

	return image_http;
}

/**
 * Get Information from user and screen navigation and realize logout.
 *
 * @param {Number} id
 * @param {String} token
 * @param {this.props.navigation} navigate
 */
export function logout(id, token, navigate) {
	if (id && token) {
		logoutRequest = new ProviderApi().LogoutProvider(id, token);
		logoutRequest
			.then((response) => {
				var responseJson = response.data;
				if (responseJson.success) {
					clearData(navigate);
					return;
				} else {
					if (responseJson.error_code == 406) {
						clearData(navigate);
						return;
					}
				}
			})
			.catch((error) => {
				clearData(navigate);
        handlerException('Parse.logout', error)
				return;
			});
	}

	clearData(navigate);
	return;
}

/**
 * Clear Apllication data to do logout.
 *
 * @param {this.props.navigation} navigate
 */
export function clearData(navigate) {
	store.dispatch(changeProviderData(null));

	Provider.require(Provider);
	Provider.restore(constants.PROVIDER_STORAGE).then((provider) => {
		if (provider !== null) {
			provider.clearModel();
			provider.store(constants.PROVIDER_STORAGE);
			RNProviderBubble.stopService();
		}
	});

	navigate('LoginMainScreen');
}

/**
 *
 * @param {string} time - a string que será alterada
 */
export function replaceTimeString(time) {
	if (time != undefined)
		return time
			.replace('hours', strings('serviceInProgress.hours'))
			.replace('hour', strings('serviceInProgress.hour'))
			.replace('days', strings('serviceInProgress.days'))
			.replace('day', strings('serviceInProgress.day'));
	else return '0 min';
}

/**
 * Adiciona prefixo ao objeto do provider
 * @param {*} obj
 * @returns
 */
export function prefixProviderProfile(obj) {
	if (typeof obj !== 'object' || !obj) {
		return {};
	}

	const altObj = Object.fromEntries(
		Object.entries(obj).map(([key, value]) => [`_${key}`, value])
	);

	return altObj;
}
