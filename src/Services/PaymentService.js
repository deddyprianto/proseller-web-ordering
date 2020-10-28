import { Header, jsonToQueryString } from "../helpers";
import config from "../config";

import { lsLoad } from "../helpers/localStorage";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

export const PaymentService = {
  api,
};

function api(method, params, path, token = null) {
  let account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

  let header = new Header(params);
  let url = `${config.url_payment}${path}`;
  let configuration = {
    headers: header,
    method: method,
  };

  if (method.toLowerCase() === "get" && params)
    url += "?" + jsonToQueryString(params);
  if (method.toLowerCase() !== "get" && params)
    configuration.body = JSON.stringify(params);
  if (token)
    configuration.headers.Authorization = `${token} ${account.accessToken.jwtToken}`;
  // console.log(configuration)

  return fetch(url, configuration)
    .then((response) => response.json())
    .catch(function () {
      return { ResultCode: 400, message: "fetch api error" };
    });
}
