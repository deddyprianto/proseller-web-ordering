import logo from "./assets/images/logo_placeholder.png";
import emptyImage from "./assets/images/empty.png";

let config = {};
let stage = "demo";
let companyHost = "auntieanne";
let endPoint = `https://${companyHost}${ stage !== "" ? "-" + stage : "" }.proseller.io`;

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
} else {
  config = {
    url_masterdata: `${process.env.REACT_APP_ENDPOINT}/masterdata/api/`,
    url_crm: `${process.env.REACT_APP_ENDPOINT}/crm/api/`,
    url_appointment: `${process.env.REACT_APP_ENDPOINT}/appointment/api/`,
    url_ordering: `${process.env.REACT_APP_ENDPOINT}/ordering/api/`,
    url_product: `${process.env.REACT_APP_ENDPOINT}/product/api/`,
  };
}

if (process.env.REACT_APP_STAGE === "demo") {
  config.url_payment = `https://payment-demo.proseller.io/api/`;
} else if (process.env.REACT_APP_STAGE === "prod") {
  config.url_payment = `https://payment.proseller.io/api/`;
} else if (
  process.env.REACT_APP_STAGE === "local" ||
  process.env.REACT_APP_STAGE === "dev"
) {
  config.url_payment = `https://payment${
    stage !== "" ? "-" + stage : ""
  }.proseller.io/api/`;
} else {
  config.url_payment = process.env.REACT_APP_URLPAYMENT;
}

config.url_logo = logo;
config.url_emptyImage = emptyImage;
config.image_placeholder =
  "https://cdn-bucket-file-manager.s3.ap-southeast-1.amazonaws.com/Upload/f97b5652-2992-4b9e-a03e-7144a42aec81/logo/b61882f3-25b2-4855-960f-166e815eacc7.jpg";
config.prefix = window.location.pathname.includes("emenu")
  ? "emenu"
  : "webordering";

config.getValidation = function getValidation(defaultOutlet) {
  let orderValidation = {
    takeAway: { minAmount: 0, maxQty: 0, maxAmount: 0, minQty: 0 },
    delivery: { minAmount: 0, maxQty: 0, maxAmount: 0, minQty: 0 },
    dineIn: { minAmount: 0, maxQty: 0, maxAmount: 0, minQty: 0 },
    storepickup: { minAmount: 0, maxQty: 0, maxAmount: 0, minQty: 0 },
    storecheckout: { minAmount: 0, maxQty: 0, maxAmount: 0, minQty: 0 },
  };
  if (defaultOutlet && !defaultOutlet.orderValidation) {
    defaultOutlet.orderValidation = orderValidation;
  } else if (defaultOutlet && defaultOutlet.orderValidation) {
    for (const key in orderValidation) {
      if (!defaultOutlet.orderValidation[key])
        defaultOutlet.orderValidation[key] = orderValidation[key];
    }
  }
  return defaultOutlet;
};

config.getSettingOrdering = function getSettingOrdering(orderingSetting) {
  let primary =
    orderingSetting.theme &&
    orderingSetting.theme.color &&
    orderingSetting.theme.color.primary;
  let secondary =
    orderingSetting.theme &&
    orderingSetting.theme.color &&
    orderingSetting.theme.color.secondary;
  let defaultSetting = {
    theme: { 
      color: { 
        secondary: "#C00A27", primary: "#C00A27",
        font: "#808080", background: "#FFFFFF", 
        navigation: "#C00A27"
      } 
    },
    settings: [
      { settingKey: "LoginByEmail", settingValue: true },
      { settingKey: "LoginByMobile", settingValue: true },
      { settingKey: "MobileOTP", settingValue: "SMS" },
      { settingKey: "EnableRegisterWithPassword", settingValue: false },
      { settingKey: "EnableOrdering", settingValue: true },
      { settingKey: "Logo", settingValue: logo },
      { settingKey: "PrimaryColor", settingValue: primary || "#C00A27" },
      { settingKey: "SecondaryColor", settingValue: secondary || "#C00A27" },
      { settingKey: "PointIcon", settingValue: "" },
      {
        settingKey: "TimeAndDateOrder",
        settingValue: {
          deliveryTime: { start: "00:00", end: "23:00" },
          storePickupTime: { start: "00:00", end: "23:00" },
        },
      },
      { settingKey: "TimeAndDateOrderLength", settingValue: 60 },
      { settingKey: "FontColor", settingValue: "#808080" },
      { settingKey: "BackgroundColor", settingValue: "#FFFFFF" },
      { settingKey: "NavigationColor", settingValue: primary || "#C00A27" },
      { settingKey: "TextButtonColor", settingValue: "#FFF" },
      { settingKey: "TextWarningColor", settingValue: "red" },
    ],
  };

  if (!orderingSetting) orderingSetting = defaultSetting;
  if (orderingSetting && !orderingSetting.settings)
    orderingSetting.settings = defaultSetting.settings;
  if (orderingSetting && orderingSetting.settings) {
    defaultSetting.settings.forEach((settings) => {
      let check = orderingSetting.settings.find((items) => {
        return items.settingKey === settings.settingKey;
      });
      if (!check) orderingSetting.settings.push(settings);
    });
  }
  if (orderingSetting && !orderingSetting.theme)
    orderingSetting.theme = defaultSetting.theme;
  return orderingSetting;
};

config.checkNickName = function checkNickName(mode, storeDetail) {
  if (mode === "TAKEAWAY") return isNotFalse(storeDetail.takeAwayName) || mode;
  if (mode === "DINEIN") return isNotFalse(storeDetail.dineInName) || mode;
  if (mode === "DELIVERY") return isNotFalse(storeDetail.deliveryName) || mode;
  return mode;
};

function isNotFalse(nickname) {
  if (!nickname || (nickname && nickname === "")) nickname = false;
  return nickname;
}

export default config;
