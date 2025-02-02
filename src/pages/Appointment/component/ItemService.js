import React, { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector } from 'react-redux';
import DetailAppointment from './DetailAppointment';
import filterImage from '../style/styles.module.css';
import calendarIcon from 'assets/images/calendarIcon.png';
import { convertTimeToStr } from 'helpers/appointmentHelper';

const HistoryTimeIcon = ({ color }) => {
  return (
    <svg
      width={18}
      height={19}
      viewBox='0 0 18 19'
      fill={color}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M9 2.75C5.27208 2.75 2.25 5.77208 2.25 9.5C2.25 13.2279 5.27208 16.25 9 16.25C12.7279 16.25 15.75 13.2279 15.75 9.5C15.75 5.77208 12.7279 2.75 9 2.75ZM0.75 9.5C0.75 4.94365 4.44365 1.25 9 1.25C13.5563 1.25 17.25 4.94365 17.25 9.5C17.25 14.0563 13.5563 17.75 9 17.75C4.44365 17.75 0.75 14.0563 0.75 9.5Z'
        fill={color}
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M9 4.25C9.41421 4.25 9.75 4.58579 9.75 5V9.03647L12.3354 10.3292C12.7059 10.5144 12.8561 10.9649 12.6708 11.3354C12.4856 11.7059 12.0351 11.8561 11.6646 11.6708L8.66459 10.1708C8.4105 10.0438 8.25 9.78408 8.25 9.5V5C8.25 4.58579 8.58579 4.25 9 4.25Z'
        fill={color}
      />
    </svg>
  );
};

const RenderItemService = ({
  item,
  localStyle,
  gadgetScreen,
  isCheckedService,
  color,
  settingAppoinment,
  handleCurrency,
  setIsOpenModalDetail,
}) => {
  if (item.orderingStatus === 'UNAVAILABLE') {
    return (
      <div
        style={{
          width: '100%',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '15px',
          backgroundColor: 'rgba(249, 249, 249, 1)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '52px 1fr',
            gridTemplateRows: '1fr',
            gridAutoColumns: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". ."',
          }}
        >
          <div style={localStyle.containerImg}>
            <img
              className={filterImage.filter}
              src={item.defaultImageURL ? item.defaultImageURL : calendarIcon}
              style={{
                borderRadius: '10px',
                width: '48px',
                height: '48px',
                objectFit: 'cover',
              }}
              alt='icon'
            />
          </div>
          <div style={localStyle.containerUnavailable}>
            <div style={localStyle.containerUnavailable.labelTitle}>
              {item.name}
            </div>
            <table>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: '100%',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      padding: 0,
                      margin: 0,
                      fontSize: '12px',
                      color: 'rgba(183, 183, 183, 1)',
                      fontWeight: 500,
                      lineHeight: '18px',
                    }}
                  >
                    {item.description}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style={localStyle.containerUnavailable.gridContainer}>
          <div
            style={{
              width: '60%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: item?.duration
                ? 'rgba(183, 183, 183, 1)'
                : 'transparent',
              borderRadius: '15px',
            }}
          >
            {item?.duration && (
              <HistoryTimeIcon color='rgba(255, 255, 255, 1)' />
            )}
            <div
              style={{
                fontSize:
                  convertTimeToStr(item.duration).length <= 10
                    ? '13px'
                    : '10px',
                fontWeight:
                  convertTimeToStr(item.duration).length <= 10 ? 500 : 'bold',
                marginLeft: '5px',
                color: 'rgba(255, 255, 255, 1)',
                display: 'flex',
              }}
            >
              {item?.duration && <div>{convertTimeToStr(item.duration)}</div>}
            </div>
          </div>
          <div style={localStyle.containerUnavailable.labelNotAvailable}>
            Not Available
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={localStyle.container}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '52px 1fr',
            gridTemplateRows: '1fr',
            gridAutoColumns: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". ."',
            padding: gadgetScreen ? '0px' : '0px 10px',
          }}
        >
          <div style={localStyle.containerImg}>
            <img
              alt='icon'
              src={item.defaultImageURL ? item.defaultImageURL : calendarIcon}
              style={{
                borderRadius: '10px',
                width: '48px',
                height: '48px',
                objectFit: 'cover',
              }}
            />
          </div>
          <div style={localStyle.containerLabel}>
            <div style={localStyle.containerLabel.container}>
              {isCheckedService && (
                <CheckCircleIcon sx={localStyle.containerLabel.icon} />
              )}
              <div style={{ width: '100%' }}>
                <div style={localStyle.containerLabel.label}>{item.name}</div>
              </div>
            </div>
            <table>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: '100%',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      padding: 0,
                      margin: 0,
                      fontSize: '12px',
                      color: 'rgba(183, 183, 183, 1)',
                      fontWeight: 500,
                      lineHeight: '18px',
                    }}
                  >
                    {item.description}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: '15px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: item.duration && `${color.primary}10`,
              borderRadius: '15px',
              width: 'fit-content',
              padding: '0px 10px',
            }}
          >
            {item.duration && <HistoryTimeIcon color={color.primary} />}
            <div
              style={{
                fontSize:
                  convertTimeToStr(item.duration).length <= 10
                    ? '13px'
                    : '10px',
                fontWeight:
                  convertTimeToStr(item.duration).length <= 10 ? 500 : 'bold',
                marginLeft: '5px',
                color: color.primary,
                display: 'flex',
              }}
            >
              {item?.duration && <div>{convertTimeToStr(item.duration)}</div>}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item?.cutPrice ? (
              <div
                style={{
                  display: 'flex',
                  fontSize: item?.cutPrice ? '12px' : '14px',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: color.primary,
                  }}
                >
                  {settingAppoinment && handleCurrency(item.retailPrice)}
                </div>
                <div
                  style={{
                    marginLeft: '5px',
                    textDecorationLine: 'line-through',
                    opacity: 0.5,
                    fontWeight: 600,
                  }}
                >
                  {settingAppoinment && handleCurrency(item?.cutPrice)}
                </div>
              </div>
            ) : (
              <div
                style={{
                  justifySelf: 'end',
                  display: 'flex',
                  fontSize: item?.cutPrice ? '12px' : '14px',
                }}
              >
                <div
                  style={{
                    marginLeft: '5px',
                    textDecorationLine: 'line-through',
                    opacity: 0.5,
                    fontWeight: 600,
                  }}
                >
                  {settingAppoinment && handleCurrency(item.retailPrice)}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setIsOpenModalDetail(true);
              }}
              style={{
                width: '100%',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'white',
                padding: '8px 16px',
                marginLeft: '5px',
              }}
            >
              {isCheckedService ? 'UPDATE' : 'BOOK'}
            </button>
          </div>
        </div>
      </div>
    );
  }
};

