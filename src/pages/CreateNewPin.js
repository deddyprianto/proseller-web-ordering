import React from "react";
import PinPasswordHeader from "./Appointment/component/PinPasswordHeader";
import { InputCustom } from "components/InputCustom";
import ButtonInputCustom from "components/ButtonInputCustom";

const CreateNewPin = () => {
  return (
    <div>
      <div
        style={{
          marginTop: "52px",
          padding: "16px",
          height: "85vh",
        }}
      >
        <PinPasswordHeader label="Create New Pin" />
        <div style={{ marginTop: "24px" }}>
          <InputCustom label="New Pin" placeholder="Enter PIN" />
        </div>
        <div style={{ marginTop: "16px" }}>
          <InputCustom label="Confirm New PIN" placeholder="Enter PIN" />
        </div>
      </div>
      <ButtonInputCustom />
    </div>
  );
};

export default CreateNewPin;
