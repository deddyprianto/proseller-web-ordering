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
        if (pageNumber === 1) {
          setHasMore(false);
        }
        setLoading(true);
        let response = await dispatch(
          OrderAction.getBooikingHistory({
            take,
            skip,
            categoryBookingName: tabNameAPI,
          })
        );
        console.log(hasMore);
        if (!isEmptyArray(response.data)) {
          setHistoryAppointment((prevAppointment) => {
            if (hasMore) {
              console.log('1');
              return [
                ...new Map(
                  [...prevAppointment, ...response.data].map((item) => [
                    item['id'],
                    item,
                  ])
                ).values(),
              ];
            } else {
              console.log('2');
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
  }, [skip, pageNumber, tabNameAPI]);

  return { historyAppointment, loading, error, hasMore, isEmptyData };
}
