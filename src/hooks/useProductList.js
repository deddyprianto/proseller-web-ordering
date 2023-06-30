import { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';

export default function useProductList({
  pageNumber,
  selectedCategory,
  outlet,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  let url = config.getUrlProduct();
  const OUTLET_ID = outlet.id;
  const categoryID = selectedCategory.id;
  const PRESET_TYPE = config.prefix === 'emenu' ? 'eMenu' : 'webOrdering';
  let presetType = PRESET_TYPE;
  if (selectedCategory.presetType) {
    presetType = selectedCategory.presetType;
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
          setProducts((prevBooks) => {
            if (hasMore && pageNumber > 1) {
              return [...new Set([...prevBooks, ...res.data.data])];
            } else {
              return [...new Set([...res.data.data])];
            }
          });
          setHasMore(res.data.data.length > 0);
          setLoading(false);
        })
        .catch((e) => {
          setError(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, OUTLET_ID, categoryID]);

  return { loading, error, products, hasMore };
}
