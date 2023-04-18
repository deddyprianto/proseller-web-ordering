import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import fontStyles from './style/styles.module.css';
import { makeStyles } from '@material-ui/core/styles';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import MagicSliderDots from 'react-magic-slider-dots';
import 'react-magic-slider-dots/dist/magic-dots.css';
import { CONSTANT } from 'helpers';

const OrderingTableDialog = ({
  open,
  onClose,
  defaultOutlet,
  colorState,
  gadgetScreen,
}) => {
  const tableNo = useSelector((state) => state.order.noTable);
  const useStyles = makeStyles(() => ({
    paper: { minWidth: '350px', overflow: 'hidden' },
  }));
  const classes = useStyles();

  const style = {
    dialogContent: {
      '& .MuiDialogContent-root': {
        paddingBottom: 0,
      },
    },
  };
  const dispatch = useDispatch();
  const [isError, setIsError] = useState(false);
  const [isActiveTable, setIsActiveTable] = useState(false);
  const [inputNumberTable, setInputNumberTable] = useState('');
  const [inputLetterTable, setInputLetterTable] = useState('');

  useEffect(() => {
    let isCleanFnComponent = true;
    if (isCleanFnComponent) {
      dispatch({
        type: CONSTANT.NO_TABLE,
        payload: '',
      });
    }
    return () => {
      isCleanFnComponent = false;
    };
  }, []);

  const dataMerchantFinal = [];
  for (let i = 0; i < defaultOutlet.tableNumber?.list.length; i += 20) {
    dataMerchantFinal.push(defaultOutlet.tableNumber?.list.slice(i, i + 20));
  }
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (dots) => {
      return <MagicSliderDots dots={dots} numDotsToShow={4} dotWidth={30} />;
    },
  };

  const DineInIcon = ({ color }) => {
    return (
      <svg
        width='15'
        height='15'
        viewBox='0 0 120 120'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M105.551 16.0838V16.0559L106.025 16V16.0559L105.551 16.0838Z'
          fill='black'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M27.9904 56.5541C28.1413 55.6317 28.2924 54.7076 28.3655 53.7828C25.4807 53.7828 22.5949 53.7689 19.7091 53.7549C16.8231 53.7409 13.937 53.727 11.0518 53.727H6.83511C6.74123 53.727 6.6427 53.7305 6.54176 53.7342C6.04318 53.7521 5.48597 53.7721 5.14142 53.3773C4.93129 53.1366 4.99322 52.8577 5.08513 52.582C5.16301 52.3484 5.24525 52.1161 5.32749 51.8838C5.39331 51.6979 5.45913 51.512 5.52271 51.3254C5.83206 50.4175 6.1528 49.5135 6.47354 48.6094C6.83857 47.5805 7.20361 46.5515 7.55187 45.517C8.6929 42.1272 9.89403 38.7576 11.0952 35.388C12.3575 31.8466 13.6199 28.3053 14.8124 24.7406C15.3463 23.1449 15.9115 21.5573 16.4761 19.9717C16.5233 19.8393 16.5704 19.7069 16.6175 19.5744C16.6595 19.4564 16.6983 19.3189 16.7394 19.1734C16.8905 18.6378 17.0724 17.9933 17.5584 17.8099C17.7277 17.7461 17.9068 17.7605 18.0851 17.7749C18.1613 17.7811 18.2374 17.7872 18.3124 17.7872H19.9041C20.8307 17.7872 21.7576 17.7942 22.6842 17.8012C23.6103 17.8082 24.5362 17.8151 25.4612 17.8151C28.6733 17.8151 31.8852 17.8361 35.0969 17.857C38.3081 17.878 41.519 17.8989 44.7296 17.8989C45.6838 17.8989 46.638 17.8978 47.5922 17.8967C50.771 17.8929 53.9496 17.8892 57.1284 17.927C57.708 17.9338 58.2881 17.9421 58.8686 17.9503C60.8108 17.978 62.7567 18.0056 64.6962 17.9826C68.9116 17.9325 73.1279 17.9296 77.3445 17.9267C81.5618 17.9239 85.7793 17.921 89.9964 17.8709C96.6577 17.7917 103.329 17.7577 109.991 17.7601C110.681 17.7604 110.912 18.5623 111.089 19.1806C111.124 19.303 111.157 19.4182 111.192 19.5186C111.862 21.4871 112.552 23.4515 113.249 25.4108C113.98 27.4624 114.692 29.5205 115.403 31.5786C116.113 33.6298 116.822 35.6811 117.55 37.7258C117.663 38.0431 117.776 38.3603 117.889 38.6776C118.792 41.2114 119.696 43.7484 120.547 46.2989C120.832 47.1546 121.136 48.0043 121.44 48.854C121.744 49.7037 122.048 50.5534 122.334 51.4092C122.399 51.6056 122.469 51.8006 122.539 51.9956C122.608 52.1906 122.678 52.3856 122.743 52.582C122.816 52.7999 122.888 53.0339 122.774 53.252C122.518 53.7425 121.917 53.7347 121.429 53.7284C121.375 53.7277 121.323 53.727 121.273 53.727H117.084C114.147 53.727 111.21 53.7409 108.273 53.7549C105.336 53.7689 102.399 53.7828 99.4631 53.7828C99.5361 54.7076 99.6872 55.6317 99.8381 56.5541C99.9307 57.1204 100.023 57.6861 100.098 58.2509C100.39 60.4774 100.715 62.7009 101.04 64.9239C101.164 65.7713 101.288 66.6187 101.41 67.4662C102.061 71.9837 102.701 76.503 103.34 81.0224C103.983 85.5613 104.625 90.1002 105.279 94.6374C105.805 98.2853 106.33 101.933 106.839 105.584C106.859 105.725 106.878 105.866 106.898 106.007C107.01 106.816 107.123 107.625 107.242 108.432C107.262 108.565 107.3 108.69 107.338 108.813C107.42 109.083 107.498 109.341 107.37 109.633C106.59 111.402 104.341 112.717 102.535 111.568C102.216 111.366 101.936 111.102 101.703 110.806C101.486 110.53 101.222 110.11 101.123 109.773C101.009 109.387 100.962 108.961 100.916 108.546C100.897 108.375 100.879 108.205 100.856 108.042C100.777 107.482 100.692 106.924 100.606 106.366C100.548 105.984 100.489 105.603 100.433 105.221C100.204 103.671 99.9696 102.121 99.7348 100.572C99.4999 99.022 99.2651 97.4725 99.0366 95.922C98.7947 94.2797 98.546 92.6384 98.2972 90.997C98.048 89.3532 97.7989 87.7093 97.5566 86.0644C97.4002 85.0029 97.2419 83.9412 97.0777 82.8809C97.0499 82.7023 97.0166 82.5209 96.983 82.3382C96.9018 81.8965 96.8193 81.4471 96.8102 81.0099L63.0486 81.3729L31.0184 81.0099C31.0093 81.4471 30.9267 81.8966 30.8455 82.3382C30.8119 82.5209 30.7786 82.7023 30.7508 82.8809C30.5866 83.9412 30.4283 85.0029 30.2719 86.0644C30.0296 87.7093 29.7805 89.3532 29.5313 90.997C29.2826 92.6384 29.0338 94.2797 28.7919 95.922C28.5633 97.4738 28.3282 99.0246 28.0932 100.575C27.8585 102.124 27.6239 103.672 27.3956 105.221C27.3394 105.603 27.281 105.984 27.2225 106.366C27.137 106.924 27.0515 107.482 26.9728 108.042C26.9498 108.205 26.9311 108.375 26.9122 108.546C26.8663 108.961 26.8192 109.387 26.7059 109.773C26.6067 110.11 26.3426 110.53 26.1256 110.806C25.8927 111.102 25.612 111.366 25.2937 111.568C23.4878 112.717 21.238 111.402 20.4588 109.633C20.33 109.341 20.4086 109.083 20.4908 108.813C20.5283 108.69 20.5665 108.565 20.5861 108.432C20.707 107.616 20.8208 106.797 20.9346 105.979C20.9529 105.847 20.9712 105.716 20.9896 105.584C21.4982 101.933 22.0238 98.2853 22.5495 94.6374C23.2012 90.1138 23.8417 85.5885 24.4822 81.0632C25.1238 76.5302 25.7653 71.9973 26.4182 67.4662C26.5403 66.6186 26.6643 65.771 26.7882 64.9234C27.1132 62.7006 27.4383 60.4773 27.731 58.2509C27.8053 57.6861 27.8978 57.1204 27.9904 56.5541ZM32.5894 48.8061L13.5444 48.6343L14.2791 46.4868L21.7451 24.7541L21.9416 24.2682L22.313 24.2387H23.2903L26.9765 24.2101L68.1662 23.981L102.654 24.2101L106.005 24.2387H106.898L107.242 24.2682L107.438 24.7541L107.843 25.9281L114.904 46.4868L115.639 48.6343L96.594 48.8061L74.6169 48.9779L64.6197 49.0925L54.5666 48.9779L32.5894 48.8061ZM35.5333 56.394L35.7729 54.6187L61.6596 54.7046L93.4106 54.6187L93.6502 56.394L96.1548 73.5167L96.3986 75.292L90.0037 75.4349L75.8177 75.6931L65.3178 75.9219L39.1798 75.4349L32.7849 75.292L33.0287 73.5167L35.5333 56.394Z'
          fill={color}
        />
      </svg>
    );
  };

  const renderOptionOrderTable = () => {
    if (defaultOutlet.tableNumber.tableNumberingType === 'LETTER_AND_NUMBER') {
      return (
        <div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
              }}
            >
              <div
                style={{
                  margin: '0px 10px',
                  padding: '7px 10px',
                  borderRadius: '10px',
                  border: isError
                    ? '1px solid red'
                    : `1px solid ${colorState.primary}50`,
                }}
              >
                <input
                  value={inputLetterTable}
                  type='text'
                  onChange={(e) => setInputLetterTable(e.target.value)}
                  placeholder='Your table Letter'
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                  }}
                />
              </div>
              {isError && (
                <div
                  style={{ fontSize: '12px', marginLeft: '13px', color: 'red' }}
                >
                  Table number does not exist
                </div>
              )}
            </div>
            <div
              style={{
                width: '100%',
              }}
            >
              <div
                style={{
                  margin: '0px 10px',
                  padding: '7px 10px',
                  borderRadius: '10px',
                  border: isError
                    ? '1px solid red'
                    : `1px solid ${colorState.primary}50`,
                }}
              >
                <input
                  value={inputNumberTable}
                  type='text'
                  onChange={(e) => setInputNumberTable(e.target.value)}
                  placeholder='Your table number'
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '12px',
                  }}
                />
              </div>
            </div>
          </div>
          {!isError && (
            <div style={{ padding: '3px 10px' }}>
              <div
                style={{
                  color: isError ? 'red' : `${colorState.primary}90`,
                  fontSize: '14px',
                }}
              >
                Example: A for the letter and 78 for the number
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
            }}
          >
            <div
              style={{
                margin: '0px 10px',
                padding: '7px 10px',
                borderRadius: '10px',
                border: isError
                  ? `1px solid red`
                  : `1px solid ${colorState.primary}50`,
              }}
            >
              <input
                value={inputNumberTable}
                type='number'
                onChange={(e) => setInputNumberTable(e.target.value)}
                placeholder='Your table number'
                style={{ border: 'none', outline: 'none', width: '100%' }}
              />
            </div>
            <div style={{ padding: '3px 10px' }}>
              <div
                style={{
                  color: isError ? 'red' : `${colorState.primary}90`,
                  fontSize: '14px',
                }}
              >
                {isError ? 'Table number does not exist' : 'Example: 78'}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const RenderRandomTable = ({ item }) => {
    return item.map((item) => {
      return (
        <div
          key={item}
          onClick={() => {
            setIsActiveTable(item);
            dispatch({ type: CONSTANT.NO_TABLE, payload: item });
          }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '75px',
            border: `1px solid ${colorState.primary}`,
            borderRadius: '10px',
            color: tableNo === item ? 'white' : colorState.primary,
            backgroundColor: tableNo === item && colorState.primary,
            cursor: 'pointer',
          }}
        >
          <DineInIcon color={tableNo === item ? 'white' : colorState.primary} />
          <div style={{ fontSize: '12px', marginLeft: '4px' }}>{item}</div>
        </div>
      );
    });
  };

  const HandleLabelModal = () => {
    if (defaultOutlet.tableNumber.sequencing === 'IN_ORDER') {
      return (
        <Typography
          className={fontStyles.myFont}
          fontSize={16}
          fontWeight={700}
          textAlign='center'
        >
          Add Table Number
        </Typography>
      );
    } else {
      return (
        <Typography
          className={fontStyles.myFont}
          fontSize={16}
          fontWeight={700}
          textAlign='center'
        >
          Choose Table Number
        </Typography>
      );
    }
  };
  const generateLettersInRange = (startChar, endChar) => {
    let lettersArray = [];
    for (let i = startChar.charCodeAt(0); i <= endChar.charCodeAt(0); i++) {
      lettersArray.push(String.fromCharCode(i));
    }
    return lettersArray;
  };

  const generateNumbersInRange = () => {
    const endValue = defaultOutlet.tableNumber?.numbering?.end;
    const startValue = defaultOutlet.tableNumber?.numbering?.start;
    let numbersArray = [...Array(endValue - startValue + 1).keys()].map(
      (x) => x + startValue
    );
    return numbersArray;
  };

  const handleFormTable = () => {
    if (defaultOutlet.tableNumber.sequencing === 'RANDOM') {
      dispatch({ type: CONSTANT.NO_TABLE, payload: isActiveTable });
      onClose();
    } else {
      if (
        defaultOutlet.tableNumber.tableNumberingType === 'LETTER_AND_NUMBER'
      ) {
        const numberFromInput = Number(inputNumberTable);
        const letterFromInput = inputLetterTable;
        const letterToUppercase = letterFromInput.toUpperCase();
        const resGenerateNumber = generateNumbersInRange();
        const resGenerateLetter = generateLettersInRange(
          defaultOutlet.tableNumber?.letterPrefixing?.start,
          defaultOutlet.tableNumber?.letterPrefixing?.end
        );

        const isLetterNotFound = resGenerateLetter.find(
          (item) => item === letterToUppercase
        );

        const isNumberNotFound = resGenerateNumber.find(
          (item) => item === numberFromInput
        );
        if (!isLetterNotFound || !isNumberNotFound) {
          setIsError(true);
          setInputNumberTable('');
          setInputLetterTable('');
        } else {
          setIsError(false);
          const changeBacKToString = numberFromInput.toString();
          const combineLetterAndNumber = `${letterFromInput}${changeBacKToString}`;
          dispatch({
            type: CONSTANT.NO_TABLE,
            payload: combineLetterAndNumber,
          });
          onClose();
        }
      } else {
        const numberFromInput = Number(inputNumberTable);
        const resGenerateNumber = generateNumbersInRange();
        const isNumberNotFound = resGenerateNumber.find(
          (item) => item === numberFromInput
        );
        if (!isNumberNotFound) {
          setIsError(true);
          setInputNumberTable('');
        } else {
          setIsError(false);
          const changeBacKToString = numberFromInput.toString();
          dispatch({ type: CONSTANT.NO_TABLE, payload: changeBacKToString });
          onClose();
        }
      }
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle sx={style.dialogTitle}>
        <HandleLabelModal />
      </DialogTitle>
      {defaultOutlet.tableNumber.sequencing === 'IN_ORDER' ? (
        renderOptionOrderTable()
      ) : (
        <Slider {...settings}>
          {dataMerchantFinal.map((item) => (
            <div key={item}>
              <div
                style={{
                  width: '95%',
                  margin: 'auto',
                  display: 'grid',
                  gap: gadgetScreen ? '15px 7px' : '10px 0px',
                  justifyItems: 'center',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  gridTemplateRows: '50px 50px 50px 50px 50px',
                  gridTemplateAreas:
                    '". . . ."\n    ". . . ."\n    ". . . ."\n    ". . . ."\n    ". . . ."',
                }}
              >
                <RenderRandomTable item={item} />
              </div>
            </div>
          ))}
        </Slider>
      )}
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          marginTop:
            defaultOutlet.tableNumber.sequencing === 'IN_ORDER'
              ? '10px'
              : '40px',
        }}
      >
        <button
          onClick={onClose}
          className={fontStyles.myFont}
          style={{
            backgroundColor: 'white',
            border: `1px solid ${colorState.primary}`,
            color: colorState.primary,
            width: '50%',
            padding: '10px 0px',
            borderRadius: '10px',
            fontSize: '12px',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleFormTable}
          disabled={!isActiveTable}
          className={fontStyles.myFont}
          style={{
            color: 'white',
            width: '50%',
            padding: '10px 0px',
            borderRadius: '10px',
            fontSize: '12px',
          }}
        >
          Confirm
        </button>
      </DialogActions>
    </Dialog>
  );
};

OrderingTableDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderingTableDialog;
