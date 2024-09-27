// @flow
import _ from 'lodash';
import { moderateScale } from 'react-native-size-matters';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import i18n, { strings } from '../../Locales/i18n';

/**
 * Schema of colors
 */
export const BootstrapColors = {
  body: '#212529',
  danger: '#dc3545',
  darkGrey: '#343a40',
  darkPrimary: '#1b7994',
  darkSuccess: '#1b9461',
  info: '#17a2b8',
  lightDanger: '#f4d5d9',
  lightGrey: '#C6CBD4',//'#f8f9fa',
  grey: '#cccccc',
  lightSuccess: '#42b55d',
  primary: '#0097e1',
  buttonWhine: '#EF3087',
  disabled: '#61adff',
  secondary: '#6c757d',
  success: '#28a745',
  muted: '#6c757d',
  warning: '#ffc107',
  white: '#fff',
  purple: '#5B3477',
  lightPurple: '#664a7a',
  colorH2: '#50565A',
  colorTitleForm: '#262628',
  fontFamily: 'Montserrat',
  placeHolder: '#C8C7CC',
  borderColorInput: '#EFEFF4',
  lightGreyOpacity: '#EFEFF480'
};
/**
 * Project colors schema
 */
export const projectColors = {
  blue: '#C80000',
  orange: '#f97e00',
  white: '#fff',
  black: '#000',
  blueGrey: '#687a95',
  pink: '#fa1948',
  lightPink: '#fa2c56',
  lightBlack: '#2E2E2E',
  lightGray: '#d3d3d3',
  green: '#C80000',
  primaryGreen: '#0097e1',
  secondaryGreen: '#64AD7A',
  secondaryGray: '#A8A8A8',
  secondaryBlue: '#4B74FF',
  secondaryWhite: '#fbfbfb',
  facebookBlue: '#4B74FF',
  red: '#FF5555',
  fadedBlack: '#4A4A4A;',
  gray: '#C6CBD4',
  disableButtonColor: '#db4453',
  defaultBorderColor: '#4B74FF',
	primaryColor: '#0097e1',
	secondaryGreen: '#1c1d1f',
	lightBlack: '#2E2E2E',
};

export const defaultTextButton = {
  fontFamily: 'Roboto',
  color: projectColors.white,
  fontSize: 16,
  alignSelf: 'center',
};
/**
 * Style for those inputs that aren't in tcomb Form
 */
/**
 * Style for those inputs that aren't in tcomb Form
 */
export const DefaultInputStyle = {
  // height: 50,
  // marginBottom: 8,
  paddingBottom: -5,
  borderBottomColor: BootstrapColors.grey,
  borderBottomWidth: 1,
  color: BootstrapColors.darkGrey,
  // paddingTop: -100
};

/**
 * Style for those labels that aren't in tcomb Form
 */
export const DefaultInputLabel = {
  // height: hp('5%'),
  color: BootstrapColors.muted,
};
/**
 * Settings for toolbars
 */
export const toolbarOne = {
  height: 56,
  padding: 8,
  backgroundColor: BootstrapColors.white,
  shadowColor: '#000',
  shadowOffset: {
    width: 1,
    height: 1,
  },
  shadowOpacity: 0.8,
  shadowRadius: 0,
  elevation: 3,
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 0,
  width: '100%',
};
export const toolbarTwo = {
  height: 56,
  padding: 8,
  backgroundColor: BootstrapColors.white,
  shadowColor: '#000',
  shadowOffset: {
    width: 1,
    height: 1,
  },
  shadowOpacity: 0.8,
  shadowRadius: 0,
  elevation: 3,
  alignItems: 'center',
  position: 'relative',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 0,
  width: '100%',
};
export const toolbarThree = {
  height: 56,
  padding: moderateScale(8),
  backgroundColor: BootstrapColors.white,
  shadowColor: '#000',
  shadowOffset: { width: 1, height: 1 },
  shadowOpacity: 0.8,
  shadowRadius: 0,
  elevation: 30,
  alignItems: 'center',
};
/**
 * Stylesheet to Form
 * @param {any} defaultStyleSheet
 */
