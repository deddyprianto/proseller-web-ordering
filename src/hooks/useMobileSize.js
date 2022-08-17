import { useState, useLayoutEffect } from 'react';

export default function useMobileSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  if (size.width < 640) {
    return true;
  } else {
    return false;
  }
}
