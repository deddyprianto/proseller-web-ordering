import { CONSTANT } from "../../helpers";
import { MasterDataService } from "../../Services/MasterDataService";

export const PromotionAction = {
  fetchPromotion,
};

function fetchPromotion() {
  return dispatch => {
    MasterDataService.api('POST', null, 'promobanners/load')
    .then(data => {
      dispatch(setBanners(data))
    });
  }
}

function setBanners(data) {
  return {
    type: CONSTANT.KEY_PROMOTION,
    data: data.data,
  };
}
