import * as constants from '../../Util/Constants';
import i18n, { strings } from '../../Locales/i18n';
var FormData = require('form-data');

//Classe para realizar a requisição no servidor utilizando multipart/form-data

export default class UserApiFormData{

    constructor () {
       this.state = {
         headers: {
             'locale': i18n.locale,
             'Accept': 'application/json',
             'Content-Type': 'multipart/form-data; charset=utf-8'
         }
       }

    }

    /**
     * Register a user Api Request
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
    RegisterUser(first_name, last_name, email, document, picture, phone, device_token, device_type, login_by, gender, password, indicationCode) {

      let formdata = new FormData();
      formdata.append('email', email);
      formdata.append('password', password);
      formdata.append('gender', gender);
      formdata.append('first_name', first_name);
      formdata.append('last_name', last_name);
      formdata.append('document', document);
      formdata.append('phone', phone);
      formdata.append('login_by', login_by);
      formdata.append('device_token', device_token);
      formdata.append('device_type', device_type);
      formdata.append('picture',picture);
      formdata.append('referral_code',indicationCode);

      const fetchPromise = () => fetch(constants.BASE_URL+''+constants.REGISTER_URL,{
         method: 'POST',
         headers: this.state.headers,
         body: formdata
       });

      return this._simulateDelay()
        .then(() => fetchPromise())
        .then(response => response.json());
    }


    /**
     * Update a user Api Request
     * @param {string} old_password
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
     */
    UpdateUser(user_id, user_token, old_password, first_name, last_name, email, document, picture, phone, device_token, device_type, login_by, gender, password, referral_code) {

      let formdata = new FormData();
      formdata.append('id', user_id);
      formdata.append('token', user_token);
      formdata.append('email', email);


      if(typeof(password) == 'undefined'){
        formdata.append('new_password', '');
      } else {
        formdata.append('new_password', password);
      }

      formdata.append('old_password', old_password);
      formdata.append('gender', gender);
      formdata.append('first_name', first_name);
      formdata.append('last_name', last_name);
      formdata.append('document', document);
      formdata.append('phone', phone);
      formdata.append('login_by', login_by);
      formdata.append('device_token', device_token);
      formdata.append('device_type', device_type);
      formdata.append('picture',picture);

      if(referral_code != '' && referral_code != null) {
        formdata.append('referral_code',referral_code);
      }

      const fetchPromise = () => fetch(constants.BASE_URL+''+constants.UPDATE_USER_URL,{
         method: 'POST',
         headers: this.state.headers,
         body: formdata
       });

      return this._simulateDelay()
        .then(() => fetchPromise())
        .then(response => response.json());
    }




    _simulateDelay () {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, this.simulatedDelay);
      });
    }

}
