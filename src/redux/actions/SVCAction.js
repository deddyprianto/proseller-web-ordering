import { CRMService } from "../../Services/CRMService";

export const SVCAction = {
  loadSVC,
};

function loadSVC() {
  return async (dispatch) => {
    let response = await CRMService.api('GET', null, 'storevaluecard/load', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}