import { CRMService } from '../../Services/CRMService';
import { CONSTANT } from '../../helpers';

function setData(data, constant) {
  return {
    type: constant,
    data: data.Data,
  };
}

function getBroadcast(payload = {}) {
  return async (dispatch) => {
    payload.sortBy = 'dataIndex';
    payload.sortDirection = 'desc';
    payload.messageOption = 'all';

    let response = await CRMService.api(
      'POST',
      payload,
      'broadcast/customer',
      'bearer'
    );
    let responseUnread = await CRMService.api(
      'POST',
      { messageOption: 'unread' },
      'broadcast/customer',
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    else {
      let broadcast = response.Data;
      let broadcastLength = response.DataLength;
      let broadcastUnreadLength = responseUnread.DataLength;
      response.Data = { broadcast, broadcastLength, broadcastUnreadLength };
    }
    dispatch(setData(response, CONSTANT.KEY_GET_BROADCAST));
    return response;
  };
}

function getBroadcastByID(id) {
  return async () => {
    let response = await CRMService.api(
      'GET',
      null,
      `broadcast/customer/get/${id}`,
      'bearer'
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

export const InboxAction = {
  getBroadcast,
  getBroadcastByID,
  setData,
};
