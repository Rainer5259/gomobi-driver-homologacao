import {
  WPROJECT_NAME,
  WBASE_URL,
  WSOCKET_URL,
  WREDIS_URL,
  loaderColor,
  WGCM_SENDER_ID,
  WPACKAGE_NAME,
  WPACKAGE_NAME_USER,
  WGOOGLE_MAPS_KEY,
  whitelabel_app_theme_enabled,
  WREDIS_DATABASE,
  APIS
} from "../Themes/WhiteLabelTheme/WhiteLabel";

/**
 * Application Constants
 */

/**
 * Variable Constants
 */
export const FACEBOOK = "facebook";
export const GOOGLE = "google";
export const APPLE = "apple";
export const ANDROID = "android";
export const IOS = "ios";
export const PACKAGE_NAME = WPACKAGE_NAME;
export const PACKAGE_NAME_USER = WPACKAGE_NAME_USER
export const PROJECT_NAME = WPROJECT_NAME;
export const DATEINITIAL = 1;
export const DATEFINAL = 0;
export const INICIATE_SCREEN_CHECKING_ACCOUNT = 0;
export const SCREEN_CHECKING_ACCOUNT = 1;
export const PROVIDER_UPDATE_TIME = 10000;
export const TRAVEL_UPDATE_TIME = 15000;
export const REQUEST_DETAILS_UPDATE_TIME = 10000;
export const PAYMENT_MODE_CARD = 0;
export const PAYMENT_MODE_MONEY = 1;
export const PAYMENT_MODE_VOUCHER = 2;
export const DEFAULT_REQUEST_INVOICE = 0;
export const INCREMENT_KEY_INVOICE = 100;
export const INCREMENT_ANOTHER_KEY_INVOICE = 1000;
export const GCM_SENDER_ID = WGCM_SENDER_ID;
export const LOADING_COLOR = loaderColor;
export const IS_PROVIDER = 1;
export const IS_USER = 2;

/**
 * BANNER
 */
export const BANNER = "/banner/banner_for_provider";

/**
 * Intervals
 */
export let timer = null;
export let markerInterval = null;
export let requestTimeAfterRequestStart = null;
export let intervalScheduleRequest = null;
export let intervalServiceRequest = null;
export let addressIntervalServiceUserBoard = null;
export let markerIntervalServiceUserBoard = null;
export let intervalServiceUserBoard = null;

export let device_token = null;
export let bubbleStarted = false;
export let currentScreen = "MainScreen";
export let hasService = false;
export let serviceRequestScreen = false;
export let hasConnectionAlert = false;

/**
 * Global Variables
 */

export var socket = null;

/**
 * API URL
 */
//export const BASE_URL = 'http://dev.amucoop.com/';
export const BASE_URL = WBASE_URL;
export const API_VERSION = "/api/v3"
// Localhost
// export const BASE_URL = 'http://10.0.2.2:8000';
// export const BASE_URL = 'http://localhost:8000';  //Acesso do servidor local no celular
export const API_VERSION_URL = "/api/v3";
export const API_VERSION_URL_3_1 = "/api/v3.1";
export const API_LIB_URL = "/api/libs";
export const HOST_URL = API_VERSION_URL + "/user";
export const HOST_PROVIDER_URL = API_VERSION_URL + "/provider";
export const HOST_PROVIDER_URL_3_1 = API_VERSION_URL_3_1 + "/provider";
export const LIB_PROVIDER_URL = API_LIB_URL + "/provider";
export const HOST_REQUEST_URL = "/request";
// export const SOCKET_URL = 'http://10.0.2.2:6001';
// export const SOCKET_URL = 'http://localhost:6001';  //Acesso do servidor local no celular
export const SOCKET_URL = WSOCKET_URL; //Laravel Homestead
// export const SOCKET_URL = 'http://192.168.10.10:6001'; //Laravel Homestead
export const SOCKET_TIMEOUT = 20000;
export const REDIS_URL = WREDIS_URL;
export const REDIS_DATABASE = WREDIS_DATABASE;

export const BANNERURL = WBASE_URL + API_VERSION + BANNER
/**
 * Provider Basic Interaction
 */
