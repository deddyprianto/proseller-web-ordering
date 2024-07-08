import React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useHistory } from "react-router-dom";

const PinPasswordHeader = ({ label }) => {
  const history = useHistory();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px 1fr",
        gridTemplateRows: "1fr",
        gridAutoColumns: "1fr",
        gap: "0px 0px",
        gridAutoFlow: "row",
        gridTemplateAreas: '". ."',
        justifyItems: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => history.goBack()}
      >
        <ArrowBackIosIcon
          sx={{
            fontSize: "20px",
            color: "black",
          }}
        />
      </div>
      <div
        style={{
          fontWeight: "600",
          fontSize: "16px",
          color: "black",
          marginLeft: "-52px",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default PinPasswordHeader;
