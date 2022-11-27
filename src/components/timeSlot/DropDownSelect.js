import * as React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import iconDown from 'assets/images/IconDown.png';
import { isEmptyObject } from 'helpers/CheckEmpty';
import { useSelector } from 'react-redux';

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
  let date = [];
  if (getDateBaseOnClick) {
    timeList?.forEach((item) => {
      if (item.date === getDateBaseOnClick) {
        date = item.timeSlot;
      }
    });
  }

  const renderTimeListDropdown = () => {
    const isValueEditTimeSlotExist = timeList?.find(
      (date) => date.date === dateEdit.date
    );
    if (!isEmptyObject(isValueEditTimeSlotExist)) {
      return isValueEditTimeSlotExist?.timeSlot.map((item) => {
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
              display: !item.isAvailable && 'none',
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
            <hr style={{ width: '95%', opacity: 0.9 }} />
          </DropdownItem>
        );
      });
    } else {
      return date?.map((item) => {
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
              display: !item.isAvailable && 'none',
            }}
            header
            key={item}
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
            <hr style={{ width: '95%', opacity: 0.9 }} />
          </DropdownItem>
        );
      });
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        direction='down'
        style={{
          border: '1px solid #eaeaea',
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
            fontWeight: 700,
            fontSize: '16px',
            color: color.primary,
            opacity: '.8',
            paddingTop: !selectTimeDropDown && '20px',
            paddingBottom: !selectTimeDropDown && '20px',
          }}
        >
          {dateEdit?.timeslot ? dateEdit.timeslot : selectTimeDropDown}
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
        >
          {renderTimeListDropdown()}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};
export default DropDownCustomSelect;