export const LOGIN_URL = HOST_PROVIDER_URL + "/login";
export const REGISTER_URL = HOST_PROVIDER_URL + "/register";
export const LOGOUT_URL = HOST_PROVIDER_URL + "/logout";
export const DELETE_ACCOUNT = HOST_PROVIDER_URL + "/delete_account";
export const FORGOT_PASSWORD_URL = API_VERSION_URL + "/application/forgot_password";

/**
 * Provider Basic Interaction
 */
export const PAYMENT = BASE_URL + HOST_PROVIDER_URL + "/get_provider_payments";
export const SET_PROVIDER_PAYMENT = BASE_URL + HOST_PROVIDER_URL + "/set_provider_payments";
export const ENABLED_LANGUAGES = BASE_URL + HOST_PROVIDER_URL + "/get_enabled_languages";
export const ENABLED_PROVIDER_LANGUAGES = BASE_URL + HOST_PROVIDER_URL + "/get_provider_languages"
export const SET_ENABLED_PROVIDER_LANGUAGES = BASE_URL + HOST_PROVIDER_URL + "/set_provider_languages"
export const REGISTER_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/save_basic";
export const REGISTER_ADDRESS = HOST_PROVIDER_URL + "/wizard/save_address";
export const REGISTER_SERVICES_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/save_service";
export const REGISTER_VEHICLE_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/save_vehicle";
export const REGISTER_BANK_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/save_bank";
export const GET_BANK_PROVIDER_URL = HOST_PROVIDER_URL + "/get_bank";
export const REGISTER_GET_DOCS_URL = HOST_PROVIDER_URL + "/wizard/docs_by_types";
export const SAVE_STEP_AFTER_UPLOAD_DOCS_URL = HOST_PROVIDER_URL + "/wizar/saveStepAfterUploadDocs";
export const REGISTER_DOCS_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/save_document";

export const UPDATE_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/save_basic";
export const UPDATE_SERVICES_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/save_service";
export const UPDATE_BANK_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/save_bank";
export const UPDATE_DOCS_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/save_document";

export const CHANGE_PASSWORD_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/change_password";
export const CHANGE_PHOTO_PROVIDER_URL = HOST_PROVIDER_URL + "/wizard/save_selfie";
export const UPDATE_PROVIDER_STATE = HOST_PROVIDER_URL + "/toggle_state";

export const GET_PROVIDER_ACTIVE = HOST_PROVIDER_URL + "/check_state";
export const GET_PROVIDER_PROFILE = HOST_PROVIDER_URL + "/profile";
export const GET_DOCS = HOST_PROVIDER_URL + "/getdocs";

export const REGISTER_ADITIONAL_INFO_DOCUMENTS = HOST_PROVIDER_URL_3_1 + "/wizard/save/aditional_document";

export const UPDATE_WAITING_RIDE = HOST_PROVIDER_URL + "/update_waiting_ride_field";

export const FINANCE_GET_BALANCE = BASE_URL + "/libs/finance/get_balance";

export const GET_PRICE = HOST_PROVIDER_URL + "/price";
export const SAVE_PRICE = HOST_PROVIDER_URL + "/save_price";


/**
 * BankLib
 */
export const BANKLIB_URL = BASE_URL + '/api/banks';

/**
 * CEP
 */
export const CEP_PROVIDER_INFO = HOST_PROVIDER_URL + "/cep";
export const CEP_INFORMATION = API_VERSION + "/application/zip_code"

/**
 * Sapmplet Referrals
 */
 export const SAMPLE_REFERRALS = API_VERSION + "/provider/sample_referrals";

/**
 * User's Information
 */
export const UPDATE_USER_URL = HOST_URL + "/update";
export const UPDATE_USER_PASSWORD_URL = HOST_URL + "/update_password";
export const CHECKING_ACCOUNT = HOST_URL + "/financial/summary/";
export const PROVIDER_PROFILE = HOST_URL + "/profile_provider";
export const GET_USER_PROFILE = HOST_URL + "/getuserprofile";

/**
 * Provider's Information
 */
