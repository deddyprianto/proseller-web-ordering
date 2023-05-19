import loadable from '@loadable/component';

export default loadable(() =>
  import(
    /* webpackChunkName: "image-container"  webpackPreload: true */ './ImageContainer'
  )
);
