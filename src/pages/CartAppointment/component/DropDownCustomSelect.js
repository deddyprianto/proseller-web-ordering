import React, { useEffect } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import iconDown from 'assets/images/IconDown.png';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../style/styles.module.css';
import { CONSTANT } from 'helpers';
import { isEmptyArray } from 'helpers/CheckEmpty';

const DropDownCustomSelect = ({ timeList }) => {
  const timeActiveDropDown = useSelector(
    (state) => state.appointmentReducer.timeActiveDropDown
  );
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  // some eff
  useEffect(() => {
    if (timeList?.length > 0) {
      dispatch({ type: CONSTANT.TIME_APPOINTMENT, payload: timeList[0] });
    }
  }, [timeList]);

  const renderTimeListDropdown = () => {
    return timeList?.map((item) => {
      return (
        <DropdownItem
          style={{
            cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans',
            color: 'black',
            fontWeight: 500,
            fontSize: '16px',
            padding: '5px 0 0 0',
            margin: 0,
            opacity: 0.9,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          header
          key={item}
        >
          <p
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              dispatch({ type: CONSTANT.TIME_APPOINTMENT, payload: item });
              dispatch({
                type: CONSTANT.TIME_ACTIVE_DROPDOWN_CART_APPOINTMENT,
                payload: item,
              });
              setDropdownOpen(false);
            }}
          >
            {item}
          </p>
        </DropdownItem>
      );
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        direction='down'
        style={{
          border: '1px solid rgba(183, 183, 183, 1)',
          borderRadius: '10px',
        }}
      >
        <DropdownToggle
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '16px',
            color: 'black',
            opacity: '.8',
            paddingTop: timeActiveDropDown ? '15px' : '10px',
            paddingBottom: timeActiveDropDown ? '15px' : '10px',
            outline: 'none',
          }}
        >
          {timeActiveDropDown
            ? timeActiveDropDown
            : !isEmptyArray(timeList)
            ? timeList[0]
            : 'Time not available'}
          <img src={iconDown} />
        </DropdownToggle>
        <DropdownMenu
          style={{
            width: '100%',
            borderRadius: '10px',
            paddingLeft: '10px',
            height: '160px',
            overflowY: 'auto',
            marginTop: '5px',
          }}
          className={styles.styleBar}
        >
          {renderTimeListDropdown()}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
export default DropDownCustomSelect;
