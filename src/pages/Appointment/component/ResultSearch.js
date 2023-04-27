import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DetailAppointment from './DetailAppointment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ResultSearch = ({ item, id, isCheckedService }) => {
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
        padding: '10px 0px',
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
        marginLeft: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: item?.duration && `${color.primary}10`,
        borderRadius: '15px',
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
            }}
          >
            <div style={localStyle.containerImg}>
              <img
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
                    }}
                  >
                    Cutting Short hair description if any can goes here for
                    example
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div style={localStyle.containerUnavailable.gridContainer}>
            <div style={localStyle.containerUnavailable.button}>
              {item?.duration && <AccessTimeIcon sx={{ color: 'white' }} />}
              <div style={localStyle.containerUnavailable.label}>
                {convertTimeToStr(item?.duration)}
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
                    }}
                  >
                    Cutting Short hair description if any can goes here for
                    example
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div style={localStyle.gridContainerBottom}>
            <div style={localStyle.subContainerGrid}>
              {item?.duration && (
                <AccessTimeIcon
                  sx={{ color: color.primary, padding: 0, margin: 0 }}
                />
              )}
              <div style={localStyle.label30mins}>
                {convertTimeToStr(item?.duration)}
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
