import { Header, jsonToQueryString } from "../helpers";
import config from '../config';
const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
const account = encryptor.decrypt(JSON.parse(localStorage.getItem(`${config.prefix}_account`)));

export const CRMService = {
  api,
};

async function api(method, params, path, token = null) {
  let header = new Header(params);
  let url = `${config.url_crm}${path}`;
  let configuration = {
    headers: header,
    method: method,
  };

  if (method.toLowerCase() === "get" && params) url += "?" + jsonToQueryString(params)
  if (method.toLowerCase() !== "get" && params) configuration.body = JSON.stringify(params)
  if (token && account) configuration.headers.Authorization = `${token} ${account.accessToken.jwtToken}`;

  return fetch(url, configuration).then((response) =>
    response.json()
  ).catch(function () {
    return { ResultCode: 400, message: "fetch api error" }
  });
}
