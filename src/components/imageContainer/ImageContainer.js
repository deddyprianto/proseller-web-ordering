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
        srcSet={`${image} 300w, ${image} 768w, ${image} 1280w`}
        sizes='(max-width: 300px) 300px, (max-width: 768px) 768px, 1280px'
        alt=''
        onLoad={handleOnImageLoad}
        width={640}
        height={360}
        {...props}
      ></img>
    </div>
  );
};

export default ImageContainer;
