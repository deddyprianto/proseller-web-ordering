import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from '../style/styles.module.css';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useSelector } from 'react-redux';

const SearchBar = ({
  color,
  setShowSearchBar,
  productServicesAppointment,
  setIsOpenModalDetail,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [cutPrice, setCutPrice] = useState(false);
  const filteredData = productServicesAppointment.filter((item) => {
    const lowerCaseTitle = item.name.toLowerCase();
    return lowerCaseTitle.includes(searchValue);
  });
  // selectors
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);

  // some function
  const handleCurrency = (price) => {
    if (price) {
      const result = price.toLocaleString(companyInfo.currency.locale, {
        style: 'currency',
        currency: companyInfo?.currency.code,
      });

      return result;
    }
  };

  const localStyle = {
    container: {
      width: '100%',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 18px 0px',
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
      },
      label2: { fontSize: '13px', color: 'rgba(183, 183, 183, 1)' },
    },
    gridContainerBottom: {
      display: 'grid',
      gridTemplateColumns: '100px 1fr 80px',
      gridTemplateRows: '1fr',
      gap: '0px 0px',
      gridAutoFlow: 'row',
      gridTemplateAreas: '". . ."',
      marginTop: '15px',
    },
    subContainerGrid: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    label30mins: {
      fontSize: '13px',
      marginLeft: '5px',
      color: color.primary,
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
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      labelButton: {
        width: '60px',
        borderRadius: '5px',
        fontSize: '12px',
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
  const RenderResultSearch = ({ item }) => {
    if (item.orderingStatus === 'UNAVAILABLE') {
      return (
        <div style={localStyle.container}>
          <div style={{ display: 'flex' }}>
            <div style={localStyle.containerImg}>
              <img
                src={item?.defaultImageURL}
                style={{ borderRadius: '10px' }}
              />
            </div>
            <div style={localStyle.containerUnavailable}>
              <div style={localStyle.containerUnavailable.labelTitle}>
                Finishing Short Hair Cut Title Goes Here ...
              </div>
              <div style={localStyle.containerUnavailable.labelSubTitle}>
                Cutting Short hair description if any can goes here for example
              </div>
            </div>
          </div>
          <div style={localStyle.containerUnavailable.gridContainer}>
            <div style={localStyle.containerUnavailable.button}>
              <AccessTimeIcon sx={{ color: 'white' }} />
              <div style={localStyle.containerUnavailable.label}>30 mins</div>
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
                {/* {props.check && (
                  <CheckCircleIcon sx={localStyle.containerLabel.icon} />
                )} */}
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
                      fontSize: '14px',
                      color: 'rgba(183, 183, 183, 1)',
                      fontWeight: 500,
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
              <AccessTimeIcon sx={{ color: color.primary }} />
              <div style={localStyle.label30mins}>30 mins</div>
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
                  {handleCurrency(item.retailPrice)}
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
                BOOK
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={fontStyles.myFont} style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '50px 1fr',
          gridTemplateRows: '1fr',
          gridAutoFlow: 'row',
          gridTemplateAreas: '". ."',
          opacity: 0.7,
          alignItems: 'center',
          margin: '20px 0px',
        }}
      >
        <ArrowBackIosIcon
          sx={{ justifySelf: 'center', color: color.primary }}
          fontSize='large'
          onClick={() => {
            setShowSearchBar(false);
          }}
        />
        <div
          style={{
            width: '95%',
            border: '1px solid rgba(183, 183, 183, 1)',
            borderRadius: '5px',
            padding: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder='Type anything...'
            style={{
              outline: 'none',
              width: '80%',
              border: 'none',
              borderRadius: '5px',
              fontSize: '12px',
            }}
          />

          {searchValue && <CloseIcon onClick={() => setSearchValue('')} />}
        </div>
      </div>
      {searchValue && (
        <div style={{ width: '90%', margin: 'auto' }}>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(183, 183, 183, 1)',
              marginTop: '20px',
            }}
          >
            Search result for "{`${searchValue}`}"
          </p>
          {filteredData.map((item) => (
            <RenderResultSearch key={item.name} item={item.product} />
          ))}
        </div>
      )}
      <div style={{ color: 'rgba(183, 183, 183, 1)', margin: '0px 20px' }}>
        ex name services: test product
      </div>
    </div>
  );
};

export default SearchBar;
