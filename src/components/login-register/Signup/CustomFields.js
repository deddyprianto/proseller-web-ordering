import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import moment from "moment";

const CustomFields = ({ fields, handleChange }) => {
  const signUpFields =
    fields &&
    fields.reduce((acc, field) => {
      return {
        ...acc,
        [field.fieldName]: {
          ...field,
          signUpField: field.signUpField ? field.signUpField : false,
        },
      };
    });
  const [gender, setGender] = useState("male");
  const [street, setStreet] = useState("");
  const [unitNo, setUnitNo] = useState("");

  useEffect(() => {
    handleChange("gender", gender);
  }, [gender]);

  useEffect(() => {
    handleChange("address", `${street}, ${unitNo}`);
  }, [street, unitNo]);
  return (
    <div>
      {signUpFields.birthDate.signUpField && (
        <div
          className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
          style={{ marginTop: 10 }}
        >
          <label>
            Birthday{" "}
            <span className="required">
              {signUpFields.birthDate &&
                signUpFields.birthDate.mandatory &&
                "*"}
            </span>
          </label>
          <div className="customDatePickerWidth">
            <div
              htmlFor="birthDate"
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
              id="birthDate"
              style={{ borderRadius: 5 }}
              className="woocommerce-Input woocommerce-Input--text input-text"
              onChange={(e) =>
                handleChange(
                  "birthDate",
                  moment(e.target.value).format("YYYY-MM-DD")
                )
              }
            />
          </div>
        </div>
      )}

      {signUpFields.gender.signUpField && (
        <div style={{ marginTop: 10 }}>
          <label>
            Gender{" "}
            <span className="required">
              {signUpFields.gender && signUpFields.gender.mandatory && "*"}
            </span>
          </label>
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => setGender("male")}
            >
              <div
                className={
                  gender === "male" ? "select-gender" : "un-select-gender"
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
                    gender === "male" ? "fa fa-check-circle" : "fa fa-circle"
                  }
                  style={{ fontSize: 16, color: "#FFF" }}
                ></i>
              </div>
              <div style={{ marginLeft: 5 }}>Male</div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                marginLeft: 20,
              }}
              onClick={() => setGender("female")}
            >
              <div
                className={
                  gender === "female" ? "select-gender" : "un-select-gender"
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
                    gender === "female" ? "fa fa-check-circle" : "fa fa-circle"
                  }
                  style={{ fontSize: 16, color: "#FFF" }}
                ></i>
              </div>
              <div style={{ marginLeft: 5 }}>Female</div>
            </div>
          </div>
        </div>
      )}

      {signUpFields.address.signUpField && (
        <div
          className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
          style={{ marginTop: 10 }}
        >
          <label htmlFor="street">
            Street Name{" "}
            <span className="required">
              {signUpFields.address && signUpFields.address.mandatory && "*"}
            </span>
          </label>
          <input
            type="text"
            className="woocommerce-Input woocommerce-Input--text input-text"
            style={{ borderRadius: 5 }}
            id="street"
            placeholder="Enter your address street name"
            rows="2"
            value={street || ""}
            onChange={(e) => setStreet(e.target.value)}
          ></input>
        </div>
      )}

      {signUpFields.address.signUpField && (
        <div
          className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide"
          style={{ marginTop: 10 }}
        >
          <label htmlFor="unitNo">
            Unit No.{" "}
            <span className="required">
              {signUpFields.address && signUpFields.address.mandatory && "*"}
            </span>
          </label>
          <input
            type="text"
            id="unitNo"
            className="woocommerce-Input woocommerce-Input--text input-text"
            style={{ borderRadius: 5 }}
            placeholder="Enter your address unit no."
            rows="2"
            value={unitNo || ""}
            onChange={(e) => setUnitNo(e.target.value)}
          ></input>
        </div>
      )}
    </div>
  );
};

CustomFields.propTypes = {
  fields: PropTypes.array,
};

export default CustomFields;
