import { CRMService } from "../../Services/CRMService";
import { AuthActions } from "./AuthAction";

export const VoucherAction = {
  getRedeemVoucher,
  redeemVoucher
};

function getRedeemVoucher() {
  return async (dispatch) => {
    let response = await CRMService.api('GET', null, 'voucher', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) await dispatch(AuthActions.refreshToken())
    return response
  };
}

function redeemVoucher(payload) {
  return async (dispatch) => {
    let date = new Date();
    let paramps = {
      voucher: payload,
      timeZoneOffset: date.getTimezoneOffset()
    }
    let response = await CRMService.api('POST', paramps, 'accummulation/point/redeem/voucher', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) await dispatch(AuthActions.refreshToken())
    return response
  };
}