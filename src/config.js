import logo from "./assets/images/logo_placeholder.png";
import { MasterDataService } from "./Services/MasterDataService";

let config = {};
let stage = "demo";
let companyHost = "magmarvel";
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
  config.url_payment = `https://payment${stage !== "" ? "-" + stage : ""}.proseller.io/api/`;
}

config.url_logo = logo;
config.image_placeholder = "https://cdn-bucket-file-manager.s3.ap-southeast-1.amazonaws.com/Upload/f97b5652-2992-4b9e-a03e-7144a42aec81/logo/b61882f3-25b2-4855-960f-166e815eacc7.jpg";
config.prefix = window.location.pathname.includes("emenu") ? "emenu" : "webordering";
config.getValidation = function getValidation(defaultOutlet) {
  let orderValidation = {
    takeAway: { "minAmount": 0, "maxQty": 0, "maxAmount": 0, "minQty": 0 },
    delivery: { "minAmount": 0, "maxQty": 0, "maxAmount": 0, "minQty": 0 },
    dineIn: { "minAmount": 0, "maxQty": 0, "maxAmount": 0, "minQty": 0 },
    storepickup: { "minAmount": 0, "maxQty": 0, "maxAmount": 0, "minQty": 0 },
    storecheckout: { "minAmount": 0, "maxQty": 0, "maxAmount": 0, "minQty": 0 },
  }
  if (defaultOutlet && !defaultOutlet.orderValidation) {
    defaultOutlet.orderValidation = orderValidation
  } else if (defaultOutlet && defaultOutlet.orderValidation) {
    for (const key in orderValidation) {
      if (!defaultOutlet.orderValidation[key]) defaultOutlet.orderValidation[key] = orderValidation[key]
    }
  }
  return defaultOutlet
}

config.getSettingOrdering = function getSettingOrdering(orderingSetting) {
  let defaultSetting = {
    settings: [
      { settingKey: "LoginByEmail", settingValue: true },
      { settingKey: "LoginByMobile", settingValue: true },
      { settingKey: "EnableSMSOTP", settingValue: true },
      { settingKey: "EnableWhatsappOTP", settingValue: false },
      { settingKey: "EnableRegisterWithPassword", settingValue: false },
      { settingKey: "EnableOrdering", settingValue: true },
    ]
  }

  if (!orderingSetting) orderingSetting = defaultSetting
  if (orderingSetting && !orderingSetting.settings) orderingSetting.settings = defaultSetting.settings
  if (orderingSetting && orderingSetting.settings) {
    defaultSetting.settings.forEach(settings => {
      let check = orderingSetting.settings.find(items => { return items.settingKey === settings.settingKey })
      if (!check) orderingSetting.settings.push(settings)
    });
  }
  return orderingSetting
}

export default config;


async function getDomainName(endPoint) {
  let response = await MasterDataService.api("GET", null, endPoint, null, `https://edgeworks-dev.proseller.io/masterdata/api/urlmapping/`)
  console.log(response)
  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      config[key] = config[key].replace(endPoint, response)
    }
  }
  console.log(config)
  return response
}

// if (process.env.REACT_APP_STAGE === "local") {
//   getDomainName(`${companyHost}${stage !== "" ? "-" + stage : ""}.proseller.io`)
// } else if (
//   process.env.REACT_APP_STAGE === "dev" ||
//   process.env.REACT_APP_STAGE === "demo" ||
//   process.env.REACT_APP_STAGE === "prod"
// ) {
//   getDomainName(window.location.host)
// }