export const PROVIDER_CHECKING_ACCOUNT = HOST_PROVIDER_URL + "/financial/summary/";
export const PROVIDER_GET_REPORT_YEAR = HOST_PROVIDER_URL + '/profits'
export const UPDATE_PROVIDER_PASSWORD_URL =
  HOST_PROVIDER_URL + "/update-password";
export const SEND_SMS_TO_CONTACTS = API_VERSION + "/ledger/emergency_sms";
export const CHECK_CLEANING_FEE = HOST_PROVIDER_URL + "/cleaning_fee/check";
export const CONFIG_RATING = BASE_URL + API_VERSION + "/provider/config/saveRating";

/**
 * SCHEDULED AND IN PROGRESS REQUESTS
 */
export const GET_SCHUDELED_REQUESTS_URL =
  HOST_PROVIDER_URL + "/getscheduledrequest";
export const GET_REQUEST_IN_PROGRESS_PROVIDER =
  HOST_PROVIDER_URL + "/request/in_progress";
export const GET_SPECIFIC_REQUEST_PROVIDER = HOST_PROVIDER_URL + "/request_details";
export const CANCEL_REQUEST_BY_PROVIDER = HOST_PROVIDER_URL + "/request/cancel_by_provider";
export const CANCEL_FUTURE_REQUEST_URL =
  HOST_PROVIDER_URL + "/deletefuturerequest";
export const CONFIRM_SCHEDULED_REQUEST =
  HOST_PROVIDER_URL + "/confirm_schedule";
export const CANCEL_SCHEDULED_REQUEST =
  HOST_PROVIDER_URL + "/cancel_schedule";
export const GET_MY_REQUESTS = HOST_PROVIDER_URL + "/my_history";
export const GET_MY_SCHEDULES = HOST_PROVIDER_URL + "/my_schedules";
export const SEND_HELP = HOST_PROVIDER_URL + "/request/help"
export const SEND_FEE_CLEANING = HOST_PROVIDER_URL + '/cleaning_fee/charge'
export const GET_DISTANCE_TIME_ARRIVE = API_VERSION_URL + "/request/estimate_distance_and_time";


/**
 * RATING
 */
export const GET_RATING_REQUEST_URL = HOST_URL + "/ratingProvider";
export const SET_RATING_REQUEST_URL = HOST_PROVIDER_URL + "/rating";

/**
 * INVOICE
 */
export const INVOICE_REQUEST_URL = HOST_URL + "/invoice";

/**
 * LOCAL STORAGE INFORMATION
 */
export const GET_PROVIDERS_LIST_URL = HOST_URL + "/provider_list";
export const GET_PROVIDERS_LIST_URL_ARRAY = HOST_URL + "/provider_list_array";
export const GET_REVIEWS_FROM_PROVIDER = HOST_URL + "/review_provider";

/**
 * Users Requests History
 */
export const USER_HISTORY = HOST_URL + "/history";
export const PROVIDER_HISTORY = HOST_PROVIDER_URL + "/history";

/**
 * Google Maps URL Requests
 */
export const GET_ADDRESS_FROM_PLACE_ID = API_VERSION_URL + "/geolocation/geocode";
export const GET_PROVIDER_ADDRESS_FROM_LAT_LNG =
  HOST_PROVIDER_URL + "/getAddressFromLatLong";
export const GET_PROVIDER_LAT_LNG_FROM_ADDRESS =
  HOST_PROVIDER_URL + "/getLatLngFromAddress";
export const GET_PROVIDER_FRAGMENTED_ADDRESS =
  HOST_PROVIDER_URL + "/getFragmentedAddress";
export const GET_PLACES_AUTOCOMPLETE = API_VERSION + "/provider/get_address_string";
/**
 * Provider Addresses
 */
export const GET_ALL_PROVIDER_ADDRESS =
  HOST_PROVIDER_URL + "/getprovideraddress";
export const SET_ACTIVE_PROVIDER_ADDRESS =
  HOST_PROVIDER_URL + "/setactiveprovideraddress";
export const CREATE_PROVIDER_ADDRESS =
  HOST_PROVIDER_URL + "/createprovideraddress";
