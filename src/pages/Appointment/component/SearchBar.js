import React, { useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from '../style/styles.module.css';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import { OrderAction } from 'redux/actions/OrderAction';
import { CONSTANT } from 'helpers';
import { isEmptyArray } from 'helpers/CheckEmpty';
import ResultSearch from './ResultSearch';

const SearchBar = ({ color, setShowSearchBar, defaultOutlet }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  // selectors
  const cartAppointment = useSelector(
    (state) => state.appointmentReducer.cartAppointment
  );
  const searchBar = useSelector((state) => state.appointmentReducer.searchBar);
  // some Effect
  useEffect(() => {
    const payload = {
      take: 20,
      outletID: `outlet::${defaultOutlet}`,
      filters: [
        {
          id: 'search',
          value: inputValue,
          type: 'SERVICE',
        },
      ],
    };
    const loadData = async () => {
      try {
        setIsLoading(true);
        await dispatch(OrderAction.searchProdAppointment(payload));
        setIsLoading(false);
      } catch (error) {
        console.log({ error });
      }
    };
    if (inputValue.length > 3) {
      loadData();
    } else if (inputValue.length === 0) {
      dispatch({ type: CONSTANT.SEARCHBAR, payload: [] });
    }
  }, [inputValue, defaultOutlet]);

  const RenderAnimationLoading = () => {
    return (
      <div className='lds-spinner_searchbar'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
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
          alignItems: 'center',
          margin: '10px 0',
          paddingLeft: '5px',
        }}
      >
        <ArrowBackIosIcon
          onClick={() => setShowSearchBar(false)}
          sx={{
            justifySelf: 'center',
            color: color.primary,
            marginLeft: '10px',
          }}
          fontSize='large'
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
            opacity: 0.7,
          }}
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Type anything...'
            style={{
              outline: 'none',
              width: '80%',
              border: 'none',
              borderRadius: '5px',
              fontSize: '15px',
              color: 'black',
              fontWeight: 600,
            }}
          />

          {inputValue && (
            <CloseIcon
              onClick={() => {
                dispatch({ type: CONSTANT.SEARCHBAR, payload: [] });
                setInputValue('');
              }}
            />
          )}
        </div>
      </div>
      {inputValue && (
        <div style={{ width: '95%', margin: 'auto' }}>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(183, 183, 183, 1)',
              marginTop: '20px',
            }}
          >
            Search result for "{`${inputValue}`}"
          </p>
          {searchBar.map((item) => {
            const isCheckedService = cartAppointment?.details?.some(
              (items) => items.product.name === item.product.name
            );
            return (
              <ResultSearch
                isCheckedService={isCheckedService}
                key={item?.productID}
                item={item?.product}
                id={item.productID}
              />
            );
          })}
        </div>
      )}
      {isEmptyArray(searchBar) && inputValue.length > 3 && !isLoading && (
        <div
          style={{
            color: 'rgba(255, 0, 0, 1)',
            margin: '0px 20px',
            marginBottom: '30px',
          }}
        >
          Product not found
        </div>
      )}

      {isLoading && <RenderAnimationLoading />}
    </div>
  );
};

export default SearchBar;
