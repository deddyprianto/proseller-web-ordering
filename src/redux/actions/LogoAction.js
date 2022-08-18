import { CONSTANT } from '../../helpers';

export const getLogoInfo = (logo) => (dispatch) => {
  dispatch({
    type: CONSTANT.SET_LOGO,
    payload: logo,
  });
};
