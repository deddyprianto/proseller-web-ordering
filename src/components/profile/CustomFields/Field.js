import React from "react";
import PropTypes from "prop-types";

import moment from "moment";

import styles from "./styles.module.css";

const Field = ({ field, handleValueChange, value }) => {
  if (field.type === "radio") {
    return (
      <div style={{ marginTop: 10 }}>
        <label>
          {field.displayName}{" "}
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
  } else if (field.type === "select") {
    return (
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <label htmlFor={field.fieldName}>
          {field.displayName}{" "}
          <span className="required">{field.mandatory && "*"}</span>
        </label>
        <select
          name={field.fieldName}
          onChange={handleValueChange}
          className={styles.select}
        >
          {field.options.map((option) => {
            return <option value={option.value}>{option.text}</option>;
          })}
        </select>
      </div>
    );
  } else if (field.type === "date") {
    return (
      <div
        className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
        style={{ marginTop: 10 }}
      >
        <label>
          {field.displayName}{" "}
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
            className="woocommerce-Input woocommerce-Input--text input-text"
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
  return (
    <div
      className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
      style={{ marginTop: 10 }}
    >
      <label htmlFor={field.fieldName}>
        {field.displayName}{" "}
        <span className="required">{field.mandatory && "*"}</span>
      </label>
      <input
        type={field.type}
        className="woocommerce-Input woocommerce-Input--text input-text"
        id={field.fieldName}
        name={field.fieldName}
        placeholder={`Enter your ${field.displayName}`}
        rows="2"
        value={value[field.fieldName] || ""}
        onChange={handleValueChange}
      ></input>
    </div>
  );
};

Field.propTypes = {
  field: PropTypes.object,
};

export default Field;
