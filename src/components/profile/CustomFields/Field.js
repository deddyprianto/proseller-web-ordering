import React, { useState, useEffect } from 'react';
import DatePicker from 'react-mobile-datepicker';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.module.css';
import cx from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { CONSTANT } from "helpers";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MultipleItemComponent } from "./MultipleItemComponent";
const Swal = require("sweetalert2");

const Field = ({
  field,
  handleValueChange,
  value,
  roundedBorder,
  error,
  titleEditAccount,
  touched,
  dataCustomer,
}) => {
  const oneTimeEntry = field?.oneTimeEntry;
  const matches = useMediaQuery("(max-width:1200px)");
  const dispatch = useDispatch();
  const color = useSelector((state) => state.theme.color);
  const [modalTrigger, setModalTrigger] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  useEffect(() => {
    dispatch({ type: CONSTANT.IS_ALL_FIELD_HAS_BEEN_FULLFILED, data: value });
  }, [value, dispatch]);

  const monthMap = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  const handleEditClick = () => {
    titleEditAccount({ display: displayName, field: field.fieldName });
    if (touched) {
      Swal.fire({
        title: "Are you sure want to continue?",
        text: "Your previous change will not be saved.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.value) {
          modalTrigger.click();
        }
      });
    } else {
      modalTrigger.click();
    }
  };

  let displayName = field.displayName;
  if (field.fieldName === "birthDate") displayName = "Birthdate";
  if (field.fieldName === "gender") displayName = "Gender";
  if (field.fieldName === "address") displayName = "Address";

  let maxDate = null;
  let minDate = null;

  if (field.minimumAge) {
    maxDate = moment().subtract(field.minimumAge, "years").format("YYYY-MM-DD");
    maxDate = moment().subtract(field.minimumAge, "years").format("YYYY");
    maxDate = new Date(`${maxDate}-12-31`);
  }
  if (field.maximumAge) {
    minDate = moment().subtract(field.maximumAge, "years").format("YYYY-MM-DD");
    minDate = new Date(minDate);
  }

  if (field.type === "radio") {
    return (
      <div style={{ marginTop: 10 }}>
        <label style={{ fontSize: 14 }}>
          {displayName}{" "}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <div style={{ display: "flex" }}>
          {field.options.map((option, key) => (
            <div
              id={`${field.fieldName}-${option.value}-radio`}
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginRight: 10,
              }}
              onClick={() => {
                if (oneTimeEntry) {
                  Swal.fire({
                    icon: "info",
                    iconColor: "#333",
                    title: "Oppss!",
                    text: "This Field can only be entered once",
                    allowOutsideClick: false,
                    confirmButtonText: "OK",
                    confirmButtonColor: color.primary,
                  });
                } else {
                  handleValueChange({
                    target: { value: option.value, name: field.fieldName },
                  });
                }
              }}
            >
              <div
                className={
                  value[field.fieldName] === option.value
                    ? "select-gender"
                    : "un-select-gender"
                }
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i
                  className={
                    value[field.fieldName] === option.value
                      ? "fa fa-check-circle"
                      : "fa fa-circle"
                  }
                  style={{ fontSize: 16, color: "#FFF" }}
                ></i>
              </div>
              <div style={{ marginLeft: 5 }}>{option.text}</div>
            </div>
          ))}
        </div>
        {error && error[field.fieldName] !== "" && (
          <div className="text text-warning-theme small">
            {" "}
            <em>{error[field.fieldName]}</em>{" "}
          </div>
        )}
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <label style={{ fontSize: 14 }} htmlFor={field.fieldName}>
          {displayName}{" "}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <select
          onClick={() => {
            if (oneTimeEntry) {
              Swal.fire({
                icon: "info",
                iconColor: "#333",
                title: "Oppss!",
                text: "This Field can only be entered once",
                allowOutsideClick: false,
                confirmButtonText: "OK",
                confirmButtonColor: color.primary,
              });
            }
          }}
          name={field.fieldName}
          onChange={handleValueChange}
          className={cx(styles.select, { [styles.rounded]: roundedBorder })}
        >
          <option value=""> </option>
          {field.options.map((option) => {
            return (
              <option
                key={option.value}
                value={option.value}
                selected={
                  value[field.fieldName]
                    ? value[field.fieldName] === option.value
                    : field.defaultValue === option.value
                }
              >
                {option.text}
              </option>
            );
          })}
        </select>
        {error && error[field.fieldName] !== "" && (
          <div className="text text-warning-theme small">
            {" "}
            <em>{error[field.fieldName]}</em>{" "}
          </div>
        )}
      </div>
    );
  }
  if (field.type === "date") {
    return (
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <label style={{ fontSize: 14 }}>
          {displayName}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <div className="customDatePickerWidth">
          <div
            htmlFor={field.fieldName}
            style={{
              position: "absolute",
              backgroundColor: "#FFF",
              top: 321,
              left: 28,
              paddingLeft: 10,
              paddingRight: 50,
            }}
          ></div>
          <div
            className="date"
            style={{ backgroundColor: "white", borderRadius: 7 }}
          >
            <div
              id={`${field?.fieldName?.toLowerCase()}-input`}
              onClick={() => {
                if (dataCustomer[field.fieldName]) {
                  Swal.fire({
                    icon: "info",
                    iconColor: "#333",
                    title: "Oppss!",
                    text: "Date of birth can only be entered once",
                    allowOutsideClick: false,
                    confirmButtonText: "OK",
                    confirmButtonColor: color.primary,
                  });
                } else {
                  setOpenDatePicker(true);
                }
              }}
              style={{
                borderRadius: 7,
                border: "1px solid #bdc3c7",
                padding: "8px 5px",
                paddingLeft: 10,
              }}
            >
              {value[field.fieldName]
                ? moment(value[field.fieldName]).format("DD MMMM YYYY")
                : `Select ${displayName}`}
            </div>
            <DatePicker
              value={
                value[field.fieldName]
                  ? new Date(value[field.fieldName])
                  : new Date()
              }
              max={maxDate ? maxDate : new Date()}
              min={minDate ? minDate : new Date(1900, 0, 1)}
              headerFormat={"DD / MM / YYYY"}
              dateConfig={{
                date: {
                  format: "DD",
                  caption: "Day",
                  step: 1,
                },
                month: {
                  format: (value) => monthMap[value.getMonth() + 1],
                  caption: "Month",
                  step: 1,
                },
                year: {
                  format: "YYYY",
                  caption: "Year",
                  step: 1,
                },
              }}
              theme={"ios"}
              confirmText={"Select"}
              cancelText={"Cancel"}
              isOpen={openDatePicker}
              onSelect={(e) => {
                handleValueChange({
                  target: {
                    value: moment(e).format("YYYY-MM-DD"),
                    name: field.fieldName,
                  },
                });
                setOpenDatePicker(false);
              }}
              onCancel={() => setOpenDatePicker(false)}
            />
          </div>
        </div>
        {error && error[field.fieldName] !== "" && (
          <div className="text text-warning-theme small">
            {" "}
            <em>{error[field.fieldName]}</em>{" "}
          </div>
        )}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <label style={{ fontSize: 14 }} htmlFor={field.fieldName}>
          {displayName}{" "}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <textarea
          onClick={() => {
            if (oneTimeEntry) {
              Swal.fire({
                icon: "info",
                iconColor: "#333",
                title: "Oppss!",
                text: "This Field can only be entered once",
                allowOutsideClick: false,
                confirmButtonText: "OK",
                confirmButtonColor: color.primary,
              });
            }
          }}
          type={field.type}
          className="woocommerce-Input woocommerce-Input--text input-text"
          id={field.fieldName}
          name={field.fieldName}
          placeholder={`Enter your ${displayName}`}
          rows="2"
          value={value[field.fieldName] || ""}
          onChange={handleValueChange}
        ></textarea>
        {error && error[field.fieldName] !== "" && (
          <div className="text text-warning-theme small">
            {" "}
            <em>{error[field.fieldName]}</em>{" "}
          </div>
        )}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div style={{ marginTop: 10 }}>
        <label style={{ fontSize: 14 }}>
          {displayName}{" "}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <div style={{ display: "flex" }}>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => {
              if (oneTimeEntry) {
                Swal.fire({
                  icon: "info",
                  iconColor: "#333",
                  title: "Oppss!",
                  text: "This Field can only be entered once",
                  allowOutsideClick: false,
                  confirmButtonText: "OK",
                  confirmButtonColor: color.primary,
                });
              } else {
                handleValueChange({
                  target: {
                    value: !value[field.fieldName],
                    name: field.fieldName,
                  },
                });
              }
            }}
          >
            <div
              className={
                value[field.fieldName] === true
                  ? "select-gender"
                  : "un-select-gender"
              }
              style={{
                height: 20,
                width: 20,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className={
                  value[field.fieldName] === true
                    ? "fa fa-check-circle"
                    : "fa fa-circle"
                }
                style={{ fontSize: 16, color: "#FFF" }}
              ></i>
            </div>
          </div>
        </div>
        {error && error[field.fieldName] !== "" && (
          <div className="text text-warning-theme small">
            {" "}
            <em>{error[field.fieldName]}</em>{" "}
          </div>
        )}
      </div>
    );
  }

  if (field.type === "dropdownmultiple") {
    return (
      <MultipleItemComponent
        field={field}
        value={value}
        error={error}
        roundedBorder={roundedBorder}
        styles={styles}
        color={color}
        matches={matches}
        fieldType={field.fieldName}
        handleValueChange={handleValueChange}
        dataCustomer={dataCustomer}
      />
    );
  }

  if (field.change) {
    return (
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <div
          data-toggle="modal"
          data-target="#edit-account-modal"
          style={{ display: "none" }}
          ref={(input) => {
            setModalTrigger(input);
          }}
        ></div>
        <label style={{ fontSize: 14 }} htmlFor={field.fieldName}>
          {displayName}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            border: "1px solid #ccc",
            color: "#808080",
            padding: 8,
            paddingLeft: 20,
            paddingRight: 5,
            borderRadius: 5,
            backgroundColor: "#DCDCDC",
          }}
        >
          <div>{value[field.fieldName] || ""}</div>
          <div onClick={handleEditClick}>
            <i className="fa fa-pencil-square-o" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
      style={{ marginTop: 10 }}
    >
      <label style={{ fontSize: 14 }} htmlFor={field.fieldName}>
        {displayName}
        <span className="required">{field.mandatory && "*"}</span>
      </label>
      <input
        onClick={() => {
          if (oneTimeEntry) {
            Swal.fire({
              icon: "info",
              iconColor: "#333",
              title: "Oppss!",
              text: "This Field can only be entered once",
              allowOutsideClick: false,
              confirmButtonText: "OK",
              confirmButtonColor: color.primary,
            });
          }
        }}
        placeholder={field?.defaultValue}
        type={field.type}
        className={cx(styles.input, {
          [styles.rounded]: roundedBorder,
        })}
        style={{
          borderRadius: roundedBorder ? "50px" : "5px",
          backgroundColor: "#FFF",
        }}
        id={field.fieldName}
        name={field.fieldName}
        rows="2"
        value={value[field.fieldName] || field?.defaultValue}
        onChange={handleValueChange}
      ></input>
      {error && error[field.fieldName] !== "" && (
        <div className="text text-warning-theme small">
          {" "}
          <em>{error[field.fieldName]}</em>{" "}
        </div>
      )}
    </div>
  );
};

Field.propTypes = {
  field: PropTypes.object,
  roundedBorder: PropTypes.bool,
  value: PropTypes.object,
  handleValueChange: PropTypes.func,
};

export default Field;
