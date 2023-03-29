import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import fontStyles from '../style/styles.module.css';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const SearchBar = ({ color, setShowSearchBar, dataProServices }) => {
  const [searchValue, setSearchValue] = useState('');
  const [cutPrice, setCutPrice] = useState(false);
  const filteredData = dataProServices.filter((item) => {
    const lowerCaseTitle = item.title.toLowerCase();
    return lowerCaseTitle.includes(searchValue);
  });

  const RenderResultSearch = ({ item }) => {
    return (
      <div
        style={{
          width: '100%',
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          borderRadius: '6px',
          padding: '10px 0px',
          marginBottom: '15px',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '80px',
              display: 'flex',
              justifyContent: 'center',
              height: '50px',
              paddingLeft: '5px',
              marginTop: '5px',
            }}
          >
            <img
              src={item.img}
              alt='profile'
              style={{ width: '100%', borderRadius: '10px' }}
            />
          </div>
          <div style={{ padding: '0px 10px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>
              {item.title}
            </div>
            <div style={{ fontSize: '13px' }}>{item.subTitle}</div>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 70px',
            gridTemplateRows: '1fr',
            gap: '0px 0px',
            gridAutoFlow: 'row',
            gridTemplateAreas: '". . ."',
            marginTop: '15px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AccessTimeIcon />
            <div style={{ fontSize: '13px', marginLeft: '5px' }}>30 mins</div>
          </div>
          {cutPrice ? (
            <div
              style={{
                justifySelf: 'end',
                display: 'flex',
                fontSize: '14px',
              }}
            >
              <div>SGD 10.00</div>
              <div
                style={{
                  marginLeft: '5px',
                  textDecorationLine: 'line-through',
                }}
              >
                SGD 10.00
              </div>
            </div>
          ) : (
            <div
              style={{
                justifySelf: 'end',
                fontSize: '14px',
              }}
            >
              <div>SGD 10.00</div>
            </div>
          )}
          <div
            style={{
              justifySelf: 'center',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <button
              style={{ width: '60px', borderRadius: '5px', fontSize: '12px' }}
            >
              BOOK
            </button>
          </div>
        </div>
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
            <RenderResultSearch key={item.title} item={item} />
          ))}
        </div>
      )}
      <div style={{ color: 'rgba(183, 183, 183, 1)', margin: '0px 20px' }}>
        ex name services: Hair Cut
      </div>
    </div>
  );
};

export default SearchBar;
