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

  const styles = useStyles({ isLandscape });

  const handleOnImageLoad = (e) => {
    console.log(e.target);
    const { offsetHeight, offsetWidth } = e.target;
    console.log(offsetHeight, offsetWidth);
    if (offsetHeight > offsetWidth) {
      setIsLandscape(false);
    } else {
      setIsLandscape(false);
    }
  };

  return (
    <div className={styles.container}>
      <img src={image} alt='' {...props} onLoad={handleOnImageLoad}></img>
    </div>
  );
};

export default ImageContainer;
