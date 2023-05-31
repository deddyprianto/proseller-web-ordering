import { useEffect, useState } from 'react';

const useImageAspectRatio = (src) => {
  const [imageAspectRatio, setImageAspectRatio] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const { width, height } = image;
      const aspectRatio = width / height;
      setImageAspectRatio(aspectRatio);
    };
  }, [src]);

  return imageAspectRatio;
};

export default useImageAspectRatio;
