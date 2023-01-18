import axios from 'axios';
import useSWRInfinite from 'swr/infinite';

const getKey = (pageIndex, previousPageData) => {
  console.log('%cdedd =>', 'color: green;', previousPageData);
  pageIndex = pageIndex + 20;
  if (previousPageData && !previousPageData.length) return null;
  return `https://api-pink-city.proseller-demo.com/product/api/productpreset/loaditems/webOrdering/2d78d587-c36d-4083-86ec-96878d5cca6c/e73e0f7c-9aa3-4623-a2d7-e3503a2f9656?skip=0&take=${pageIndex}`; // SWR key
};

export const useProductList = () => {
  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher, {
    initialSize: 10,
  });

  return {
    productsItem: data,
    isLoading: !error && !data,
    isError: error,
    size: size,
    setSize: setSize,
  };
};