export const EDIT_PROVIDER_ADDRESS = HOST_PROVIDER_URL + "/editprovideraddress";
export const DELETE_PROVIDER_ADDRESS =
  HOST_PROVIDER_URL + "/deleteprovideraddress";
export const UPDATE_CURRENT_PROVIDER_LOCATION = HOST_PROVIDER_URL + "/location";
export const DESTINATION = "/provider/active_destination";

/**
 * SplashScreen urls json
 */
export const GET_VEHICLE_TYPES = API_VERSION_URL + "/application/types";
export const APPLICATION_PAGES = API_VERSION_URL + "/application/pages";
export const GET_SETTINGS = API_VERSION_URL + "/application/settings";

/**
 * TERMS of USE
 */
export const TERMS_URL = API_VERSION_URL + "/application/page/";

/**
 * Ping Audio
 */
export const PING_AUDIO = API_VERSION_URL + "/application/ping/audio";

/**
 * Financial help
*/
export const FINANCIAL_HELP = API_VERSION_URL + '/application/page/provider-financial-help'

/**
 *  INDICATIONS
 */
export const INDICATIONS_URL = HOST_PROVIDER_URL + "/referral";
export const INDICATION_URL = API_VERSION_URL + '/indication';
export const UPDATE_REFERRAL_CODE = INDICATION_URL + '/update_provider_referral_code';
export const CREATE_LEDGER_PARENT = INDICATION_URL + '/create_ledger_parent';
export const INDICATION_QRCODE = INDICATION_URL + '/indication/qrcode';
export const INDICATION_FLYER_URL = INDICATION_URL + '/qrcode';

export const APIS_GO_MOBI = { ...APIS.GO_MOBI };

/**
 * Requests
 */
export const CREATE_REQUEST_URL = HOST_URL + "/createrequest";
export const CANCEL_REQUEST_URL = HOST_URL + "/cancelrequest";
export const RESPOND_REQUEST = HOST_PROVIDER_URL + "/request/respond";
export const REQUEST_RECEIVED = HOST_PROVIDER_URL + HOST_REQUEST_URL + "/received";
export const GET_REQUEST_TO_ACCEPT = HOST_PROVIDER_URL + "/getrequesttoaccept";
export const CREATE_KNOB_REQUEST = HOST_PROVIDER_URL + "/create_knob_request";
export const HANDLE_REQUEST_POINTS = HOST_PROVIDER_URL + HOST_REQUEST_URL + "/handle_request_points";

/**
 * REQUEST CHANGE STATUS
 */
export const REQUEST_PROVIDER_STARTED =
  HOST_PROVIDER_URL + "/request/started_provider";
export const REQUEST_PROVIDER_ARRIVED =
  HOST_PROVIDER_URL + "/request/arrived";
export const REQUEST_STARTED = HOST_PROVIDER_URL + "/request/started_request";
export const REQUEST_COMPLETED = HOST_PROVIDER_URL_3_1 + "/request/finish";
export const ROUTE_COMPLETED = HOST_PROVIDER_URL_3_1 + "/request/complete_route";
export const UPDATE_PROVIDER_LOCATION = HOST_PROVIDER_URL + "/request/location";
export const PENDING_REQUEST_LOCATIONS = HOST_PROVIDER_URL + "/request/pending_locations";
export const UPDATE_PROVIDER_LOCATION_ARRAY =
  HOST_PROVIDER_URL + "/postpendinglocationsarray";

/**
 * Estimative
 */
export const GET_ESTIMATIVE_URL = HOST_PROVIDER_URL + "/get_estimate_and_polyline";

/**
 * Sms
 */
export const SEND_SMS_URL = WBASE_URL + '/api/v1/sms/request'
export const LOGIN_CELLPHONE = WBASE_URL + '/api/v1/sms/login'

/**
 * LOCAL STORAGE INFORMATION
 */
export const PROVIDER_STORAGE = "/Provider/0";
export const REQUEST_MODEL_STORAGE = "/Request/0";

/**
 * FACEBOOK GET USER URL
 */
export const FACEBOOK_GET_USER_URL =
  "https://graph.facebook.com/v2.5/me?fields=id,email,name,link,first_name,last_name,picture.type(large)&access_token=";

