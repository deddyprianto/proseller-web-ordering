import { iconNotSeen, iconSeen } from "assets/iconsSvg/Icons";
import React, { useState } from "react";

export function InputCustom({ label, placeholder, inputRef }) {
  const [seenText, setSeenText] = useState(false);
  const [isActiveInput, setIsActiveInput] = useState(false);
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
          borderRadius: "8px",
          border: "1px solid var(--Button-color-Disable, #B7B7B7)",
          boxShadow:
            isActiveInput && "0px 0px 0px 3px rgba(159, 135, 255, 0.20)",
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
            ref={inputRef}
            onClick={() => setIsActiveInput(!isActiveInput)}
            placeholder={placeholder}
            type={seenText ? "text" : "password"}
            style={{
              border: "none",
              width: "100%",
              outline: "none",
              fontWeight: "500",
            }}
          />
        </div>
        <div
          onClick={() => setSeenText(!seenText)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {seenText ? iconSeen() : iconNotSeen()}
        </div>
      </div>
    </div>
  );
}
