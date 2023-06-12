import { isEmptyArray } from 'helpers/CheckEmpty';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { OrderAction } from 'redux/actions/OrderAction';

export default function useHistoryAppointment({
  take,
  skip,
  pageNumber,
  tabNameAPI,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [historyAppointment, setHistoryAppointment] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isEmptyData, setIsEmptyData] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let response = await dispatch(
          OrderAction.getBooikingHistory({
            take,
            skip,
            categoryBookingName: tabNameAPI,
            pageNumber,
          })
        );

        if (!isEmptyArray(response.data)) {
          setHistoryAppointment((prevTransaction) => {
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
        console.log(response.data);
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
  }, [skip, pageNumber]);

  return { historyAppointment, loading, error, hasMore, isEmptyData };
}