export function formStructConfig(defaultStyleSheet) {
  const stylesheet = _.cloneDeep(defaultStyleSheet);
  // Textbox
  /* Normal */
  stylesheet.textbox.normal.color = BootstrapColors.darkGrey;
  stylesheet.textbox.normal.fontSize = 12;
  stylesheet.textbox.normal.borderBottomColor = BootstrapColors.grey;
  stylesheet.textbox.normal.borderTopWidth = 0;
  stylesheet.textbox.normal.borderLeftWidth = 0;
  stylesheet.textbox.normal.borderRightWidth = 0;
  /* Error */
  stylesheet.textbox.error.color = BootstrapColors.darkGrey;
  stylesheet.textbox.error.fontSize = 12;
  stylesheet.textbox.error.borderBottomColor = BootstrapColors.danger;
  stylesheet.textbox.error.borderTopWidth = 0;
  stylesheet.textbox.error.borderLeftWidth = 0;
  stylesheet.textbox.error.borderRightWidth = 0;
  // Select
  /* Normal */
  stylesheet.select.normal.borderBottomColor = BootstrapColors.white;
  stylesheet.select.normal.color = BootstrapColors.darkGrey;
  /* Error */
  stylesheet.select.error.color = BootstrapColors.danger;
  // Error Block
  stylesheet.errorBlock.color = BootstrapColors.danger;
  stylesheet.errorBlock.fontSize = 12;
  stylesheet.errorBlock.fontWeight = 'bold';
  // Control label
  /* Normal */
  stylesheet.controlLabel.normal.fontSize = 12;
  stylesheet.controlLabel.normal.fontWeight = 'normal';
  stylesheet.controlLabel.normal.color = BootstrapColors.muted;
  /* Error */
  stylesheet.controlLabel.error.fontSize = 12;
  stylesheet.controlLabel.error.fontWeight = 'normal';
  stylesheet.controlLabel.error.color = BootstrapColors.danger;
  return stylesheet;
}
/**
 * Style for input on EditBasicStepScreen.js
 * Change password input isn't on getOptionsInput
 */
export const changePasswordOption = {
  height: 50,
  paddingHorizontal: 7,
  borderRadius: 0,
  borderBottomColor: BootstrapColors.grey,
  borderBottomWidth: 1,
  marginBottom: 15,
};
export const txtLabelPassowrd = {
  fontSize: 12,
  color: BootstrapColors.muted,
};

/**
 * Variable that define how we're going to call our client
 */
export const WUSER_ROLE = 'Cliente';

/**
 * If we want to add Global variables
 * Add here
 */
export const backgroundColor1 = projectColors.green;
export const backgroundBlankFaded = projectColors.secondaryWhite;
export const backgroundBlank = projectColors.white;

/**
 * Picker
 */
export const picker = BootstrapColors.darkGrey;
/**
 * Border bottom divisor, that pink line
 */
export const borderBottomDivisor = projectColors.pink;
/** *
 * Secondary Border bottom divisor
 */
export const secondaryBorderBottomDivisor = projectColors.lightPink;
/**
 * Color used on background of toolbars
 */
export const toolbarBackgroundColor = BootstrapColors.white;
/**
 * SplashScreen, loginScreen and passwordScreen backgroundColor
 */
export const firstBackground = projectColors.white;
export const secondBackground = '#f7f7f7';
/**
 * SplashScreen, loginScreen and passwordScreen font color
 */
export const firstFonts = BootstrapColors.darkGrey;
export const loginFontColor = BootstrapColors.muted;
/**
 * Login main screen texts according to customer's wishes
 */
export const subtitle1 = strings('login.welcomeTitle');
export const subtitle2 = strings('login.enterYourData');
/**
 * SplashScreen progressbar (border and content color)
 */
export const progressBarBorderColor = projectColors.lightBlack;
export const progressBarColor = '#436988';
/**
 * PrimaryButton color schema
 */
export const PrimaryButton = BootstrapColors.primary;
export const SecondaryButton = projectColors.secondaryBlue;
export const DisabledButton = projectColors.disableButtonColor;
/**
 * Text button
 */
export const textButton = projectColors.white;
export const textButtonLight = projectColors.lightBlack;
export const textError = projectColors.red;
export const textInfo = projectColors.fadedBlack;
export const uploadedColor = projectColors.orange;
export const emptyUpload = projectColors.gray;
export const activeVehicleText = projectColors.lightBlack;
export const itemMenuText = projectColors.lightBlack;
/**
 * Upload button
 */
export const uploadButton = '#00acc1';
/**
 * BorderBottom input
 */
