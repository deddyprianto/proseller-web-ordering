import { iconNotSeen, iconSeen } from "assets/iconsSvg/Icons";
import React, { useState } from "react";

export function InputCustom({ label, placeholder }) {
  const [seenText, setSeenText] = useState(false);
  return (
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
            color: "#000",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: "var(--Badge-color-Badge, #CE1111)",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          *
        </div>
      </div>

      <div
        style={{
          justifyContent: "space-between",
          borderRadius: "8px",
          boxShadow: "0px 0px 0px 3px rgba(159, 135, 255, 0.20)",
          borderColor: "rgba(136, 135, 135, 1)",
          borderStyle: "solid",
          borderWidth: "1px",
          backgroundColor: "var(--Brand-color-Secondary, #FFF)",
          display: "flex",
          marginTop: "4px",
          width: "100%",
          gap: "20px",
          color: "var(--Text-color-Tertiary, #888787)",
          padding: "12px 16px",
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
            placeholder={placeholder}
            type={seenText ? "text" : "password"}
            style={{
              border: "none",
              width: "100%",
              outline: "none",
            }}
          />
        </div>
        <div onClick={() => setSeenText(!seenText)}>
          {seenText ? iconSeen() : iconNotSeen()}
        </div>
      </div>
    </div>
  );
}
