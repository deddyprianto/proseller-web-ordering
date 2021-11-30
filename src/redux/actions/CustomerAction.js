import { CONSTANT } from "../../helpers";
import { CRMService } from "../../Services/CRMService";
import { MasterDataService } from "../../Services/MasterDataService";
import _ from "lodash";
import moment from "moment";
import config from "../../config";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

export const CustomerAction = {
  getCustomerProfile,
  getDeliferyAddress,
  updateCustomerProfile,
  mandatoryField,
  getVoucher,
  checkStatusPayment,
  updatePassword,
  updateCustomerAccount,
  getSalesByReference,
};

function getCustomerProfile() {
  return async (dispatch) => {
    let response = await CRMService.api(
      "GET",
      null,
      "customer/getProfile",
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    dispatch(setData(response, CONSTANT.KEY_GET_CUSTOMER_PROFILE));
    return response;
  };
}

function getSalesByReference(referenceNo) {
  return async (dispatch) => {
    let response = await CRMService.api(
      "GET",
      null,
      `sales/status?referenceNo=${referenceNo}&ignorePendingRewards=${true}`,
      "bearer"
    );
    return response;
  };
}

function checkStatusPayment(referenceNo) {
  return async (dispatch) => {
    let response = await CRMService.api(
      "GET",
      null,
      `sales/status?referenceNo=${referenceNo}`,
      "bearer"
    );
    if (response.ResultCode === 200) return response;
    else return {};
  };
}

function getDeliferyAddress() {
  return async (dispatch) => {
    let response = await CRMService.api(
      "GET",
      null,
      "customer/getProfile",
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else {
      let deliveryAddress = response.Data[0];
      if (
        deliveryAddress &&
        deliveryAddress.deliveryAddress &&
        deliveryAddress.deliveryAddress.length > 0
      ) {
        deliveryAddress = deliveryAddress.deliveryAddress;
      } else if (deliveryAddress.address) {
        deliveryAddress = [
          {
            addressName: "My Default Address",
            address: deliveryAddress.address,
            postalCode: "",
            city: "",
          },
        ];
      } else deliveryAddress = null;
      response.Data = deliveryAddress;
    }
    dispatch(setData(response, CONSTANT.KEY_GET_CUSTOMER_PROFILE));
    return response;
  };
}

function updateCustomerProfile(payload = null) {
  return async (dispatch) => {
    console.log(payload);
    let response = await CRMService.api(
      "PUT",
      payload,
      "customer/updateProfile",
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    dispatch(setData(response, CONSTANT.KEY_UPDATE_CUSTOMER_PROFILE));
    return response;
  };
}

function updateCustomerAccount(payload = null) {
  return async (dispatch) => {
    let response = await CRMService.api(
      "PUT",
      payload,
      "customer/updateProfile?requestOtp=true",
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function updatePassword(payload = null) {
  return async (dispatch) => {
    let response = await CRMService.api(
      "POST",
      payload,
      "profile/changePassword",
      "Bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function mandatoryField(payload = null) {
  return async (dispatch) => {
    let response = await CRMService.api(
      "GET",
      payload,
      "mandatoryfield/customer"
    );
    const data = await response.data;
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else {
      const customFieldsResponse = await MasterDataService.api(
        "GET",
        payload,
        "customfields/customer"
      );
      const customFields = await customFieldsResponse.data;
      const fields =
        data.fields &&
        data.fields.map((field) => {
          switch (field.fieldName) {
            case "birthDate":
              return {
                ...field,
                type: "date",
              };
            case "gender":
              return {
                ...field,
                type: "radio",
                options: [
                  {
                    value: "male",
                    text: "Male",
                  },
                  {
                    value: "female",
                    text: "Female",
                  },
                ],
              };
            case "address":
              return {
                ...field,
                type: "multipleField",
                children: [
                  {
                    fieldName: "street",
                    displayName: "Street",
                    type: "text",
                  },
                  {
                    fieldName: "unitNo",
                    displayName: "Unit No.",
                    type: "text",
                  },
                ],
              };
            default:
              const customField = customFields.find(
                (item) => item.fieldName === field.fieldName
              );
              const type = customField
                ? customField.dataType === "dropdown"
                  ? "select"
                  : customField.dataType
                : "text";
              return {
                ...field,
                ...customField,
                type,
                options: customField ? customField.items : [],
              };
          }
        });

      let mandatory = [
        {
          dataType: "text",
          defaultValue: "-",
          displayName: "Name",
          fieldName: "name",
          mandatory: true,
          show: true,
          type: "text",
          signUpField: false,
        },
        {
          dataType: "text",
          defaultValue: "-",
          displayName: "Email",
          fieldName: "email",
          mandatory: true,
          show: true,
          type: "text",
          signUpField: false,
          change: true,
        },
        {
          dataType: "text",
          defaultValue: "-",
          displayName: "Phone Number",
          fieldName: "phoneNumber",
          mandatory: true,
          show: true,
          type: "text",
          signUpField: false,
          change: true,
        },
      ];

      dispatch({
        type: CONSTANT.KEY_MANDATORY_FIELD_CUSTOMER,
        data: mandatory.concat(fields),
      });
    }
    return response;
  };
}

function getVoucher() {
  return async (dispatch) => {
    let response = await CRMService.api(
      "GET",
      null,
      "customer/vouchers",
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else {
      let selectedVoucher = encryptor.decrypt(
        JSON.parse(localStorage.getItem(`${config.prefix}_selectedVoucher`))
      );

      if (selectedVoucher) {
        selectedVoucher.forEach((element) => {
          response.Data = response.Data.filter((items) => {
            return items.serialNumber !== element.serialNumber;
          });
        });
      }

      response.Data = _.forEach(response.Data, function (value) {
        if (value.expiryDate)
          value.expiryDate = moment(value.expiryDate).format("YYYY-MM-DD");
        return value;
      });

      let myVoucherGroup = [];
      _.forEach(_.groupBy(response.Data, "id"), function (value) {
        let group = _.groupBy(value, "expiryDate");
        for (const key in group) {
          if (group.hasOwnProperty(key)) {
            group[key][0].totalRedeem = group[key].length;
            myVoucherGroup.push(group[key][0]);
          }
        }
      });
      // console.log(myVoucherGroup)

      response.Data = _.orderBy(myVoucherGroup, ["expiryDate"], ["asc"]);
      dispatch(setData(response, CONSTANT.GET_VOUCHER));
    }
    return response;
  };
}

function setData(data, constant) {
  return {
    type: constant,
    data: data.Data,
  };
}
