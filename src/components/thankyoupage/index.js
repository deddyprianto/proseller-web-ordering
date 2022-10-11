import loadable from '@loadable/component';

export default loadable(() =>
  import(/* webpackChunkName: "point-add-modal" */ './ThankYoutPage')
);
