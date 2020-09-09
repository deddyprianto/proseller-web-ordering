import { CONSTANT } from '../../helpers';

const defaultState = {};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case CONSTANT.DATA_PRODUCT:
            return Object.assign({}, state, {
                product: action.data
            });
            case 'FETCH_COMPANY':
                return { ...state, data: {}, isFetching: true };
              case 'FETCH_COMPANY_SUCCESS':
                return {
                  ...state,
                  data: action.payload,
                  isFetching: false,
                  errors: false
                };
              case 'FETCH_COMPANY_FAILED':
                return { ...state, isFetching: false, errors: true };
        default:
            return state;
    }
}