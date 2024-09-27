import * as constants from '../../Util/Constants';
import i18n, { strings } from '../../Locales/i18n';
import axios from 'axios';
import moment from "moment";

//Classe para realizar a requisição no servidor utilizando multipart/form-data
export default class ProviderApiFormData {

  static api;

  constructor() {
    this.api = axios.create({
      baseURL: constants.BASE_URL,
      httpsAgent: { rejectUnauthorized: false },
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data; charset=utf-8",
        locale: i18n.locale
      }
    });
  }

  /**
   * Register a provider
   * @param {string} first_name
   * @param {string} last_name
   * @param {android} device_type
   * @param {string} device_token
   * @param {manual | google | facebook} login_by
   * @param {number} social_unique_id
   * @param {object} picture
   * @param {string} email
   * @param {char} gender
   * @param {string} password
   * @param {string} indicationCode
   */
  RegisterOrUpdateBasicData(
    {
      provider_id,
      first_name,
      last_name,
      document,
      email,
      password,
      confirm_password,
      gender,
      phone,
      phone_valid,
      referral_code,
      picture,
      rotation,
      accept_terms,
      device_token,
      device_type,
      login_by,
      social_unique_id,
      birthday,
      Latitude,
      Longitude
    }
  ) {

    let formdata = new FormData();

    if (password !== '111111' && password !== '') {
      formdata.append('password', password);
    }

    if (confirm_password !== '111111' && confirm_password !== '') {
      formdata.append('confirm_password', confirm_password);
    }

    if (provider_id) {
      formdata.append('provider_id', provider_id);
    }

    if (referral_code) {
      formdata.append('referral_code', referral_code);
    }

    formdata.append('first_name', first_name);
    formdata.append('last_name', last_name);
    formdata.append('document', document)
    formdata.append('email', email);
    formdata.append('gender', gender);
    formdata.append('phone', phone);
    formdata.append('phone_valid', phone_valid);
    formdata.append('picture', picture);
    formdata.append('rotation', rotation);
    formdata.append('accept_terms', accept_terms);
    formdata.append('device_token', device_token);
    formdata.append('device_type', device_type);
    formdata.append('login_by', login_by);
    formdata.append('social_unique_id', social_unique_id);
    formdata.append('birthday', birthday);
    formdata.append('latitude', Latitude);
    formdata.append('longitude', Longitude);

    return this.api.post(provider_id ?
      constants.UPDATE_PROVIDER_URL :
      constants.REGISTER_PROVIDER_URL, formdata);
  }

  /**
   * Update a provider
   * @param {string} first_name
   * @param {string} last_name
   * @param {android} device_type
   * @param {string} device_token
   * @param {manual | google | facebook} login_by
   * @param {number} social_unique_id
   * @param {object} picture
   * @param {string} email
   * @param {char} gender
   * @param {string} password
   * @param {string} indicationCode
   */
  UpdateProvider(id, token, first_name, last_name, email, gender, phone, phone_valid, zipcode, address, address_number,
    address_complements, address_neighbour, address_city, state, country, referral_code, picture, device_token, device_type,
    provider_birthday_date, Latitude, Longitude) {

    let formdata = new FormData();

    formdata.append('provider_id', id);
    formdata.append('token', token);
    formdata.append('first_name', first_name);
    formdata.append('last_name', last_name);
    formdata.append('email', email);
    formdata.append('password', null);
    formdata.append('new_password', null);
    formdata.append('old_password', null);
    formdata.append('gender', gender);
    formdata.append('phone', phone);
    formdata.append('zipcode', zipcode);
    formdata.append('address', address);
    formdata.append('address_number', address_number);
    formdata.append('address_complements', address_complements);
    formdata.append('address_neighbour', address_neighbour);
    formdata.append('address_city', address_city);
    formdata.append('state', state);
    formdata.append('country', country);
    formdata.append('picture', picture);
    formdata.append('birth', provider_birthday_date);
    formdata.append('latitude', Latitude);
    formdata.append('longitude', Longitude);
    if (referral_code) { formdata.append('referral_code', referral_code); }

    return this.api.post(constants.UPDATE_PROVIDER_URL, formdata);
  }

  ChangePassword(provider_id, token, password, confirm_password) {

    let formdata = new FormData();

    formdata.append('provider_id', provider_id)
    formdata.append('token', token);
    formdata.append('password', password);
    formdata.append('confirm_password', confirm_password);

    return this.api.post(constants.CHANGE_PASSWORD_PROVIDER_URL, formdata);
  }

  changePhoto({ provider_id, picture, token, device_type, login_by }) {

    let formdata = new FormData();

    formdata.append('provider_id', provider_id)
    formdata.append('token', token);
    formdata.append('picture', picture);
    formdata.append('device_type', device_type);
    formdata.append('login_by', login_by);

    return this.api.post(constants.CHANGE_PHOTO_PROVIDER_URL, formdata);
  }

  RegisterAddressData(id, zipcode, address, address_number, address_complements, address_neighbour, address_city, state, country) {
    let formdata = new FormData();

    formdata.append('provider_id', id);
    formdata.append('zipcode', zipcode);
    formdata.append('street', address);
    formdata.append('number', address_number);
    formdata.append('complements', address_complements);
    formdata.append('neighbour', address_neighbour);
    formdata.append('city', address_city);
    formdata.append('state', state);
    formdata.append('country', country);
    return this.api.post(constants.REGISTER_ADDRESS, formdata)
  }


  RegisterServicesTest(id, origin, provider_type) {
    let formdata = new FormData();

    formdata.append('provider_id', id);
    formdata.append('origin', origin)
    formdata.append('provider_type', provider_type)

    return this.api.post(constants.REGISTER_SERVICES_PROVIDER_URL, formdata)
  }


  /**
  * Second step - register provider
  * @param {provider_id} Number
  * @param {certificate} Array
  * @param {origin} String
  * @param {provider_type} Array
  */
  RegisterBankAccount(
    provider_id,
    account,
    account_digit,
    agency,
    agency_digit,
    holder,
    person_type,
    document_individual,
    document_company,
    bank_id,
    account_types,
    birthday,
    latitude,
    longitude,
    pix_type,
    pix_value) {

    let formdata = new FormData()

    formdata.append('provider_id', provider_id)
    formdata.append('account', account)
    formdata.append('account_digit', account_digit)
    formdata.append('agency', agency)
    formdata.append('agency_digit', agency_digit)
    formdata.append('holder', holder)
    formdata.append('person_type', person_type)
    formdata.append('document_individual', document_individual)
    formdata.append('document_company', document_company)
    formdata.append('bank_id', bank_id)
    formdata.append('account_types', account_types)
    formdata.append("latitude", latitude)
    formdata.append("longitude", longitude)
    formdata.append("type_pix", pix_type)
    formdata.append("key_pix", pix_value)

    return this.api.post(constants.REGISTER_BANK_PROVIDER_URL, formdata)
  }


  /**
   * Register provider's docs
   * @param {number} provider
   * @param {array} documents
   */
  RegisterDocs(provider, documents) {

    let formdata = new FormData()

    formdata.append('provider', provider);
    for (var i = 0; i < documents.length; i++) {
      formdata.append("docs[" + documents[i].id + "]", documents[i].pictureUpload);
      if (documents[i].expirationDate) {
        var expirationDate = documents[i].expirationDate.split('/');
        formdata.append("data[" + documents[i].id + "]", "" + expirationDate[2] + '-' + expirationDate[1] + "-" + expirationDate[0]);
      }
    }
    return this.api.post(constants.REGISTER_DOCS_PROVIDER_URL, formdata);
  }

  RegisterDocsProvider(provider_id, doc_id, document, validity) {
    let formdata = new FormData()

    formdata.append('provider_id', provider_id)
    formdata.append('document_id', doc_id)
    document && formdata.append('document_file', document)
    formdata.append('validity', validity)

    return this.api.post(constants.REGISTER_DOCS_PROVIDER_URL, formdata)
  }

  RegisterAditionalDocsProvider(data) {
    let formData = new FormData();

    formData.append('provider_id', data.addProviderId);
    formData.append('ear', data.form.ear);
    formData.append('license_category[]', JSON.stringify(data.form.categorySelected));
    formData.append('own_vehicle', data.form.ownVehicle);
    formData.append('certificate_required', data.form.conduapp);
    formData.append('certificate_file', data.form.certificate);
    formData.append('chassi', data.form.chassi);
    formData.append('renavam', data.form.renavam);
    formData.append('plate_city', data.form.cityPlate);
    formData.append('state_plate', data.form.statePlate);
    formData.append('manufaturing_year', data.form.manufaturingYear);
    formData.append('model_year', data.form.modelYear);
    return this.api.post(constants.REGISTER_ADITIONAL_INFO_DOCUMENTS, formData)
  }

  /**
   * Update or create provider's docs
   * @param {number} id
   * @param {array} token
   * @param {array} document
   * @param {number} rotation
   */
  UpdateOrCreateDocs(id, token, document, rotation, expirationDate) {
    let formdata = new FormData();

    formdata.append('provider_id', id);
    formdata.append('token', token);
    formdata.append('document_id', document.id);
    formdata.append('rotation', rotation);

    if (document.pictureUpload) {
      formdata.append('document', document.pictureUpload);
    }

    if (document.expirationDate) {
      let expirationDate = moment(document.expirationDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
      formdata.append("validity", expirationDate);
    }

    return this.api.post(constants.UPDATE_DOCS_PROVIDER_URL, formdata);
  }

  /**
 * Recupera a tabela de preço do motorista
 *
 * @param {int} provider_id
 * @param {string} token
 * @param {object} priceData
 */
  savePrice(provider_id, token, priceData, type) {

    const formdata = new FormData();

    formdata.append('provider_id', provider_id);
    formdata.append('token', token);
    formdata.append('priceData', priceData);
    formdata.append('type', type);

    return this.api.post(constants.SAVE_PRICE, formdata);
  }
}
