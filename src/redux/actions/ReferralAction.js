import { CRMService } from '../../Services/CRMService';

function getReferral(payload) {
  return async () => {
    let response = await CRMService.api('POST', payload, 'referral', 'bearer');
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function getReferralList() {
  return async () => {
    let response = await CRMService.api('GET', null, 'referral', 'bearer');
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function getReferralInfo() {
  return async () => {
    let response = await CRMService.api("GET", null, "referral-info", "bearer");
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function createReferral(payload) {
  return async () => {
    let response = await CRMService.api(
      "POST",
      payload,
      "referral/create",
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function resendReferral(id) {
  return async () => {
    let response = await CRMService.api(
      "GET",
      null,
      "referral/resend/" + id,
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function deleteReferral(id) {
  return async () => {
    let response = await CRMService.api(
      "DELETE",
      null,
      "referral/delete/" + id,
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function getReferralById(id) {
  return async (dispatch) => {
    let response = await CRMService.api(
      "GET",
      null,
      "referral/" + id,
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else if (
      response.data &&
      response.data.list &&
      response.data.list[0] &&
      response.data.list[0].signUpStatus !== "DONE"
    ) {
      console.log(response.data.list[0]);
      if (response.Data.list[0].email) {
        dispatch({
          type: "SET_DEFAULT_EMAIL",
          data: response.data.list[0].email,
        });
      } else {
        dispatch({
          type: "SET_DEFAULT_PHONE_NUMBER",
          data: response.data.list[0].mobileNo,
        });
      }
      return true;
    }

    return false;
  };
}

export const ReferralAction = {
  getReferral,
  getReferralById,
  createReferral,
  resendReferral,
  deleteReferral,
  getReferralInfo,
  getReferralList
};
