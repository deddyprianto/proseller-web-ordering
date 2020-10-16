import { CRMService } from "../../Services/CRMService";
import { AuthActions } from "./AuthAction";

export const ReferralAction = {
  getReferral,
  createReferral,
  resendReferral,
  deleteReferral,
};

function getReferral(payload) {
  return async (dispatch) => {
    let response = await CRMService.api('POST', payload, 'referral', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}

function createReferral(payload) {
  return async (dispatch) => {
    let response = await CRMService.api('POST', payload, 'referral/create', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}

function resendReferral(id) {
  return async (dispatch) => {
    let response = await CRMService.api('GET', null, 'referral/resend/' + id, 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}

function deleteReferral(id) {
  return async (dispatch) => {
    let response = await CRMService.api('DELETE', null, 'referral/delete/' + id, 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}