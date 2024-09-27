import axios from 'axios';
import i18n from '../../../../../Locales/i18n';
import { APIS_GO_MOBI, BASE_URL, REGISTER_VEHICLE_PROVIDER_URL } from '../../../../../Util/Constants';

export class VehicleApi {

  static api;

  constructor() {
    this.api = axios;
    this.api.defaults.baseURL = BASE_URL;
    this.api.defaults.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      locale: i18n.locale,
    };
  }
  /**
   *
   * @param {string} provider_id
   * @param {string} car_number
   * @param {string} car_model
   * @param {string} car_brand
   * @param {string} car_color
   * @param {string*} car_manufactoring_year
   * @param {string} car_model_year
   * @param {string} latitude
   * @param {string} longitude
   * @description Criar ou Altera os dados do veiculos do motorista
   * @returns
   */
  registerOrUpdate(provider_id,
    {
      car_number,
      car_model,
      car_brand,
      car_color,
      car_manufactoring_year,
      car_model_year
    },
    latitude,
    longitude) {
    return this.api.post(REGISTER_VEHICLE_PROVIDER_URL, {
      provider_id,
      car_number,
      car_model,
      car_brand,
      car_color,
      car_manufactoring_year,
      car_model_year,
      latitude,
      longitude,
    });
  }

  createAxiosRequest(baseURL, headers = {}) {
    return axios.create({
      baseURL: baseURL,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        locale: i18n.locale,
        ...headers
      }
    });
  }

  async getToken() {
    const api = this.createAxiosRequest(APIS_GO_MOBI.url);
    const headers = {
      clientKey: APIS_GO_MOBI.clientKey,
      clientSecret: APIS_GO_MOBI.clientSecret
    };
    const token = await api.post(APIS_GO_MOBI.endpoints.token, headers);
    return token.data.access_token;
  }

  async searhNumberVehicle(carNumber) {
    const token = await this.getToken();
    const headers = {
      "Authorization": `Bearer ${token}`
    };
    const api = this.createAxiosRequest(APIS_GO_MOBI.url, headers);
    const vehiclePlate = await api.get(APIS_GO_MOBI.endpoints.vehiclePlate + carNumber, {});
    return vehiclePlate.data;
  }
}
