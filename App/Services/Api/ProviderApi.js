import * as constants from '../../Util/Constants';
import i18n, {strings} from '../../Locales/i18n';
import axios from 'axios';

export default class ProviderApi {
	static api;
	// static apiFormData;

	constructor() {
		this.api = axios;
    this.api.defaults.httpsAgent = { rejectUnauthorized: false };
		this.api.defaults.baseURL = constants.BASE_URL;
		this.api.defaults.headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			locale: i18n.locale,
		};
	}

	/**
	 * That route allow to get informations about
	 * user logged in
	 * @param {String} provider_id
	 * @param {String} token
	 */
	GetProviderProfile(provider_id, token) {
		return this.api.get(constants.GET_PROVIDER_PROFILE, {
			params: {provider_id: provider_id, token: token},
		});
	}

	GetProviderActive(
		provider,
		token,
		version_code = '',
		version_os = '',
		device_token = ''
	) {
		return this.api.get(constants.GET_PROVIDER_ACTIVE, {
			params: {
				id: provider,
				token: token,
				version_code,
				version_os,
				device_token,
			},
		});
	}

	/**
	 * Search cep and get the information
	 * @param {string} zipCode
	 */
	CepInformation(zipCode) {
		return this.api.post(constants.CEP_INFORMATION, {zipcode: zipCode});
	}

	/**
	 * get Sample Referrals
	 */
	SampleReferrals() {
		return this.api.get(constants.SAMPLE_REFERRALS);
	}

	/**
	 * Second step - register provider
	 * @param {provider} String
	 * @param {origin} String
	 * @param {provider_type} Array
	 */
	RegisterServices(provider, origin, provider_type, latitude, longitude) {
		return this.api.post(constants.REGISTER_SERVICES_PROVIDER_URL, {
			provider_id: provider,
			origin: origin,
			provider_type: provider_type,
			latitude,
			longitude,
		});
	}

	/**
	 * Second step - register provider
	 * @param {provider} String
	 * @param {certificate} Array
	 * @param {origin} String
	 * @param {provider_type} Array
	 */
	UpdateServices(provider, token, certificate, provider_type) {
		return this.api.post(constants.UPDATE_SERVICES_PROVIDER_URL, {
			id: provider,
			token: token,
			certificate: certificate,
			provider_type: provider_type,
		});
	}
	/**
	 *
	 * @param {String} token
	 * @param {Integer} provider_id
	 * @param {Integer} request_id
	 */
	received(token, provider_id, request_id, channel) {
		let params = new FormData();
		params.append('token', token);
		params.append('provider_id', provider_id);
		params.append('request_id', request_id);
		params.append('channel', channel);

		return this.api.post(constants.REQUEST_RECEIVED, {
			token: token,
			provider_id: provider_id,
			request_id: request_id,
			channel: channel,
		});
	}

  /**
	 * Second step - update provider's banks info
	 * @param {provider} String
	 * @param {certificate} Array
	 * @param {origin} String
	 * @param {provider_type} Array
	 */
	UpdateBankAccount(
		provider,
		token,
		account,
		account_digit,
		agency,
		agency_digit,
		holder,
		person_type,
		document,
		bank,
		account_type,
		birthday_date
	) {
		return this.api.post(constants.UPDATE_BANK_PROVIDER_URL, {
			id: provider,
			token: token,
			account: account,
			account_digit: account_digit,
			agency: agency,
			agency_digit: agency_digit,
			holder: holder,
			person_type: person_type,
			document: document,
			bank: bank,
			account_type: account_type,
			birthday_date: birthday_date,
		});
	}

	/**
	 * Second step - register provider
	 * @param {provider_type} Array
	 */
	RegisterGetDocs(provider_id) {
		return this.api.get(constants.REGISTER_GET_DOCS_URL, {
			params: {
				provider_id: provider_id,
			},
		});
	}

	/**
	 * Save Step After Upload all Docs, and save that the user was uploaded all docs
	 * @param {number} provider_id
	 */
	saveStepAfterUploadDocs(provider_id) {
		return this.api.post(constants.SAVE_STEP_AFTER_UPLOAD_DOCS_URL, {
			id: provider_id,
		});
	}

	/**
	 * Do Login Api Request
	 * @param {string} email
	 * @param {string} password
	 * @param {android} device_type
	 * @param {string} device_token
	 * @param {manual | google | facebook} login_by
	 */
	DoLogin(
		email,
		password,
		device_type,
		device_token,
		login_by,
		version_code = '',
		version_os = ''
	) {

		return this.api.post(constants.LOGIN_URL, {
			email: email,
			password: password,
			device_type: device_type,
			device_token: device_token,
			login_by: login_by,
			version_code,
			version_os,
		});
	}

	/**
	 * Do Social Login Api Request
	 * @param {string} social_unique_id
	 * @param {string} email
	 * @param {android} device_type
	 * @param {string} device_token
	 * @param {manual | google | facebook} login_by
	 */
	DoSocialLogin(
		social_unique_id,
		email,
		device_type,
		device_token,
		login_by,
		version_code = '',
		version_os = ''
	) {
		return this.api.post(constants.LOGIN_URL, {
			social_unique_id: social_unique_id,
			email: email,
			device_type: device_type,
			device_token: device_token,
			login_by: login_by,
			version_code,
			version_os,
		});
	}

	/**
	 * Logout Provider
	 * @param {number} id
	 * @param {string} token
	 */
	LogoutProvider(id, token) {
		return this.api.post(constants.LOGOUT_URL, {
			id: id,
			provider_id: id,
			token: token,
		});
	}

	/**
	 * Do Recover Password Api Request
	 * @param {user 0 | provider 1} type
	 * @param {string} email
	 */
	RecoverPassword(type, email) {
		return this.api.post(constants.FORGOT_PASSWORD_URL, {
			type: type,
			email: email,
		});
	}

	/**
	 *
	 * @param {object} param
	 * @param {number} param.id
	 * @param {string} param.token
	 * @param {'Top'|'Down'} param.position
	 */
	GetBanner({id, token, position}) {
		return this.api.get(constants.BANNER, {
			params: {
				id,
				token,
				position,
			},
		});
	}

	/**
	 * Send observation help about a request
	 * @param {Number} id
	 * @param {String} token
	 * @param {Number} request_id
	 * @param {String} note
	 */
	SendHelp(id, token, request_id, note) {
		return this.api.post(constants.SEND_HELP, {
			id: id,
			token: token,
			request_id: request_id,
			note: note,
		});
	}

	/**
	 * Get Terms of Use Api Request
	 * @param {string} title
	 * @param {string} content
	 */
	GetTerms(id) {
		return this.api.get(constants.TERMS_URL + id);
	}

	/**
	 * Get financial help
	 */
	GetFinancialHelp() {
		return this.api.get(constants.FINANCIAL_HELP);
	}

	/**
	 * Get User Referral Code Information
	 * @param {number} id
	 * @param {string} token
	 */
	GetIndication(id, token) {
		return this.api.get(constants.INDICATIONS_URL, {
			params: {provider_id: id, token: token},
		});
	}

	/**
	 * Get the user's history
	 * @param {number} id
	 * @param {string} token
	 * @param {string} from_date
	 * @param {string} to_date
	 */
	ProviderHistory(id, token, from_date, to_date) {
		if (from_date == null && to_date == null) {
			return this.api.get(constants.PROVIDER_HISTORY, {
				params: {id: id, token: token, from_date: '', to_date: ''},
			});
		} else {
			return this.api.get(constants.PROVIDER_HISTORY, {
				params: {
					id: id,
					token: token,
					from_date: from_date,
					to_date: to_date,
				},
			});
		}
	}

	/**
	 * Do Account Summary Api Request
	 * @param {integer} id
	 * @param {string} token
	 * @param {date} dateInitial
	 * @param {date} dateFinal*
	 */
	AccountSummary(id, token, url, start_date, end_date) {
		this.api.get(url, {
			params: {
				provider_id: id,
				token: token,
				holder_type: 'provider',
				start_date: start_date,
				end_date: end_date,
			},
		});
	}

	/**
	 * Do Cheking Acount Api Request
	 * @param {integer} id
	 * @param {string} token
	 * @param {date} dateInitial
	 * @param {date} dateFinal
	 */
	CheckingAccountProvider(id, token, dateInitial, dateFinal) {
		return this.api.post(constants.PROVIDER_CHECKING_ACCOUNT, {
			id: id,
			token: token,
			dateInitial: dateInitial,
			dateFinal: dateFinal,
		});
	}

	/**
	 * Do Cheking Acount Api Request
	 * @param {integer} id
	 * @param {string} token
	 * @param {date} dateInitial
	 * @param {date} dateFinal
	 */
	CheckingAccount(id, token, dateInitial, dateFinal) {
		return this.api.get(constants.PROVIDER_CHECKING_ACCOUNT + id, {
			params: {
				provider_id: id,
				token: token,
				holder_type: 'provider',
				start_date: dateInitial,
				end_date: dateFinal,
			},
		});
	}

	GetReport(provider_id, token, year) {
		return this.api.get(constants.PROVIDER_GET_REPORT_YEAR, {
			params: {provider_id: provider_id, token: token, year: year},
		});
	}

	/**
	 * Get request in progress id
	 * @param {number} id
	 * @param {string} token
	 */
	GetRequestInProgressId(id, token) {
		return this.api.get(constants.GET_REQUEST_IN_PROGRESS_PROVIDER, {
			params: {id: id, token: token},
		});
	}

	/**
	 * POST request to get Route information
	 * @param {number} id
	 * @param {string} token
	 */
	DrawPath(id, token, latitude, longitude, dest_lat, dest_long) {
		return this.api.get(constants.GET_ROUTE, {
			params: {
				id: id,
				token: token,
				latitude: latitude,
				longitude: longitude,
				dest_latitude: dest_lat,
				dest_longitude: dest_long,
			},
		});
	}

	/**
	 * Get a specific provider request
	 * @param {number} id
	 * @param {string} token
	 * @param {number} request_id
	 */
	GetProviderRequest(id, token, request_id) {
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		setTimeout(() => {
			source.cancel('###Operation canceled by the user.');
		}, constants.REQUEST_DETAILS_UPDATE_TIME);

		return this.api.get(
			`${constants.GET_SPECIFIC_REQUEST_PROVIDER}?id=${id}&token=${token}&request_id=${request_id}`,
			{
				cancelToken: source.token,
			}
		);
	}

	/**
	 * Cancel request by provider
	 * @param {number} id
	 * @param {string} token
	 * @param {number} request_id
	 * @param {string} reason_cancelation
	 */
	CancelRequestByProvider(id, token, request_id, reason_cancelation) {
		return this.api.post(constants.CANCEL_REQUEST_BY_PROVIDER, {
			id: id,
			token: token,
			request_id: request_id,
			reason_cancelation: reason_cancelation,
		});
	}

	/**
	 * Provider responds to a request service
	 * @param {id} Number
	 * @param {token} String
	 * @param {latitude} Number
	 * @param {longitude} Number
	 */
  ConfirmService(provider, token, request_id, accepted) {
		return this.api.post(constants.RESPOND_REQUEST, {
			id: provider,
			token: token,
			request_id: request_id,
			accepted: accepted,
		});
  }

	/**
	 * Provider responds to a request service
	 * @param {id} Number
	 * @param {token} String
	 * @param {latitude} Number
	 * @param {longitude} Number
	 */
	RejectService(provider, token, request_id, accepted) {
		return this.api.post(constants.RESPOND_REQUEST, {
			id: provider,
			token: token,
			request_id: request_id,
			accepted: accepted,
		});
	}

	/**
	 * Update provider's State
	 * @param {id} Number
	 * @param {token} String
	 * @param {latitude} Number
	 * @param {longitude} Number
	 */
	UpdateState(provider, token, latitude, longitude) {
		return this.api.post(constants.UPDATE_PROVIDER_STATE, {
			id: provider,
			token: token,
			latitude: latitude,
			longitude: longitude,
		});
	}

	/**
	 * Set provider's State
	 * @param {id} Number
	 * @param {token} String
	 * @param {latitude} Number
	 * @param {longitude} Number
	 * @param {is_active} Boolean
	 */
	SetState(provider, token, latitude, longitude, is_active) {
		return this.api.post(constants.UPDATE_PROVIDER_STATE, {
			id: provider,
			token: token,
			latitude: latitude,
			longitude: longitude,
			is_active: is_active,
		});
	}

	/**
	 * Get all the provider address
	 * @param {number} id
	 * @param {string} token
	 */
	GetAllProviderAddress(id, token) {
		return this.api.get(constants.GET_ALL_PROVIDER_ADDRESS, {
			params: {id: id, token: token},
		});
	}

	/**
	 * Create provider address
	 * @param {Number} id
	 * @param {String} token
	 * @param {Number} zip_code
	 * @param {String} street
	 * @param {String} city
	 * @param {String} district
	 * @param {String} state
	 * @param {String} country
	 * @param {Number} number
	 * @param {Number} latitude
	 * @param {Number} longitude
	 * @param {String} location_name
	 * @param {String} complement
	 */
	CreateProviderAddress(
		id,
		token,
		zip_code,
		street,
		city,
		district,
		state,
		country,
		number,
		latitude,
		longitude,
		location_name,
		complement = null
	) {
		return this.api.post(constants.CREATE_PROVIDER_ADDRESS, {
			id: id,
			token: token,
			zip_code: zip_code,
			street: street,
			city: city,
			district: district,
			state: state,
			country: country,
			number: number,
			latitude: latitude,
			longitude: longitude,
			location_name: location_name,
			complement: complement,
		});
	}

	/**
	 * Create provider address
	 * @param {Number} id
	 * @param {String} token
	 * @param {Number} address_id
	 * @param {Number} zip_code
	 * @param {String} street
	 * @param {String} city
	 * @param {String} district
	 * @param {String} state
	 * @param {String} country
	 * @param {Number} number
	 * @param {Number} latitude
	 * @param {Number} longitude
	 * @param {String} location_name
	 * @param {String} complement
	 */
	EditProviderAddress(
		id,
		token,
		address_id,
		zip_code = null,
		street = null,
		city = null,
		district = null,
		state = null,
		country = null,
		number = null,
		latitude = null,
		longitude = null,
		location_name = null,
		complement = null
	) {
		return this.api.post(constants.EDIT_PROVIDER_ADDRESS, {
			id: id,
			token: token,
			address_id: address_id,
			zip_code: zip_code,
			street: street,
			city: city,
			district: district,
			state: state,
			country: country,
			number: number,
			latitude: latitude,
			longitude: longitude,
			location_name: location_name,
			complement: complement,
		});
	}

	/**
	 * Set a active provider address
	 * @param {number} id
	 * @param {string} token
	 * @param {number} address_id
	 */
	SetActiveProviderAddress(id, token, address_id = null) {
		return this.api.post(constants.SET_ACTIVE_PROVIDER_ADDRESS, {
			id: id,
			token: token,
			address_id: address_id,
		});
	}

	/**
	 * Set a active provider address
	 * @param {number} id
	 * @param {string} token
	 * @param {number} address_id
	 */
	DeleteProviderAddress(id, token, address_id) {
		return this.api.post(constants.DELETE_PROVIDER_ADDRESS, {
			id: id,
			token: token,
			address_id: address_id,
		});
	}

	/**
	 * Get the information from a address by Google Place ID
	 * @param {number} id
	 * @param {string} token
	 * @param {string} place_id
	 * @param {string} address
	 * @param {string} clicker
	 */
	GetAddressFromPlaceId(id, token, place_id, address, clicker) {
		return this.api.get(constants.GET_PLACE_DETAILS, {
			params: {id: id, token: token, place_id, address, clicker},
		});
	}

	/**
	 * @api {POST} /api/v3/ledger/emergency_sms
	 * @description Envia sms para os contatos de emergência
	 * @param {integer} id
	 * @param {string} token
	 * @param {integer} request_id
	 */
	SendSmsToContacts(id, token, request_id) {
		return this.api.get(constants.SEND_SMS_TO_CONTACTS, {
			params: {
				id: id,
				token: token,
				request_id: request_id,
			},
		});
	}

	/**
	 * Get the Reverse Geolocation from a Latitude and Longitude
	 * @param {number} id
	 * @param {string} token
	 * @param {string} address
	 */
	GetLatLngFromAddress(id, token, address) {
		return this.api.post(constants.GET_PROVIDER_LAT_LNG_FROM_ADDRESS, {
			id: id,
			token: token,
			address: address,
		});
	}

	/**
	 * Get the fragmented address from a full address
	 * @param {number} id
	 * @param {string} token
	 * @param {string} latitude
	 * @param {string} longitude
	 */
	GetFragmentedAddress(id, token, latitude, longitude) {
		return this.api.post(constants.GET_PROVIDER_FRAGMENTED_ADDRESS, {
			id: id,
			token: token,
			latitude: latitude,
			longitude: longitude,
		});
	}

	/**
	 * Update provider's State
	 * @param {id} Number
	 * @param {token} String
	 * @param {request_id} Number
	 */
	GetRequest(provider, token, request_id) {
		return this.api.post(constants.GET_REQUEST, {
			id: provider,
			token: token,
			request_id: request_id,
		});
	}

	/**
	 * Get request provider will accept
	 * @param {id} Number
	 * @param {token} String
	 * @param {request_id} Number
	 */
	GetRequestToAccept(provider, token, request_id) {
		return this.api.get(constants.GET_REQUEST_TO_ACCEPT, {
			params: {id: provider, token: token, request_id: request_id},
		});
	}

	/**
	 * Rating the request by Provider
	 * @param {id} Number
	 * @param {token} String
	 * @param {request_id} Number
	 * @param {rating} Number
	 * @param {comment} String
	 */
	RatingRequest(provider, token, request_id, rating, comment) {
		return this.api.post(constants.SET_RATING_REQUEST_URL, {
			id: provider,
			token: token,
			rating: rating,
			request_id: request_id,
			comment: comment,
		});
	}

	/**
	 * Get scheduled requests
	 * @param {number} id
	 * @param {string} token
	 */
	GetScheduledRequests(id, token) {
		return this.api.post(constants.GET_SCHUDELED_REQUESTS_URL, {
			id: id,
			token: token,
		});
	}

	/**
	 * Cancel Future Request
	 * @param {Number} id
	 * @param {String} token
	 * @param {Number} request_id
	 */
	CancelFutureRequest(id, token, request_id) {
		return this.api.post(constants.CANCEL_FUTURE_REQUEST_URL, {
			id: id,
			token: token,
			request_id: request_id,
		});
	}

	/**
	 * Request Status: Provider started
	 * @param {int} provider
	 * @param {string} token
	 * @param {int} request_id
	 * @param {double} latitude
	 * @param {double} longitude
	 */
	ProviderStarted(id, token, request_id, latitude, longitude) {
		return this.api.post(constants.REQUEST_PROVIDER_STARTED, {
			id: id,
			token: token,
			request_id: request_id,
			latitude: latitude,
			longitude: longitude,
		});
	}

	/**
	 * Request Status: Provider Arrived
	 * @param {int} id
	 * @param {string} token
	 * @param {int} request_id
	 * @param {double} latitude
	 * @param {double} longitude
	 */
	ProviderArrived(id, token, request_id, latitude, longitude) {
		return this.api.post(constants.REQUEST_PROVIDER_ARRIVED, {
			id: id,
			token: token,
			request_id: request_id,
			latitude: latitude,
			longitude: longitude,
		});
	}

	/**
	 * Request Status: Request Started
	 * @param {int} id
	 * @param {string} token
	 * @param {int} request_id
	 * @param {double} latitude
	 * @param {double} longitude
	 */
	RequestStarted(id, token, request_id, latitude, longitude) {
		return this.api.post(constants.REQUEST_STARTED, {
			id: id,
			token: token,
			request_id: request_id,
			latitude: latitude,
			longitude: longitude,
		});
	}

	/**
	 * Request Status: Request Finalizada
	 * @param {int} id
	 * @param {string} token
	 * @param {int} request_id
	 * @param {double} latitude
	 * @param {double} longitude
	 */
	RequestCompleted(id, token, request_id, latitude, longitude) {
		return this.api.post(constants.REQUEST_COMPLETED, {
			id: id,
			token: token,
			request_id: request_id,
			latitude: latitude,
			longitude: longitude,
		});
	}

	/**
	 * Request Status: Rota completada
	 * @param {int} id
	 * @param {string} token
	 * @param {int} request_id
	 * @param {double} latitude
	 * @param {double} longitude
	 */
	CompletedRoute(
		id,
		token,
		request_id,
		latitude,
		longitude,
		pending_locations,
    is_rated
	) {
		return axios.post(constants.BASE_URL + constants.ROUTE_COMPLETED, {
			id: id,
			token: token,
			request_id: request_id,
			latitude: latitude,
			longitude: longitude,
			pending_locations,
      is_rated: is_rated,
		});
	}

	/**
	 * Update Provider's location during a request
	 * @param {int} id
	 * @param {string} token
	 * @param {int} request_id
	 * @param {double} latitude
	 * @param {double} longitude
	 */
	UpdateProviderLocation(id, token, request_id, latitude, longitude) {
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		setTimeout(() => {
			source.cancel('###Operation canceled by the user.');
		}, constants.REQUEST_DETAILS_UPDATE_TIME);

		return this.api.post(
			constants.UPDATE_PROVIDER_LOCATION,
			{
				id: id,
				token: token,
				request_id: request_id,
				latitude: latitude,
				longitude: longitude,
			},
			{
				cancelToken: source.token,
			}
		);
	}

	/**
	 * Update Provider's location during a request
	 * @param {int} id
	 * @param {string} token
	 * @param {int} request_id
	 * @param {array} array_location
	 */
	UpdateProviderLocationArray(id, token, request_id, array_location) {
		return this.api.post(constants.UPDATE_PROVIDER_LOCATION_ARRAY, {
			id: id,
			token: token,
			request_id: request_id,
			array_location: array_location,
		});
	}

	/**
	 * Confirm scheduled request by provider
	 * @param {id} Number
	 * @param {token} String
	 * @param {scheduled_requests_id} Number
	 */
	ConfirmScheduled(provider, token, scheduled_requests_id) {

		return this.api.post(constants.CONFIRM_SCHEDULED_REQUEST, {
			provider_id: provider,
			token: token,
			schedule_id: scheduled_requests_id,
		});
	}

	/**
	 * Reject scheduled request by provider
	 * @param {id} Number
	 * @param {token} String
	 * @param {scheduled_requests_id} Number
	 */
	CancelScheduled(provider, token, scheduled_requests_id, reason) {
		return this.api.post(constants.CANCEL_SCHEDULED_REQUEST, {
			provider_id: provider,
			token: token,
			schedule_id: scheduled_requests_id,
			cancelled_reason: reason,
		});
	}

	/**
	 * Update Provider's Password
	 * @param {number} id
	 * @param {string} token
	 * @param {string} new_password
	 * @param {string} old_password
	 */
	UpdatePassword(id, token, new_password, old_password) {
		return this.api.post(constants.UPDATE_PROVIDER_PASSWORD_URL, {
			id: id,
			token: token,
			new_password: new_password,
			old_password: old_password,
		});
	}

	/**
	 * Update current provider location
	 * @param {Number} id
	 * @param {String} token
	 * @param {Number} latitude
	 * @param {Number} longitude
	 * @param {*} bearing
	 */
	UpdateCurrentProviderLocation(
		id,
		token,
		latitude,
		longitude,
		bearing = null
	) {
		return this.api.post(constants.UPDATE_CURRENT_PROVIDER_LOCATION, {
			id: id,
			token: token,
			latitude: latitude,
			longitude: longitude,
			bearing: bearing,
		});
	}

	/**
	 * Get the Reverse Geolocation from a Latitude and Longitude
	 * @param {number} id
	 * @param {string} token
	 * @param {number} latitude
	 * @param {number} longitude
	 * @param {string} clicker
	 */
	GetAddressFromLatLng(id, token, latitude, longitude, clicker) {
		return this.api.post(constants.GET_ADDRESS_FROM_LAT_LNG, {
			id: id,
			token: token,
			latitude: latitude,
			longitude: longitude,
			clicker: clicker,
		});
	}

	/**
	 * Get All Payments settings
	 * @param {number} id
	 * @param {string} token
	 */
	GetUserPaymentsSettings(id) {
		return this.api.get(constants.GET_USER_PAYMENTS_SETTINGS_URL, {id: id});
	}

	/**
	 * Get the Vehicle Types from server
	 */
	GetVehicleTypesServer() {
		return this.api.get(constants.GET_VEHICLE_TYPES);
	}

	/**
	 * Get the Application Pages from server
	 */
	GetApplicationPagesServer() {
		return this.api.get(constants.APPLICATION_PAGES, {
			params: {user_type: 'provider'},
		});
	}

	/**
	 * Get the Settings from server
	 */
	GetSettingsServer() {
		return this.api.get(constants.GET_SETTINGS, {
			params: {user_type: 'provider'},
		});
	}

	/**
	 * Get User Referral Code Information
	 * @param {number} id
	 * @param {string} token
	 */
	GetDocs(id, token) {
		return this.api.get(constants.GET_DOCS, {
			params: {id: id, token: token},
		});
	}

	/*
	 * Get My Requests requests on 'Minhas solicitações'
	 * @param {number} id
	 * @param {string} token
	 */
	GetMyRequests(id, token, page) {
		return this.api.get(constants.GET_MY_REQUESTS, {
			params: {
				provider_id: id,
				token: token,
				page: page,
				type: 1,
			},
		});
	}

	/*
	 * Get My Requests requests on 'Minhas solicitações'
	 * @param {number} id
	 * @param {string} token
	 */
	GetMyScheduleRequests(id, token, page) {
		return this.api.get(constants.GET_MY_SCHEDULES, {
			params: {
				provider_id: id,
				token: token,
				type: 1,
				page: page,
			},
		});
	}

	/**
	 * Send cleaning fee request
	 * @param {Number} provider_id
	 * @param {String} token
	 * @param {Number} request_id
	 * @param {String} description
	 */
	SendCleaningFee(provider_id, token, request_id, user_id, description) {
		return this.api.post(constants.SEND_FEE_CLEANING, {
			id: provider_id,
			token: token,
			request_id: request_id,
			user_id: user_id,
			description: description,
		});
	}

	/**
	 * Get cleaning fee request
	 * @param {Number} providerId
	 * @param {String} token
	 * @param {Number} requestId
	 */
	CheckCleaningFee(providerId, token, requestId) {
		return this.api.get(constants.CHECK_CLEANING_FEE, {
			params: {
				id: providerId,
				token: token,
				request_id: requestId,
			},
		});
	}

	/*
			Get Mensagens provider user
		*/
	getConversation(provider_id, token, request_id) {
		return this.api.get(constants.GET_CONVERSATION, {
			params: {
				provider_id: provider_id,
				token: token,
				request_id: request_id,
			},
		});
	}
	getMessageChat(provider_id, token, conversation_id) {
		return this.api.get(constants.GET_MESSAGE_CHAT, {
			params: {
				provider_id: provider_id,
				token: token,
				conversation_id: conversation_id,
			},
		});
	}

	seeMessage(provider_id, token, message_id) {
		let formdata = new FormData();

		formdata.append('provider_id', provider_id);
		formdata.append('token', token);
		formdata.append('message_id', message_id);

		return this.api.post(constants.SEE_MESSAGE, formdata);
	}

	listMessages(provider_id, token) {
		return this.api.get(constants.GET_MESSAGES, {
			params: {provider_id: provider_id, token: token},
		});
	}

	/**
	 *
	 * @param {*} request_id
	 * @param {*} provider_id
	 * @param {*} token
	 * @param {*} message
	 * @param {*} receiver_id
	 * @param {*} type
	 */
	sendMessage(
		provider_id,
		token,
		request_id,
		message,
		receiver_id,
		type = 'text'
	) {
		return this.api.post(constants.SEND_MESSAGES, {
			provider_id: provider_id,
			token: token,
			request_id: request_id,
			message: message,
			receiver_id: receiver_id,
			type: type,
		});
	}
	payment(id, token) {
		return this.api.get(constants.PAYMENT, {
			params: {
				id: id,
				token: token,
			},
		});
	}
	setProviderPayment(id, token, payments) {
		return this.api.post(constants.SET_PROVIDER_PAYMENT, {
			id: id,
			token: token,
			provider_payment: payments,
		});
	}

  savePrice(provider_id, token, priceData, type) {
		return this.api.post(constants.SAVE_PRICE, {
			provider_id,
			token,
			type,
      priceData
		});
	}

	enabledLanguages(id, token) {
		return this.api.get(constants.ENABLED_LANGUAGES, {
			params: {
				id: id,
				token: token,
			},
		});
	}
	providerLanguagens(id, token) {
		return this.api.get(constants.ENABLED_PROVIDER_LANGUAGES, {
			params: {
				id: id,
				token: token,
			},
		});
	}
	/**
	 *
	 * @param {inter} id
	 * @param {String} token
	 * @param {Array} languages
	 */
	setproviderLanguagens(id, token, languages) {
		return this.api.post(constants.SET_ENABLED_PROVIDER_LANGUAGES, {
			id: id,
			token: token,
			provider_languages: languages,
		});
	}

	/**
	 * @api {GET} /api/v3/geolocation/get_address_string
	 * @description Completa o endereço digitado.
	 * @param {number} id
	 * @param {number} token
	 * @param {string} place
	 * @param {number} latitude
	 * @param {number} longitude
	 * @param {number} count_api_calls
	 * @param {string} os_version | optional
	 * @param {string} app_version | optional
	 *
	 */
	getPlacesAutoComplete(
		id,
		token,
		place,
		latitude,
		longitude,
		count_api_calls,
		os_version = null,
		app_version = null
	) {
		return this.api.get(constants.GET_PLACES_AUTOCOMPLETE, {
			params: {
				id,
				token,
				place,
				latitude,
				longitude,
				count_api_calls,
			},
		});
	}
	/**
	 *  {POST} /provider/active_destination
	 *  ativar destino
	 * @param {number} id
	 * @param {string} token
	 * @param {string} destination_address
	 * @param {string} on_destination
	 * @param {float} lat
	 * @param {float} lon
	 */
	postDestination(id, token, destination_address, on_destination, lat, lon) {
		return this.api.post(constants.DESTINATION, {
			id,
			token,
			destination_address,
			on_destination,
			lat,
			lon,
		});
	}

	/**
	 * Send messages for a help chat conversation
	 * @param {*} id
	 * @param {*} token
	 * @param {*} message
	 * @param {*} request_id
	 */
	sendMessageHelpChat(id, token, message, request_id) {
		return this.api.post(constants.SEND_HELP_MESSAGE, {
			id,
			token,
			message,
			request_id,
		});
	}

	/**
	 * Retrieve messages from help chat conversation
	 * @param {*} id
	 * @param {*} token
	 * @param {*} request_id
	 */
	getMessageHelpChat(id, token, request_id) {
		return this.api.get(constants.GET_HELP_MESSAGES, {
			params: {
				id,
				token,
				request_id,
			},
		});
	}

	/**
	 * Get available plans
	 * @param {number} id
	 * @param {string} token
	 */
	getAvailablePlans(id, token) {
		return this.api.get(constants.GET_PLANS, {
			params: {
				id,
				token,
			},
		});
	}

	/**
	 * Submit new plan subscription
	 * @param {number} id
	 * @param {string} token
	 * @param {string} charge_type
	 * @param {number} plan_id
	 * @param {number} payment_id
	 * @param {boolean} is_change
	 */
	newSubscriptionPlan(
		id,
		token,
		charge_type,
		plan_id,
		payment_id,
		is_change = false
	) {
		return this.api.post(constants.NEW_SUBSCRIPTION, {
			id,
			token,
			charge_type,
			plan_id,
			payment_id,
			is_change,
		});
	}

	/**
	 * Get subscription details
	 * @param {number} id
	 * @param {string} token
	 */
	subscriptionDetails(id, token) {
		return this.api.get(constants.DETAILS_SUBSCRIPTION, {
			params: {
				id,
				token,
			},
		});
	}

	/**
	 * Add a Provider's Cards
	 * @param {number} id
	 * @param {string} token
	 * @param {string} card_holder
	 * @param {number} card_number
	 * @param {number} card_cvv
	 * @param {number} card_expiration_month
	 * @param {number} card_expiration_year
	 */
	addCard(
		id,
		token,
		card_holder,
		card_number,
		card_cvv,
		card_expiration_month,
		card_expiration_year
	) {
		return this.api.post(constants.ADD_CARD, {
			id: id,
			token: token,
			card_holder: card_holder,
			card_number: card_number,
			card_cvv: card_cvv,
			card_expiration_month: card_expiration_month,
			card_expiration_year: card_expiration_year,
			terra_card: 0,
			is_provider: true,
		});
	}

	/**
	 * List a Provider's Cards
	 * @param {number} id
	 * @param {string} token
	 */
	listCards(id, token) {
		return this.api.post(constants.LIST_CARD, {
			id,
			token,
		});
	}

	/**
	 * Cancel a subscription
	 * @param {number} id
	 * @param {string} token
	 * @param {number} subscription_id
	 */
	cancelSubscription(id, token, subscription_id) {
		return this.api.post(constants.CANCEL_SUBSCRIPTION, {
			id,
			token,
			subscription_id,
		});
	}

	/**
	 * Send pending locations to server
	 * @param {number} provider_id
	 * @param {string} token
	 * @param {number} request_id
	 * @param {array} pending_locations
	 */
	sendPendingLocations(provider_id, token, request_id, pending_locations) {
		return this.api.post(constants.PENDING_REQUEST_LOCATIONS, {
			provider_id,
			token,
			request_id,
			pending_locations,
		});
	}

	updateReferralCode(provider_id, token, referral_code) {
		return this.api.post(constants.UPDATE_REFERRAL_CODE, {
			token,
			provider_id,
			referral_code,
		});
	}

	getIndicationBannerQRCode(provider_id, token, referral_code) {
		return this.api.post(constants.INDICATION_QRCODE, {
			token,
			provider_id,
			referral_code,
		});
	}

	createLedgerParent(provider_id, token, referral_code, type) {
		return this.api.post(constants.CREATE_LEDGER_PARENT, {
			provider_id,
			token,
			referral_code,
			type,
		});
	}

	GetAddressFromPlaceIdLib(id, token, place_id, clicker, address) {
		return this.api.post(constants.GET_PLACE_DETAILS, {
			id: id,
			token: token,
			place_id: place_id,
			address: address,
			clicker: clicker,
		});
	}

	/**
	 * @api {GET} /api/v3/provider/get_estimate_and_polyline
	 * @description Pega os dados de estimatima e polyline
	 * @param {number} id
	 * @param {string} token
	 * @param {number} latitude
	 * @param {number} longitude
	 * @param {number} dest_latitude
	 * @param {number} dest_longitude
	 * @param {String} promo_code
	 * @param {Array} stops
	 */
	getEstimateAndPolyline(
		id,
		token,
		latitude,
		longitude,
		dest_latitude,
		dest_longitude,
		promo_code = null,
		stops = []
	) {
		return this.api.get(constants.GET_ESTIMATIVE_URL, {
			params: {
				id,
				token,
				latitude,
				longitude,
				dest_latitude,
				dest_longitude,
				promo_code,
				stops,
			},
		});
	}

	createKnobRequest(
		id,
		token,
		distance,
		time,
		polyline,
		latitude,
		longitude,
		d_latitude,
		d_longitude,
		type,
		category_id,
		payment_mode,
		src_address = null,
		dest_address = null,
		name,
		phone = null,
		stops = null
	) {
		return this.api.post(constants.CREATE_KNOB_REQUEST, {
			id: id,
			token: token,
			distance: distance,
			time: time,
			polyline: polyline,
			latitude: latitude,
			longitude: longitude,
			d_latitude: d_latitude,
			d_longitude: d_longitude,
			type: type,
			category_id: category_id,
			payment_mode: payment_mode,
			src_address: src_address,
			dest_address: dest_address,
			user_name: name,
			phone: phone,
			stops,
		});
	}

	/**
	 * Request Status: Handle Request Points
	 * @param {int} id
	 * @param {string} token
	 * @param {int} request_id
	 * @param {int} point_id
	 */
	HandleRequestPoints(id, token, request_id, point_id) {
		return this.api.post(constants.HANDLE_REQUEST_POINTS, {
			id: id,
			token: token,
			request_id: request_id,
			point_id: point_id,
		});
	}

	getPaymentNomenclatures() {
		return this.api.get('/libs/gateways/nomenclatures');
	}

	/**
	 * Get surge heatmap and labels areas
	 */
	getSurgeHeatmap() {
		return this.api.get(constants.SURGE_HEATMAP_URL);
	}

	/**
	 * Atualiza o campo que indica se o motorista vai receber uma chamada em espera ou não
	 *
	 * @param {int} provider_id
	 * @param {string} token
	 */
	updateWaitingRideField(provider_id, token, waiting_ride) {
		return this.api.post(constants.UPDATE_WAITING_RIDE, {
			provider_id: provider_id,
			token: token,
			waiting_ride,
		});
	}

	/**
	 * Retrieve user bank data
	 * @param {*} id
	 * @param {*} token
	 */
	GetProviderBankAccount(id, token) {
		return this.api.get(constants.GET_BANK_PROVIDER_URL, {
			params: {
				id,
				token,
			},
		});
	}

	/**
	 * Retrieve user bank data
	 * @param {*} id
	 * @param {*} token
	 */
	pingAudio(url) {
		return axios.post(constants.PING_AUDIO, {url});
	}

	/**
	 * Recupera tempo e distância até chegada do motorista durante corrida
	 *
	 * @param {int} provider_id
	 * @param {string} token
	 * @param {int} request_id
	 */
	getDistanceAndTimeToArrive(provider_id, token, request_id) {
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();

		setTimeout(() => {
			source.cancel('###Operation canceled by the user.');
		}, constants.REQUEST_DETAILS_UPDATE_TIME);

		return this.api.post(
			constants.GET_DISTANCE_TIME_ARRIVE,
			{
				provider_id: provider_id,
				token: token,
				request_id: request_id,
			},
			{
				cancelToken: source.token,
			}
		);
	}

	/**
	 * Recupera a tabela de preço do motorista
	 *
	 * @param {int} provider_id
	 * @param {string} token
	 * @param {int} type
	 */
	getPrice(provider_id, token, type) {
		return this.api.get(constants.GET_PRICE, {
			params: {provider_id: provider_id, token: token, type: type}
		});
	}

	/**
	 * Salva se o provider deseja ser avaliado ou não
	 *
	 * @param {int} provider_id
	 * @param {string} token
	 * @param {boolean} rating
	 */
	saveRating(provider_id, token, rating) {
		return this.api.post(constants.CONFIG_RATING, {
			provider_id,
			token,
			rating
		});
	}
}
