import React from 'react';
import { useState } from 'react';

import useStyles from './styles';

/**
 * Component used to render image with auto sizing based on it's orientation.
 *
 * @component
 */
const ImageContainer = ({ image, ...props }) => {
  const [isLandscape, setIsLandscape] = useState(true);
  console.log('ImageContainer isLandscape', isLandscape);

  const styles = useStyles({ isLandscape });

  const handleOnImageLoad = (e) => {
    const { offsetHeight, offsetWidth } = e.target;
    if (offsetHeight > offsetWidth) {
      setIsLandscape(false);
    }
  };

  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src={image}
        alt=''
        onLoad={handleOnImageLoad}
        {...props}
      ></img>
    </div>
  );
};

export default ImageContainer;
