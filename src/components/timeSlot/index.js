import loadable from '@loadable/component';

export default loadable(() =>
  import(/* webpackChunkName: "time-slot-dialog" */ './TimeSlot')
);
