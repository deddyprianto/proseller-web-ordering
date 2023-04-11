import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OrderAction } from 'redux/actions/OrderAction';
import LoaderSkleton from './LoaderSkleton';
import defaultImageURL from 'assets/images/iconPro1.png';
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
            width: '93%',
            margin: 'auto',
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
              flexWrap: 'wrap',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
            }}
          >
            {staffServices.map((item) => (
              <div
                key={item.id}
                onClick={() => setIsActiveStylist(item.name)}
                style={{
                  width: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    isActiveStylist === item.name && color.primary,
                  color: isActiveStylist === item.name ? 'white' : 'black',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '14px',
                  opacity: !item.isAvailable && 0.3,
                  pointerEvents: !item.isAvailable && 'none',
                  cursor: !item.isAvailable ? 'not-allowed' : 'pointer',
                  marginTop: '15px',
                }}
              >
                <img
                  src={item.image ? item.image : defaultImageURL}
                  style={{
                    borderRadius: '10px',
                    width: '40px',
                    height: '36px',
                    marginRight: '10px',
                  }}
                  alt='logo'
                />
                <div style={{ lineHeight: '18px' }}>{item.name}</div>
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
      {isLoading ? <LoaderSkleton /> : <RenderStylistStaff />}
    </React.Fragment>
  );
};

export default ServiceStylist;
