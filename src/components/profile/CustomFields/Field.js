import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import styles from "./styles.module.css";
import cx from "classnames";

const Swal = require("sweetalert2");

const Field = ({
  field,
  handleValueChange,
  value,
  roundedBorder,
  error,
  titleEditAccount,
  touched,
}) => {
  const initialValue = value[field.fieldName];
  const [modalTrigger, setModalTrigger] = useState(null);

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

  let maxDate = "";
  let minDate = "";
  if (field.minimumAge) {
    maxDate = moment().subtract(field.minimumAge, "years").format("YYYY-MM-DD");
  }
  if (field.maximumAge) {
    minDate = moment().subtract(field.maximumAge, "years").format("YYYY-MM-DD");
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
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginRight: 10,
              }}
              onClick={() =>
                handleValueChange({
                  target: { value: option.value, name: field.fieldName },
                })
              }
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
          name={field.fieldName}
          onChange={handleValueChange}
          className={cx(styles.select, { [styles.rounded]: roundedBorder })}
        >
          <option value=""> </option>
          {field.options.map((option) => {
            return (
              <option
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
          {displayName}{" "}
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
          <input
            type="date"
            id={field.fieldName}
            name={field.fieldName}
            max={maxDate}
            min={minDate}
            value={value[field.fieldName]}
            style={{
              backgroundColor:
                field.fieldName === "birthDate" &&
                initialValue &&
                field.isAutoDisable !== false
                  ? "#DCDCDC"
                  : "#FFF",
            }}
            disabled={
              field.fieldName === "birthDate" &&
              initialValue &&
              field.isAutoDisable !== false
            }
            className={cx(styles.input, {
              [styles.rounded]: roundedBorder,
            })}
            onChange={(e) =>
              handleValueChange({
                target: {
                  value: moment(e.target.value).format("YYYY-MM-DD"),
                  name: field.fieldName,
                },
              })
            }
          />
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
            onClick={() =>
              handleValueChange({
                target: {
                  value: !value[field.fieldName],
                  name: field.fieldName,
                },
              })
            }
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
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <label style={{ fontSize: 14 }} htmlFor={field.fieldName}>
          {displayName}{" "}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <select
          name={field.fieldName}
          onChange={handleValueChange}
          className={cx(styles.select, {
            [styles.rounded]: roundedBorder,
          })}
          multiple
        >
          {field.options.map((option) => {
            return <option value={option.value}>{option.text}</option>;
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
          {displayName}{" "}
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
        {displayName} <span className="required">{field.mandatory && "*"}</span>
      </label>
      <input
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
        value={value[field.fieldName] || ""}
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