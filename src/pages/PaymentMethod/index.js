import loadable from '@loadable/component';

export default loadable(() =>
  import(/* webpackChunkName: "payment-method-page" */ './PaymentMethod')
);
