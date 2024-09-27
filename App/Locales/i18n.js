import ReactNative from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
	'en': require('../Locales/en.json'),
	'en-US': require('../Locales/en.json'),
	'br': require('../Locales/pt-BR.json'),
	'pt-BR': require('../Locales/pt-BR.json'),
	'ao': require('../Locales/pt-AO.json'),
	'pt-AO': require('../Locales/pt-BR.json'),
	'pt': require('../Locales/pt-AO.json'),
	'pt-PT': require('../Locales/pt-AO.json')
};

export const currentLocale = I18n.currentLocale();

export const currentLanguage = (currentLocale.substring(0, 2).toLowerCase() || 'en');

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// Localizing momentjs
if (currentLocale.includes('pt-BR')) {
	require('moment/locale/pt.js');
	moment.locale('pt');
} else if (['pt-AO', 'pt-PT'].includes(currentLocale)) {
	require('moment/locale/pt.js');
	moment.locale('pt');
} else {
	moment.locale('en');
}

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
	return I18n.t(name, params);
};

export default I18n;
