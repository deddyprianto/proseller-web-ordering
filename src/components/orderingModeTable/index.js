import loadable from '@loadable/component';

export default loadable(() =>
  import(/* webpackChunkName: "ordering-mode-dialog" */ './OrderingTableDialog')
);
