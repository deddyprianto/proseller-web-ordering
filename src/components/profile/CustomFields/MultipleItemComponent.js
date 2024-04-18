import cx from "classnames";
import {
  iconArrowDown,
  iconArrowUp,
  radioInputIconsCheck,
  radioInputIcons,
} from "assets/iconsSvg/Icons";
import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

export const MultipleItemComponent = ({
  field,
  value,
  error,
  roundedBorder,
  styles,
  color,
  matches,
  handleValueChange,
  fieldType,
}) => {
  const dataCustomer = useSelector(
    (state) => state.customer.isAllFieldHasBeenFullFiled
  );
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (dataCustomer?.[field?.fieldName]) {
      if (typeof dataCustomer?.[field?.fieldName] === "string") {
        setSelectedOptions([]);
      } else {
        setSelectedOptions(dataCustomer?.[field?.fieldName]);
      }
    }
  }, [dataCustomer, field?.fieldName]);

  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleValueChangeEl = (option) => {
    const index = selectedOptions.findIndex((o) => o.value === option.value);
    if (index === -1) {
      const newSelectedOptions = [...selectedOptions, option];
      setSelectedOptions(newSelectedOptions);
      handleValueChange(newSelectedOptions, fieldType);
      dispatch({
        type: "MULTIPLE_TYPE_CUSTOM_FIELD",
        data: {
          value: newSelectedOptions,
          typeField: fieldType,
        },
      });
    } else {
      const newSelectedOptions = selectedOptions.filter(
        (o) => o.value !== option.value
      );
      setSelectedOptions(newSelectedOptions);
      handleValueChange(newSelectedOptions, fieldType);
      dispatch({
        type: "MULTIPLE_TYPE_CUSTOM_FIELD",
        data: {
          value: newSelectedOptions,
          typeField: fieldType,
        },
      });
    }
  };

  return (
    <div
      className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
      style={{ marginTop: 10 }}
    >
      <label style={{ fontSize: 14 }} htmlFor={field.fieldName}>
        {field.displayName}{" "}
        <span className="required">{field.mandatory && "*"}</span>
      </label>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          border: "1px solid rgba(141, 141, 141, 0.44)",
          borderRadius: "7px",
          boxShadow:
            "0px 0px 0.2px rgba(0, 0, 0, 0.02),\n  0px 0px 0.5px rgba(0, 0, 0, 0.028),\n  0px 0px 0.9px rgba(0, 0, 0, 0.035),\n  0px 0px 1.6px rgba(0, 0, 0, 0.042),\n  0px 0px 2.9px rgba(0, 0, 0, 0.05),\n  0px 0px 7px rgba(0, 0, 0, 0.07)",
        }}
      >
        <input
          value={
            selectedOptions.map((o) => o.text).join(", ") ||
            value[field.fieldName] ||
            field?.defaultValue
          }
          placeholder={
            selectedOptions.map((o) => o.text).join(", ") ||
            value[field.fieldName] ||
            field?.defaultValue
          }
          className={cx(styles.select, {
            [styles.rounded]: roundedBorder,
          })}
          style={{
            border: "none",
          }}
          readOnly
        />
        <Dropdown
          isOpen={dropdownOpen}
          toggle={() => {
            // Don't close the dropdown when an option is clicked
          }}
          direction="down"
          className={styles.dropDownMenu}
          size="100px"
        >
          <DropdownToggle
            style={{
              width: "100%",
              backgroundColor: "transparent",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              fontWeight: 500,
              fontSize: "16px",
              color: color.primary,
              outline: "none",
            }}
            onClick={toggle}
          >
            {dropdownOpen ? iconArrowDown() : iconArrowUp()}
          </DropdownToggle>
          <DropdownMenu
            className={styles.DropdownMenuCustom}
            style={{
              width: matches ? "85vw" : "27.5vw",
              borderRadius: "10px",
              paddingLeft: "10px",
              height: "235px",
              overflowY: "auto",
              marginTop: "10px",
            }}
          >
            <DropdownItem className={styles.dropDownItem}>
              {field?.options?.map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: "flex",
                    backgroundColor: "white",
                    color: "black",
                    padding: "8px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent dropdown from closing
                    handleValueChangeEl(option);
                  }}
                >
                  <div>
                    <input
                      type="checkbox"
                      name={field?.fieldName}
                      value={option.value}
                      checked={selectedOptions.some(
                        (o) => o.value === option.value
                      )}
                      onChange={() => handleValueChangeEl(option)}
                      style={{
                        opacity: 0,
                        position: "absolute",
                        marginLeft: "5px",
                        marginTop: "5px",
                      }}
                    />
                    {selectedOptions.some((o) => o.value === option.value)
                      ? radioInputIconsCheck()
                      : radioInputIcons()}
                  </div>
                  <div style={{ marginLeft: "10px" }}>{option.text}</div>
                </label>
              ))}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {error && error[field?.fieldName] !== "" && (
        <div className="text text-warning-theme small">
          {" "}
          <em>{error[field?.fieldName]}</em>{" "}
        </div>
      )}
    </div>
  );
};
