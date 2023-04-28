import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HistoryAction } from 'redux/actions/HistoryAction';

export default function useHistoryTransaction({ take, skip, pageNumber }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [historyTransaction, setHistoryTransaction] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let response = await dispatch(
          HistoryAction.getTransaction({
            take,
            skip,
            page: pageNumber,
          })
        );
        if (response.ResultCode === 200) {
          setHistoryTransaction((prevTransaction) => {
            if (hasMore) {
              return [...new Set([...prevTransaction, ...response.data])];
            } else {
              return [...new Set([...response.data])];
            }
          });
        }
        if (response.data.length === 0) {
          setIsEmptyData(true);
        }
        setLoading(false);
        setHasMore(response.dataLength > response.data.length);
      } catch (error) {
        setError(error);
      }
    };
    loadData();
  }, [skip, pageNumber]);

  return { historyTransaction, loading, error, hasMore, isEmptyData };
}
