import { CRMService } from '../../Services/CRMService';
import { AuthActions } from './AuthAction';
import { CustomerAction } from './CustomerAction';
import _ from 'lodash';

function getRedeemVoucher() {
  return async () => {
    let response = await CRMService.api('GET', null, 'voucher', 'bearer');
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    try {
      if (response.Data.length > 0) {
        const Data = _.orderBy(response.Data, ['redeemValue'], ['asc']);
        response.Data = Data;
      }
    } catch (e) {
      console.log(e);
    }
    return response;
  };
}

function redeemVoucher(payload, qty = 1) {
  return async () => {
    let date = new Date();
    let paramps = {
      voucher: payload,
      timeZoneOffset: date.getTimezoneOffset(),
      qty,
    };
    let response = await CRMService.api(
      'POST',
      paramps,
      'accummulation/point/redeem/voucher',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function transferVoucher(payload) {
  return async (dispatch) => {
    dispatch({ type: 'SEND_VOUCHER' });
    let response = await CRMService.api(
      'POST',
      payload,
      'customer/vouchers/transfer',
      'bearer'
    );
    if (response.ResultCode === 401 || response.resultCode === 401) {
      dispatch(AuthActions.refreshToken());
    } else if (response.ResultCode >= 400 || response.resultCode >= 400) {
      dispatch({
        type: 'SEND_VOUCHER_FAILED',
        payload: response.Data || response.message,
      });
    } else {
      dispatch(CustomerAction.getVoucher());
      dispatch({ type: 'SEND_VOUCHER_SUCCESS' });
    }
  };
}

export const VoucherAction = {
  getRedeemVoucher,
  redeemVoucher,
  transferVoucher,
};
