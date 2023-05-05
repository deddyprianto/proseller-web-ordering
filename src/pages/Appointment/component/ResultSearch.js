import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DetailAppointment from './DetailAppointment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import screen from 'hooks/useWindowSize';
import filterImage from '../style/styles.module.css';

const ResultSearch = ({ item, id, isCheckedService }) => {
  const responsiveDesign = screen();
  const gadgetScreen = responsiveDesign.width < 980;
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const setting = useSelector((state) => state.order.setting);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);
  const color = useSelector((state) => state.theme.color);

  // some fn
  const settingAppoinment = setting.find((items) => {
    return items.settingKey === 'ShowServicePrice';
  });
  const convertTimeToStr = (seconds) => {
    // Calculate the number of hours and minutes
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    // Create the formatted string
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else if (minutes > 0) {
      return `${minutes}min`;
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
  const RenderResult = () => {
    const localStyle = {
      container: {
        width: '100%',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '15px',
      },
      containerImg: {
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: '5px',
        marginTop: '5px',
        width: '100%',
        height: '50px',
      },
      containerLabel: {
        padding: '0px 10px',
        container: {
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          width: '100%',
        },
        icon: {
          fontSize: '20px',
          marginTop: '5px',
          color: color.primary,
          marginRight: '5px',
        },
        label: {
          width: '230px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '14px',
          fontWeight: 700,
          color: 'black',
        },
        label2: { fontSize: '13px', color: 'rgba(183, 183, 183, 1)' },
      },
      gridContainerBottom: {
        display: 'grid',
        gridTemplateColumns: '130px 1fr 90px',
        gridTemplateRows: '1fr',
        gap: '0px 0px',
        gridAutoFlow: 'row',
        gridTemplateAreas: '". . ."',
        marginTop: '15px',
      },
      subContainerGrid: {
        width: '100%',
      },
      label30mins: {
        fontSize: '13px',
        marginLeft: '5px',
        color: color.primary,
        display: 'flex',
      },
      containerCutPrice: {
        justifySelf: 'end',
        display: 'flex',
        fontSize: '14px',
        labelPrice: { fontWeight: 600, color: color.primary },
        labelCutPrice: {
          marginLeft: '5px',
          textDecorationLine: 'line-through',
          opacity: 0.5,
          fontWeight: 600,
        },
      },
      containerPrice: {
        justifySelf: 'end',
        fontSize: '14px',
        labelPrice: { fontWeight: 600, color: color.primary },
      },
      button: {
        justifySelf: 'center',
        width: '90%',
        display: 'flex',
        justifyContent: 'center',
        labelButton: {
          width: '100%',
          borderRadius: '5px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'white',
        },
      },
      containerUnavailable: {
        padding: '0px 10px',
        labelTitle: {
          fontSize: '13px',
          fontWeight: '600',
        },
        labelSubTitle: {
          fontSize: '13px',
          color: 'rgba(183, 183, 183, 1)',
        },
        button: {
          display: 'flex',
          alignItems: 'center',
          marginLeft: '6px',
          backgroundColor: 'rgb(94, 94, 94)',
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
          marginRight: '10px',
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
              gridTemplateColumns: '70px 1fr',
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
                src={item.defaultImageURL}
                style={{ borderRadius: '10px' }}
              />
            </div>
            <div style={localStyle.containerUnavailable}>
              <div style={localStyle.containerUnavailable.labelTitle}>
                {item.name}
              </div>
              <table>
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
              </table>
            </div>
          </div>
          <div style={localStyle.containerUnavailable.gridContainer}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: item?.duration
                  ? 'rgba(183, 183, 183, 1)'
                  : 'transparent',
                borderRadius: '15px',
                width: '60%',
              }}
            >
              {item?.duration && (
                <HistoryTimeIcon color='rgba(255, 255, 255, 1)' />
              )}
              <div
                style={{
                  fontSize: '13px',
                  marginLeft: '5px',
                  color: 'rgba(255, 255, 255, 1)',
                  display: 'flex',
                  fontWeight: 500,
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
              gridTemplateColumns: '70px 1fr',
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
                src={item.defaultImageURL}
                style={{
                  borderRadius: '10px',
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
              </table>
            </div>
          </div>
          <div style={localStyle.gridContainerBottom}>
            <div style={localStyle.subContainerGrid}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: item.duration && `${color.primary}10`,
                  borderRadius: '15px',
                  width: '75%',
                }}
              >
                {item.duration && <HistoryTimeIcon color={color.primary} />}
                <div style={localStyle.label30mins}>
                  {item?.duration && (
                    <div>{convertTimeToStr(item.duration)}</div>
                  )}
                </div>
              </div>
            </div>
            {item?.cutPrice ? (
              <div style={localStyle.containerCutPrice}>
                <div style={localStyle.containerCutPrice.labelPrice}>
                  SGD 10.00
                </div>
                <div style={localStyle.containerCutPrice.labelCutPrice}>
                  SGD 10.00
                </div>
              </div>
            ) : (
              <div style={localStyle.containerPrice}>
                <div style={localStyle.containerPrice.labelPrice}>
                  {settingAppoinment?.settingValue &&
                    handleCurrency(item.retailPrice)}
                </div>
              </div>
            )}
            <div style={localStyle.button}>
              <button
                onClick={() => {
                  setIsOpenModalDetail(true);
                }}
                style={localStyle.button.labelButton}
              >
                {isCheckedService ? 'UPDATE' : 'BOOK'}
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <React.Fragment>
      <RenderResult />
      <DetailAppointment
        itemAppointment={item}
        productId={id}
        styleSheet={styleSheet}
        color={color}
        handleCurrency={handleCurrency}
        setIsOpenModalDetail={setIsOpenModalDetail}
        isOpenModalDetail={isOpenModalDetail}
        convertTimeToStr={convertTimeToStr}
        settingAppoinment={settingAppoinment?.settingValue}
      />
    </React.Fragment>
  );
};

export default ResultSearch;
