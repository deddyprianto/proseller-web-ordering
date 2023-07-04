import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HistoryAction } from 'redux/actions/HistoryAction';

export default function useHistoryTransaction({ take, skip, pageNumber }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
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
              return [
                ...new Map(
                  [...prevTransaction, ...response.data].map((item) => [
                    item['id'],
                    item,
                  ])
                ).values(),
              ];
            } else {
              return [...new Set([...response.data])];
            }
          });
        }

        if (response.data.length === 0) {
          setIsEmptyData(true);
        }

        const totalPage = Math.ceil(response.dataLength / take);
        response.data.length
          ? setHasMore(totalPage > pageNumber)
          : setHasMore(false);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  return { historyTransaction, loading, error, hasMore, isEmptyData };
}