export const activeColor = projectColors.green;
export const disableColor = BootstrapColors.muted;
export const ColorBackgroundRightChat = projectColors.green;

/**
 * Login access screen texts
 */
export const welcomeBack = strings('login.welcomeTitle');
export const enterYourData = strings('login.enterYourData');
/**
 * Accept request slide button
 */
export const acceptRequestSlideBtn = '#0fbb50';
/**
 * Service slide button
 */
export const serviceSlideBtn = '#0761c1';
/**
 * Loader color (circle)
 */
export const loaderColor = '#436988';

export const titleColor = projectColors.white;

export const buttonEmailLoginColor = projectColors.green;

export const facebookColor = projectColors.facebookBlue;

/*
 * Texto da tela de indicação
 */
export const indicate = strings('indication.rebates_FeridasApp_msg');

export const to_share = strings('indication.share_promocode_msg');
/**
 * Texto que sera enviado para o usuario
 */
export const share_referral_code_1 = strings('indication.share_referral_code_1');

export const share_referral_code_3 = strings('indication.share_referral_code_3');
/**
 * Texto que sera enviado para o provider
 */
export const share_referral_code_4 = strings('indication.share_referral_code_1');

export const share_referral_code_6 = strings('indication.share_referral_code_3');

/**
 * Google variables and package configs
 */
// Login Social IOS
const ios_key = new String(
  'com.googleusercontent.apps.408414051993-ik5iannj8ko6o5f5b9l9la3rmn2m8d0h',
).split('.');
export const IOS_KEY = `${ios_key[3]}.${ios_key[2]}.${ios_key[1]}.${ios_key[0]}`;

// Type web -  OAuth 2.0
export const WGCM_WEB_KEY =
  '1039965384747-amim47sea2hq37pii96frnvknut8rgh0.apps.googleusercontent.com';

// Project number
export const WGCM_SENDER_ID = '408414051993';

// Google maps key
export const WGOOGLE_MAPS_KEY = 'AIzaSyACKNSCVOIQLywRJagEJFZKzpzZ0OkXERY';

// Package name
export const WPACKAGE_NAME = 'top.gomobi.provider';


// Package name USER (important change that, because we need to know the package name of user app inside provider project)
export const WPACKAGE_NAME_USER = 'top.gomobi.user';

// PROJECT NAME USER (important change that, because we need to know the name of user app inside provider project)
export const WPROJECT_NAME_USER = 'Sig';

// PROJECT NAME variable
export const WPROJECT_NAME = 'Sig - Motorista';

export const debugMode = false;
const devEnvironment = true;

const HOMOLOG_URL = 'https://homolog.gomobi.top';
const PROD_URL = 'https://app.gomobi.top';

export const WBASE_URL = devEnvironment ? HOMOLOG_URL : PROD_URL;

const SOCKET_PORT = devEnvironment ? '12001' : '6001';

export const WSOCKET_URL = `${WBASE_URL.replace('https', 'wss')}:${SOCKET_PORT}`;

export const WREDIS_URL = devEnvironment ? `redis://L9vwKxUP2FZsyS6M9EwH@${WBASE_URL}:6379/0` : `redis://ghvmv83x4m0QQGzhMhTF@${WBASE_URL}:6379/1`;

const GO_MOBI = {
  PROD: {
    url: 'https://api.gomobi.top',
    clientKey: '445f3d2533ec31e5660bc1dccaa6d80c',
    clientSecret: 'a3cfbaa5b818925fbc3151ca71bbb1fa',
  },
  HOMOLOG: {
    url: 'https://api-homolog.gomobi.top',
    clientKey: '7e68f371d54859a7bd4a8b540da8351a',
    clientSecret: '4d4c7e6f30d683388f7f8212c084a958',
  }
};
export const APIS = {
  GO_MOBI: {
    ...(devEnvironment ? GO_MOBI.HOMOLOG : GO_MOBI.PROD),
    endpoints: {
      token: '/auth/key',
      userAuthorized: '/eumais10/user/',
      vehiclePlate: '/virs/vehicle/',
    },
    external: {
      paymentUrl: 'https://pay.kiwify.com.br/rOPIkPz',
      sigScreen: 'https://gomobi.top/eumais10link/'
    }
  }
};

export const has_full_screen_splash = 'true';

export const ColorServiceRequest = projectColors.white;

export const whitelabel_app_theme_enabled = false;
