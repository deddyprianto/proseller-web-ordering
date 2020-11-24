import { CRMService } from "../../Services/CRMService";

export const MembershiplAction = {
  getPaidMembership,
};

function getPaidMembership() {
  return async (dispatch) => {
    let response = await CRMService.api('GET', null, 'customergroup/paidmemberships', 'bearer')
    if (response.ResultCode >= 400 || response.resultCode >= 400) console.log(response)
    return response
  };
}