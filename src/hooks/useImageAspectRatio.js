import { useEffect, useState } from 'react';

const useImageAspectRatio = (src) => {
  const [isOneToOne, setIsOneToOne] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const { width, height } = image;
      const aspectRatio = width / height;
      setIsOneToOne(aspectRatio === 1);
    };
  }, [src]);

  return isOneToOne;
};

export default useImageAspectRatio;
