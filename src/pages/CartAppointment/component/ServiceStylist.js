import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrderAction } from 'redux/actions/OrderAction';
import LoaderSkeleton from './LoaderSkeleton';
import defaultImageURL from 'assets/images/defaultPicStylist.png';
import { CONSTANT } from 'helpers';

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
                  backgroundColor: isActiveStylist === item.id && color.primary,
                  color: isActiveStylist === item.id ? 'white' : 'black',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '14px',
                  opacity: !item.isAvailable && 0.3,
                  pointerEvents: !item.isAvailable && 'none',
                  cursor: !item.isAvailable ? 'not-allowed' : 'pointer',
                }}
              >
                <img
                  src={item.image ? item.image : defaultImageURL}
                  style={{
                    borderRadius: '10px',
                    width: '36px',
                    height: '36px',
                    marginRight: '10px',
                  }}
                  alt='logo'
                />
                <div>{item.name}</div>
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
