import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HistoryAction } from 'redux/actions/HistoryAction';

export default function useHistoryTransaction({ take, skip, pageNumber }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [historyTransaction, setHistoryTransaction] = useState([]);
  const [hasMore, setHasMore] = useState(false);

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
          setHistoryTransaction(response.data);
        }
        setLoading(false);
        setHasMore(response.data.length > 0);
      } catch (error) {
        setError(error);
      }
    };
    loadData();
  }, [skip, pageNumber]);

  return { historyTransaction, loading, error, hasMore };
}