const ItemService = ({
  item,
  gadgetScreen,
  styleSheet,
  isCheckedService,
  productId,
  handleCurrency,
  selectedLocation,
  settingAppoinment,
}) => {
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const color = useSelector((state) => state.theme.color);

  const localStyle = {
    container: {
      width: '100%',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '6px',
      padding: '12px',
      marginBottom: '15px',
    },
    containerImg: {
      marginTop: '5px',
      width: '95%',
      height: '50px',
    },
    containerLabel: {
      padding: '0px 10px',
      container: {
        width: '100%',
        fontSize: '13px',
        fontWeight: '600',
        display: 'flex',
      },
      icon: {
        marginRight: '5px',
        fontSize: '20px',
        marginTop: '5px',
        color: color.primary,
      },
      label: {
        color: 'black',
        width: '230px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '14px',
        fontWeight: 700,
      },
      label2: { color: 'rgba(183, 183, 183, 1)', fontSize: '13px' },
    },
    gridContainerBottom: {
      marginTop: '15px',
      display: 'grid',
      gridTemplateColumns: item?.cutPrice ? '90px 1fr 90px' : '1fr 75px 90px',
      gridTemplateRows: '1fr',
      gridAutoFlow: 'row',
      gridTemplateAreas: '". . ."',
      gap: '0px 0px',
      alignItems: 'center',
    },
    containerPrice: {
      justifySelf: 'end',
      fontSize: item?.cutPrice ? '12px' : '16px',
      labelPrice: { fontWeight: 600, color: color.primary },
    },
    containerUnavailable: {
      padding: '0px 10px',
      labelTitle: {
        fontSize: '13px',
        fontWeight: '600',
        color: 'rgba(183, 183, 183, 1)',
      },
      labelSubTitle: {
        fontSize: '13px',
        color: 'rgba(183, 183, 183, 1)',
      },
      button: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '6px',
        backgroundColor:
          Math.floor(item?.duration / 3600) > 0 && 'rgb(94, 94, 94)',
        borderRadius: '16px',
        padding: '0px 10px',
        width: 'fit-content',
        opacity: '.5',
      },
      label: {
        fontSize: '13px',
        marginLeft: '5px',
        color: 'white',
        display: 'flex',
      },
      labelNotAvailable: {
        fontWeight: 500,
        fontSize: '16px',
        justifySelf: 'end',
        color: 'rgba(206, 17, 17, 1)',
      },
      gridContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr',
        gap: '0px 0px',
        gridAutoFlow: 'row',
        gridTemplateAreas: '". . ."',
        marginTop: '15px',
      },
    },
  };

  return (
    <React.Fragment>
      <RenderItemService
        gadgetScreen={gadgetScreen}
        color={color}
        isCheckedService={isCheckedService}
        item={item}
        settingAppoinment={settingAppoinment}
        handleCurrency={handleCurrency}
        setIsOpenModalDetail={setIsOpenModalDetail}
        localStyle={localStyle}
      />
      <DetailAppointment
        selectedLocation={selectedLocation}
        productId={productId}
        handleCurrency={handleCurrency}
        color={color}
        gadgetScreen={gadgetScreen}
        styleSheet={styleSheet}
        setIsOpenModalDetail={setIsOpenModalDetail}
        itemAppointment={item}
        convertTimeToStr={convertTimeToStr}
        isOpenModalDetail={isOpenModalDetail}
        settingAppoinment={settingAppoinment}
      />
    </React.Fragment>
  );
};

export default ItemService;
