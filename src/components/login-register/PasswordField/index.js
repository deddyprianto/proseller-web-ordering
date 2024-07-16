import React, { useState } from "react";
import PropTypes from "prop-types";
import { iconNotSeen, iconSeen } from "assets/iconsSvg/Icons";
import { useSelector } from "react-redux";

const PasswordField = ({ handleChange, error }) => {
  const checkLogin = useSelector((state) => state.auth);
  const [seenText1, setSeenText1] = useState(false);
  const [seenText2, setSeenText2] = useState(false);
  const [password1, setPassword1] = useState("");
  const [showError, setShowError] = useState(true);

  const checkInput = (value) => {
    if (value === password1) {
      setShowError("");
    } else {
      setShowError("field is not same");
    }
  };

  return (
    <React.Fragment>
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "4px",
          }}
        >
          <div
            style={{
              color: "#808080",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
            }}
          >
            Enter Password
          </div>
          <div
            style={{
              color: "var(--Badge-color-Badge, #CE1111)",
              fontFamily: "Poppins, sans-serif",
              fontSize: "26px",
            }}
          >
            *
          </div>
        </div>

        <div
          style={{
            borderRadius: "8px",
            border: "1px solid var(--Button-color-Disable, #B7B7B7)",
            backgroundColor: "var(--Brand-color-Secondary, #fff)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "4px",
            width: "100%",
            gap: "20px",
            color: "var(--Text-color-Tertiary, #888787)",
            padding: "5px 16px",
          }}
        >
          <div
            style={{
              fontFamily: "Poppins, sans-serif",
              margin: "auto 0",
              width: "100%",
            }}
          >
            <input
              placeholder="Enter Password"
              type={seenText1 ? "text" : "password"}
              name="password"
              id="password"
              style={{
                border: "none",
                width: "100%",
                outline: "none",
                fontWeight: 500,
              }}
              onChange={(e) => {
                setPassword1(e.target.value);
                handleChange("password", e.target.value, true);
              }}
            />
          </div>

          <div
            onClick={() => setSeenText1(!seenText1)}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {seenText1 ? iconSeen() : iconNotSeen()}
          </div>
        </div>
        {error && (
          <div
            style={{
              color: "red",
              fontSize: "13px",
              fontStyle: "italic",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}
      </div>
      {!checkLogin?.payload?.status && (
        <div
          style={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            fontSize: "14px",
            fontWeight: "500",
            marginTop: error ? "0px" : "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "4px",
            }}
          >
            <div
              style={{
                color: "#808080",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
              }}
            >
              Re-enter Password
            </div>
            <div
              style={{
                color: "var(--Badge-color-Badge, #CE1111)",
                fontFamily: "Poppins, sans-serif",
                fontSize: "26px",
              }}
            >
              *
            </div>
          </div>

          <div
            style={{
              borderRadius: "8px",
              border: "1px solid var(--Button-color-Disable, #B7B7B7)",
              backgroundColor: "var(--Brand-color-Secondary, #fff)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "4px",
              width: "100%",
              gap: "20px",
              color: "var(--Text-color-Tertiary, #888787)",
              padding: "5px 16px",
            }}
          >
            <div
              style={{
                fontFamily: "Poppins, sans-serif",
                margin: "auto 0",
                width: "100%",
              }}
            >
              <input
                onChange={(e) => {
                  checkInput(e.target.value);
                }}
                placeholder="Enter Password"
                type={seenText2 ? "text" : "password"}
                name="password"
                id="password"
                style={{
                  border: "none",
                  width: "100%",
                  outline: "none",
                  fontWeight: 500,
                }}
              />
            </div>
            <div
              onClick={() => setSeenText2(!seenText2)}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {seenText2 ? iconSeen() : iconNotSeen()}
            </div>
          </div>
          {showError && (
            <div
              style={{
                color: "red",
                fontSize: "13px",
                fontStyle: "italic",
                fontWeight: 600,
              }}
            >
              {showError}
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

PasswordField.propTypes = {
  handleChange: PropTypes.func,
  error: PropTypes.string,
};

export default PasswordField;