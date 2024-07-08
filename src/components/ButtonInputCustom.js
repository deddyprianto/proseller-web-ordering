import React from "react";
import { useSelector } from "react-redux";

const ButtonInputCustom = () => {
  const { color } = useSelector((state) => state.theme);

  return (
    <div
      style={{
        width: "100%",
        position: "absolute",
        bottom: 73,
        display: "flex",
        height: "73px",
        padding: "16px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        alignSelf: "stretch",
        backgroundColor: color.navigationColor,
      }}
    >
      <button
        style={{
          display: "flex",
          padding: "8px 16px",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          alignSelf: "stretch",
          backgroundColor: color.primary,
        }}
      >
        Confirm
      </button>
    </div>
  );
};

export default ButtonInputCustom;
