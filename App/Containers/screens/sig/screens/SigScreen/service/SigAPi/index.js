import axios from 'axios';

import {
  APIS_GO_MOBI,
  BASE_URL,
  INDICATIONS_URL,
  INDICATION_FLYER_URL
} from "../../../../../../../Util/Constants";

export default class SigApi {

	static api;

	constructor() {
    this.api = this.createAxiosRequest(BASE_URL);
	}

  createAxiosRequest(baseURL, headers = {}) {
    return axios.create({
      baseURL: baseURL,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
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

  async getUserAuthorized(inviteCode) {
    const token = await this.getToken();
    const headers = {
      "Authorization": `Bearer ${token}`
    };
    const api = this.createAxiosRequest(APIS_GO_MOBI.url, headers);
    const user = await api.get(APIS_GO_MOBI.endpoints.userAuthorized + inviteCode, {});
    return user.data;
  }

  getIndication(id, token) {
    return this.api.get(INDICATIONS_URL, { params: { id: id, token: token } });
  }

	getIndicationBanner(id, token, referralCode) {
    return this.api.post(INDICATION_FLYER_URL, {
			token,
      id: id,
			provider_id: id,
			referral_code: referralCode,
      is_banner_qr_code: "1"
		});
	}
}
