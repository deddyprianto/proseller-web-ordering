import loadable from '@loadable/component';

export default loadable(() =>
  import(/* webpackChunkName: "svc-page" */ './SVCPage')
);