/**
 * API Keys
 */
export const GOOGLE_MAPS_KEY = WGOOGLE_MAPS_KEY;

/**
 * PAYMENTS
 */
export const GET_USER_CARDS_URL = HOST_URL + "/cards";
export const DELETE_USER_CARD_URL = HOST_URL + "/deletecardtoken";
export const ADD_USER_CARD_URL = HOST_URL + "/addcardtoken";
export const SET_DEFAULT_USER_CARD_URL = HOST_URL + "/card_selection";
export const GET_USER_PAYMENTS_SETTINGS_URL = "/application/paymentsettings";
export const REMOVE_CARD_URL = HOST_PROVIDER_URL + "/delete_payment_card";

/**
 * Service Finished
 */
export const POSITIONZERO = 0;
export const POSITIONONE = 1;
export const POSITIONTWO = 2;
export const POSITIONTHREE = 3;
export const POSITIONFOUR = 4;
export const POSITIOFIVE = 5;

/**
 * Requests Status
 */
export const NO_REQUEST = -1;
export const IS_REQUEST_CREATED = 1;
export const PROVIDER_ACCEPTED_JOB = 2;
export const IS_PROVIDER_STARTED = 3;
export const IS_PROVIDER_ARRIVED = 4;
export const IS_REQUEST_STARTED = 5;
export const IS_REQUEST_COMPLETED = 6;
// export const IS_PROVIDER_RATED = 7;
export const IS_PROVIDER_REFUSED = 8;
export const IS_REQUEST_CANCELED = 9;


/**
 * Reducers tests
 */
export const SETTINGS_UPDATED = 'SETTINGS_UPDATED'
export const PROVIDER_PROFILE_UPDATED = 'PROVIDER_PROFILE_UPDATED'

/**
 * animated views
 */
export const OFFSET = 0

//Const chat
export const GET_CONVERSATION = HOST_PROVIDER_URL + "/chat/conversation";
export const GET_MESSAGE_CHAT = HOST_PROVIDER_URL + "/chat/messages";
export const SEND_MESSAGES = HOST_PROVIDER_URL + "/chat/send";
export const SEE_MESSAGE = HOST_PROVIDER_URL + "/chat/seen"

export const GET_VERSION_NOTES = BASE_URL + '/version?type=provider&version_name=';

/**
 * Help chat api's
 */
export const SEND_HELP_MESSAGE = BASE_URL + '/api/v3/set_help_message';
export const GET_HELP_MESSAGES = BASE_URL + '/api/v3/get_help_message';

/**
 * Subscription plans
 */
export const GET_PLANS = LIB_PROVIDER_URL + '/plans';
export const NEW_SUBSCRIPTION = LIB_PROVIDER_URL + '/update_plan';
export const DETAILS_SUBSCRIPTION = LIB_PROVIDER_URL + '/subscription_details';
export const CANCEL_SUBSCRIPTION = LIB_PROVIDER_URL + '/cancel_subscription';
export const ADD_CARD = LIB_PROVIDER_URL + "/add_card";
export const LIST_CARD = '/api/v3/list_provider_cards';

/**
 * Geolocation LIB routes
*/
export const GET_ADDRESS_FROM_LAT_LNG = "/provider/geolocation/get_address_by_geocode";
export const GET_LAT_LNG_FROM_ADDRESS = "/provider/geolocation/get_geocode_by_address";
export const GET_ROUTE = "/provider/geolocation/get_polyline";
export const GET_DISTANCE_TIME = "/provider/geolocation/get_distance_time";

export const GET_PLACE_DETAILS = "/provider/get_place_details";

/**
 * PanicLib routes
 */

export const PANIC_BUTTON_URL = WBASE_URL + "/lib/panic/save"
export const APP_THEME_ENABLED = whitelabel_app_theme_enabled;

/**
 * Automatic surge
 */
export const SURGE_HEATMAP_URL = WBASE_URL + "/surgeprice/heatmap";

/**
* check version
*/
export const CHECK_VERSION_URL = WBASE_URL + "/api/lib/checkversion";

export const TYPE_PROVIDER = 'provider';
export const TYPE_USER = 'user';
