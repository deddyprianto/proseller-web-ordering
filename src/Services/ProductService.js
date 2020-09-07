import { Header, jsonToQueryString } from "../helpers";
import config from '../config'

export const ProductService = {
  api,
};

function api(method, params, path) {
  const header = new Header(params);
  let url = `${config.url_product}${path}`;
  let configuration = {
    headers: header,
    method: method,
  };

  if (method.toLowerCase() === "get") url += "?" + jsonToQueryString(params)
  else if (params) configuration.body = JSON.stringify(params)

  return fetch(url, configuration).then((response) =>
    response.json()
  );
}
