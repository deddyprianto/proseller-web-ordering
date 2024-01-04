import { CRMService } from "../../Services/CRMService";

function getPackageCustomerList(params) {
  return async () => {
    let response = await CRMService.api(
      "GET",
      params,
      "customer/package",
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

function getPackageById(id) {
  return async () => {
    let response = await CRMService.api(
      "GET",
      null,
      `customer/package/${id}`,
      "bearer"
    );
    if (response.ResultCode >= 400 || response.resultCode >= 400)
      console.log(response);
    return response;
  };
}

export const PackageAction = {
  getPackageCustomerList,
  getPackageById,
};
