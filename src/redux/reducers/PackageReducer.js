import { CONSTANT } from "../../helpers";

function PackageReducer(
  state = {
    packageId: "",
  },
  action
) {
  switch (action.type) {
    case CONSTANT.PACKAGE_ID_CUSTOMER:
      return { ...state, packageId: action.payload };
    default:
      return state;
  }
}
export default PackageReducer;
