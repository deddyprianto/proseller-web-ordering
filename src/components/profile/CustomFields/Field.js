import React, { useState } from "react";
import PropTypes from "prop-types";

import moment from "moment";

import styles from "./styles.module.css";

import cx from "classnames";

const Field = ({ field, handleValueChange, value, roundedBorder }) => {
  const [initialValue, setInitialValue] = useState(value[field.fieldName]);
  let displayName = field.displayName
  if (field.fieldName === "birthDate") displayName = "Birthdate"
  if (field.fieldName === "gender") displayName = "Gender"
  if (field.fieldName === "address") displayName = "Address"
  
  if (field.type === "radio") {
    return (
      <div style={{ marginTop: 10 }}>
        <label>
          {displayName}{" "}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <div style={{ display: "flex" }}>
          {field.options.map((option) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
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
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <label htmlFor={field.fieldName}>
          {displayName}{" "}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <select
          name={field.fieldName}
          onChange={handleValueChange}
          className={cx(styles.select, {
            [styles.rounded]: roundedBorder,
          })}
        >
          <option
            value=""
            disabled={
              field.defaultValue ||
              (value[field.fieldName] && value[field.fieldName] !== "")
            }
          >
            Select {displayName}
          </option>
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
      </div>
    );
  }
  if (field.type === "date") {
    return (
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <label>
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
            value={value[field.fieldName]}
            disabled={field.fieldName === "birthDate" && initialValue}
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
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <label htmlFor={field.fieldName}>
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
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div style={{ marginTop: 10 }}>
        <label>
          {displayName}{" "}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
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
      </div>
    );
  }

  if (field.type === "dropdownmultiple") {
    return (
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <label htmlFor={field.fieldName}>
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
      </div>
    );
  }
  return (
    <div
      className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
      style={{ marginTop: 10 }}
    >
      <label htmlFor={field.fieldName}>
        {displayName}{" "}
        <span className="required">{field.mandatory && "*"}</span>
      </label>
      <input
        autoComplete={false}
        type={field.type}
        className={cx(styles.input, {
          [styles.rounded]: roundedBorder,
        })}
        style={{ borderRadius: roundedBorder ? "50px" : "5px" }}
        id={field.fieldName}
        name={field.fieldName}
        placeholder={`Enter your ${displayName}`}
        rows="2"
        value={value[field.fieldName] || ""}
        onChange={handleValueChange}
      ></input>
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
