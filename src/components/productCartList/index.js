import loadable from '@loadable/component';

export default loadable(() =>
  import(/* webpackChunkName: "product-cart-list" */ './ProductCartList')
);
