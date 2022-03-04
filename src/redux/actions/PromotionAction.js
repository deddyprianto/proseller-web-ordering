import { CONSTANT } from '../../helpers';
import { MasterDataService } from '../../Services/MasterDataService';

function setBanners(data) {
  return {
    type: CONSTANT.KEY_PROMOTION,
    data: data.data,
  };
}

function fetchPromotion() {
  return (dispatch) => {
    MasterDataService.api('POST', null, 'promobanners/load').then((data) => {
      dispatch(setBanners(data));
    });
  };
}

export const PromotionAction = {
  fetchPromotion,
};
