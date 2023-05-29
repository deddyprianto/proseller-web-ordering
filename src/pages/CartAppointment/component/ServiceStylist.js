import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrderAction } from 'redux/actions/OrderAction';
import LoaderSkeleton from './LoaderSkeleton';
import defaultImageURL from 'assets/images/defaultPicStylist.png';
import { CONSTANT } from 'helpers';
import useImageAspectRatio from 'hooks/useImageAspectRatio';

const ServiceStylist = ({ color }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveStylist, setIsActiveStylist] = useState('');

  const date = useSelector((state) => state.appointmentReducer.date);
  const time = useSelector((state) => state.appointmentReducer.time);
  const staffServices = useSelector(
    (state) => state.appointmentReducer.staffServices
  );

  useEffect(() => {
    if (!isActiveStylist) {
      dispatch({
        type: CONSTANT.STAFFID_APPOINTMENT,
        payload: '',
      });
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await dispatch(OrderAction.loadStaffByTimeSlot(date, time));
        setIsLoading(false);
        setIsActiveStylist('');
      } catch (error) {
        console.log(error);
      }
    };
    if (date && time) {
      loadData();
    }
  }, [date, time]);

  const StylistAvatar = ({ item }) => {
    const isOneToOne = useImageAspectRatio(item.image);

    return (
      <img
        src={item.image & isOneToOne ? item.image : defaultImageURL}
        style={{
          borderRadius: '10px',
          width: '36px',
          height: '36px',
          marginRight: '10px',
          opacity: !item.isAvailable && 0.5,
          objectFit: 'contain',
        }}
        alt='logo'
      />
    );
  };

  const RenderStylistStaff = () => {
    if (date && time) {
      return (
        <div
          style={{
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <p style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
            Select Stylist
          </p>
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridAutoRows: '1fr',
              gridAutoFlow: 'row',
              fontWeight: 500,
              gridGap: '16px',
            }}
          >
            {staffServices.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  dispatch({
                    type: CONSTANT.STAFFID_APPOINTMENT,
                    payload: { id: item.id, name: item.name },
                  });
                  setIsActiveStylist(item.id);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor:
                    isActiveStylist === item.id ? color.primary : '#F9F9F9',
                  color: isActiveStylist === item.id ? 'white' : 'black',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '14px',
                  boxShadow:
                    isActiveStylist === item.id &&
                    '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  pointerEvents: !item.isAvailable && 'none',
                  cursor: !item.isAvailable ? 'not-allowed' : 'pointer',
                }}
              >
                <StylistAvatar item={item} />
                <div
                  style={{
                    color: !item.isAvailable && '#B7B7B7',
                    lineHeight: '21px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item?.name?.length < 24
                    ? item.name
                    : item.name?.substr(0, 24) + '...'}
                </div>
              </div>
            ))}
          </div>
          <hr
            style={{
              backgroundColor: 'rgba(249, 249, 249, 1)',
              margin: '20px 0px',
            }}
          />
        </div>
      );
    } else {
      return null;
    }
  };
  return (
    <React.Fragment>
      {isLoading ? <LoaderSkeleton /> : <RenderStylistStaff />}
    </React.Fragment>
  );
};

export default ServiceStylist;
