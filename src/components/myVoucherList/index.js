import loadable from '@loadable/component';

export default loadable(() =>
  import(/* webpackChunkName: "my-voucher-list" */ './MyVoucherList')
);
