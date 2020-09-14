import logo from "./assets/images/logo_placeholder.png";
let config = {};

let stage = "dev";
let companyHost = "qiji";
let endPoint = `https://${companyHost}${stage !== "" ? "-" + stage : ""}.proseller.io`;

if (process.env.REACT_APP_STAGE === "local") {
  config = {
    url_masterdata: `${endPoint}/masterdata/api/`,
    url_crm: `${endPoint}/crm/api/`,
    url_appointment: `${endPoint}/appointment/api/`,
    url_ordering: `${endPoint}/ordering/api/`,
    url_product: `${endPoint}/product/api/`,
  };
} else if (
  process.env.REACT_APP_STAGE === "dev" ||
  process.env.REACT_APP_STAGE === "demo" ||
  process.env.REACT_APP_STAGE === "prod"
) {
  config = {
    url_masterdata: `https://${window.location.hostname}/masterdata/api/`,
    url_crm: `https://${window.location.hostname}/crm/api/`,
    url_appointment: `https://${window.location.hostname}/appointment/api/`,
    url_ordering: `https://${window.location.hostname}/ordering/api/`,
    url_product: `https://${window.location.hostname}/product/api/`,
  };
}

if (process.env.REACT_APP_STAGE === "demo") {
  config.url_payment = `https://payment-demo.proseller.io/api/`;
} else if (process.env.REACT_APP_STAGE === "prod") {
  config.url_payment = `https://payment.proseller.io/api/`;
} else {
  config.url_payment = `https://payment${stage !== "" ? "-" + stage : ""
    }.proseller.io/api/`;
}

config.url_logo = logo;
config.image_placeholder =
  "https://cdn-bucket-file-manager.s3.ap-southeast-1.amazonaws.com/Upload/f97b5652-2992-4b9e-a03e-7144a42aec81/logo/b61882f3-25b2-4855-960f-166e815eacc7.jpg";
config.prefix = window.location.pathname.includes("emenu")
  ? "emenu"
  : "webordering";

export default config;
