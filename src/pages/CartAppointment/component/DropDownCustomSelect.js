/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import iconDown from 'assets/images/IconDown.png';
import { isEmptyObject } from 'helpers/CheckEmpty';
import { useSelector } from 'react-redux';
import styles from '../style/styles.module.css';
const DropDownCustomSelect = ({
  setSelectTimeDropDown,
  selectTimeDropDown,
  timeList,
  getDateBaseOnClick,
  valueEditTimeSlot: dateEdit,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const color = useSelector((state) => state.theme.color);
  // let date = [];
  // if (getDateBaseOnClick) {
  //   timeList?.forEach((item) => {
  //     if (item.date === getDateBaseOnClick) {
  //       date = item.timeSlot;
  //     }
  //   });
  // }

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
          key={item.time}
        >
          <p
            style={{
              cursor: 'pointer',
            }}
            onClick={() => {
              setSelectTimeDropDown(item.time);
              setDropdownOpen(false);
            }}
          >
            {item.time}
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
            paddingTop: selectTimeDropDown ? '15px' : '10px',
            paddingBottom: selectTimeDropDown ? '15px' : '10px',
            outline: 'none',
          }}
        >
          {/* {dateEdit?.timeslot ? dateEdit.timeslot : selectTimeDropDown}
           */}
          {timeList[0].time}
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
