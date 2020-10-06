import { Header, jsonToQueryString } from "../helpers";
import config from "../config";

import { lsLoad } from "../helpers/localStorage";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

export const MasterDataService = {
  api,
};

function api(method, params, path, token = null, url_masterdata = null) {
  let account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));

  const header = new Header(params);
  let url = `${config.url_masterdata}${path}`;
  if (url_masterdata) {
    if (path === "order-magmarvel-demo.proseller.io") return "magmarvel-demo.proseller.io"
    if (path === "order.pengenbisa.com") return "magmarvel-dev.proseller.io"
  }

  let configuration = {
    headers: header,
    method: method,
  };

  if (method.toLowerCase() === "get" && params)
    url += "?" + jsonToQueryString(params);
  if (method.toLowerCase() !== "get" && params)
    configuration.body = JSON.stringify(params);
  if (token && account)
    configuration.headers.Authorization = `${token} ${account.accessToken.jwtToken}`;
  // console.log(configuration)

  return fetch(url, configuration)
    .then((response) => response.json())
    .catch(function () {
      return { ResultCode: 400, message: "fetch api error" };
    });
}
