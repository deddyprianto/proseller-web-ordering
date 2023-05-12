import React, { useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import { isEmptyArray } from 'helpers/CheckEmpty';
import DetailAppointment from 'pages/Appointment/component/DetailAppointment';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { OrderAction } from 'redux/actions/OrderAction';
import { useHistory } from 'react-router-dom';
import { IconDelete, IconList } from './icons/Icons';
import calendarIcon from 'assets/images/calendarIcon.png';

const ItemServiceCart = ({
  item,
  setIsLoading,
  outletID,
  settingAppoinment,
  selectedLocation,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);

  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  const color = useSelector((state) => state.theme.color);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  // some fn
  const convertTimeToStr = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}mins` : '60mins';
    } else if (minutes > 0) {
      return `${minutes}mins`;
    } else {
      return '';
    }
  };
  const handleCurrency = (price) => {
    if (price) {
      const result = price.toLocaleString(companyInfo?.currency?.locale, {
        style: 'currency',
        currency: companyInfo?.currency?.code,
      });

      return result;
    }
  };
  const styleSheet = {
    container: {
      width: '45%',
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: 'white',
      height: '92vh',
      borderRadius: '8px',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 85px',
      gap: '0px 15px',
      gridTemplateAreas: '"."\n    "."',
      overflowY: 'auto',
    },
    gridStyle: {
      display: 'grid',
      gridTemplateColumns: '50px 1fr 50px',
      gridTemplateRows: '1fr',
      gap: '0px 0px',
      gridAutoFlow: 'row',
      gridTemplateAreas: '". . ."',
      cursor: 'pointer',
    },
    paper: {
      maxHeight: 500,
      overflow: 'auto',
      backgroundColor: 'white',
    },
    categoryName: {
      color: 'gray',
      fontSize: '15px',
      fontWeight: 500,
      textTransform: 'capitalize',
    },
    muiSelected: {
      '&.MuiButtonBase-root': {
        fontSize: '14px',
        textTransform: 'capitalize',
      },
      '&.Mui-selected': {
        color: color.primary,
        fontSize: '14px',
        textTransform: 'capitalize',
      },
      '&.MuiTab-labelIcon': {
        fontSize: '14px',
        textTransform: 'capitalize',
      },
    },
    indicator: {
      '& .MuiTabScrollButton-root': {
        padding: 0,
        margin: 0,
        width: 15,
      },
      '& .MuiTabs-indicator': {
        backgroundColor: color.primary,
      },
    },
    indicatorForMobileView: {
      '& .MuiTabs-indicator': {
        backgroundColor: color.primary,
      },
    },
    inputDropdown: {
      '&.MuiSelect-select': {
        border: 'none',
      },
    },
  };

  const handleDeleteCart = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You sure to delete this Service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let payload = {
          outletId: `outlet::${outletID.id}`,
          item: {
            productId: item.productID,
            quantity: 0,
          },
        };
        setIsLoading(true);
        await dispatch(OrderAction.deleteItemAppointment(payload, item.id));
        if (cartAppointment?.details.length === 1) {
          history.push('/appointment');
        }
        setIsLoading(false);
      }
    });
  };

  const RenderAddOn = ({ modifier }) => {
    if (!isEmptyArray(modifier)) {
      return modifier.map((item) => {
        return item.modifier.details.map((itemModifier) => (
          <ul
            style={{
              padding: 0,
              margin: 0,
              listStyleType: 'none',
            }}
          >
            <li
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 140px 1fr',
                gridTemplateRows: '1fr',
                gap: '0px',
                gridAutoFlow: 'row',
                gridTemplateAreas: '". . ."',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  justifySelf: 'end',
                  paddingRight: '8px',
                  marginTop: '-2px',
                }}
              >
                <IconList />
              </div>
              <div style={{ color: 'black' }}>{itemModifier.name}</div>
              <div
                style={{
                  justifySelf: 'center',
                  marginLeft: '17px',
                  color: 'black',
                }}
              >
                {settingAppoinment &&
                  `+${handleCurrency(itemModifier.retailPrice)}`}
              </div>
            </li>
          </ul>
        ));
      });
    } else {
      return null;
    }
  };

  return (
    <React.Fragment>
      <div
        key={item.id}
        style={{
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          padding: '10px 5px',
          borderRadius: '10px',
          margin: '16px 0px',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 200px 1fr',
            gridTemplateRows: '1fr',
            gap: '0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . ."',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '80%',
              margin: 'auto',
              display: 'flex',
              justifyContent: 'center',
              height: '50px',
            }}
          >
            <img
              src={
                item?.product.defaultImageURL
                  ? item?.product.defaultImageURL
                  : calendarIcon
              }
              style={{ borderRadius: '10px', height: '55px' }}
              alt='logo'
            />
          </div>
          <div
            style={{
              fontSize: '14px',
              marginLeft: '10px',
            }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                width: '90%',
                color: 'black',
              }}
            >
              {item?.product.name}
            </div>
            {!isEmptyArray(item?.modifiers) && (
              <div>
                <p
                  style={{
                    color: 'rgba(183, 183, 183, 1)',
                    padding: 0,
                    margin: 0,
                    fontWeight: 600,
                  }}
                >
                  Add Ons
                </p>
              </div>
            )}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 500, color: 'black' }}>
            {settingAppoinment && handleCurrency(item?.product.retailPrice)}
          </div>
        </div>
        <RenderAddOn modifier={item?.modifiers} />
        <hr
          style={{
            backgroundColor: 'rgba(249, 249, 249, 1)',
            marginTop: '15px',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: color.primary,
            fontWeight: 500,
            width: '96%',
            margin: 'auto',
            fontSize: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              backgroundColor: `${color.primary}10`,
              borderRadius: '10px',
              padding: '0px 7px',
            }}
          >
            {item?.duration && <AccessTimeIcon sx={{ fontSize: '20px' }} />}
            <div
              style={{
                fontSize: '13px',
                marginLeft: '5px',
                color: color.primary,
                display: 'flex',
              }}
            >
              {convertTimeToStr(item?.duration)}
            </div>
          </div>
          <div>{settingAppoinment && handleCurrency(item?.grossAmount)}</div>
        </div>
        <hr
          style={{
            backgroundColor: 'rgba(249, 249, 249, 1)',
            marginTop: '15px',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: color.primary,
            fontWeight: 500,
            width: '90%',
            margin: 'auto',
            fontSize: '14px',
          }}
        >
          <div
            onClick={handleDeleteCart}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '5px',
              }}
            >
              <IconDelete color={color.primary} />
            </div>
            <div style={{ fontWeight: 600 }}>DELETE</div>
          </div>
          <div
            onClick={() => setIsOpenModalDetail(true)}
            style={{
              border: `1px solid ${color.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color.primary,
              width: '87px',
              borderRadius: '10px',
              padding: '5px',
            }}
          >
            <EditIcon sx={{ marginRight: '5px' }} />
            <p style={{ margin: 0, padding: 0, fontWeight: 600 }}>EDIT</p>
          </div>
        </div>
      </div>

      <DetailAppointment
        selectedLocation={selectedLocation}
        itemAppointment={item.product}
        productId={item.productID}
        styleSheet={styleSheet}
        color={color}
        handleCurrency={handleCurrency}
        setIsOpenModalDetail={setIsOpenModalDetail}
        convertTimeToStr={convertTimeToStr}
        isOpenModalDetail={isOpenModalDetail}
      />
    </React.Fragment>
  );
};

export default ItemServiceCart;
