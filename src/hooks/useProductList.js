import { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';

export default function useProductList({
  pageNumber,
  selectedCategory,
  outlet,
}) {
  let url = config.getUrlProduct();
  const OUTLET_ID = outlet.id;
  const categoryID = selectedCategory.id;
  const PRESET_TYPE = config.prefix === 'emenu' ? 'eMenu' : 'webOrdering';
  let presetType = PRESET_TYPE;
  if (selectedCategory.presetType) {
    presetType = selectedCategory.presetType;
  }

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  if (categoryID !== categoryID) {
    console.log('gaksama');
  } else {
    console.log('sama');
  }
  useEffect(() => {
    if (OUTLET_ID && categoryID) {
      setLoading(true);
      setError(false);
      axios({
        method: 'POST',
        url: `${url}productpreset/loaditems/${presetType}/${OUTLET_ID}/${categoryID}`,
        params: { page: pageNumber },
      })
        .then((res) => {
          setHasMore(res.data.data.length > 0);
          setLoading(false);
          setProducts((prevBooks) => {
            if (hasMore) {
              return [...new Set([...prevBooks, ...res.data.data])];
            } else {
              return [...new Set([...res.data.data])];
            }
          });
        })
        .catch((e) => {
          setError(true);
        });
    }
  }, [pageNumber, OUTLET_ID, categoryID]);

  return { loading, error, products, hasMore };
}
