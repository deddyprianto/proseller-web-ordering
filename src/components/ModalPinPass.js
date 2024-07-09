import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { InputCustom } from "./InputCustom";

const ModalPinPass = ({ isOpenModal, setIsOpenModal }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={isOpenModal}
      onClose={() => setIsOpenModal(false)}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "15px",
        }}
      ></div>
      <DialogTitle
        sx={{
          fontWeight: 500,
          fontSize: "16px",
          textAlign: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "36px 1fr 36px",
            gridTemplateRows: "1fr",
            gridAutoColumns: "1fr",
            gap: "0px 0px",
            gridAutoFlow: "row",
            gridTemplateAreas: '". . ."',
            alignItems: "center",
          }}
        >
          <div></div>
          <div>Forget PIN</div>
          <button
            onClick={() => setIsOpenModal(false)}
            style={{
              fontWeight: 600,
              backgroundColor: "transparent",
              color: "black",
            }}
          >
            X
          </button>
        </div>
      </DialogTitle>
      <hr
        style={{
          backgroundColor: "#D6D6D6",
          height: "1px",
          marginTop: "16px",
        }}
      />
      <div
        style={{
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <div
          style={{
            color: "#000",
            fontVariantNumeric: "lining-nums tabular-nums",
            fontFamily: '"Plus Jakarta Sans"',
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "140%",
          }}
        >
          Please Enter 4-Digit OTP
        </div>
        <div
          style={{
            color: "#000",
            fontVariantNumeric: "lining-nums tabular-nums",
            fontFamily: '"Plus Jakarta Sans"',
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "140%",
          }}
        >
          We’ve sent a code to +65 **** 1234.
        </div>
        <button
          style={{
            display: "flex",
            padding: "8px 16px",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            alignSelf: "stretch",
            borderRadius: "8px",
            border: "1px solid var(--Button-color-Disable, #B7B7B7)",
            width: "100%",
            backgroundColor: "transparent",
            marginTop: "16px",
            color: "var(--Button-color-Disable, #B7B7B7)",
            fontFamily: '"Plus Jakarta Sans"',
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "normal",
          }}
        >
          Resend OTP via Email
        </button>
        <div
          style={{
            color: "#000",
            textAlign: "center",
            fontFamily: '"Plus Jakarta Sans"',
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "normal",
            marginTop: "16px",
          }}
        >
          Resend after 4:59
        </div>
        <hr
          style={{
            backgroundColor: "#D6D6D6",
            height: "1px",
            marginTop: "16px",
          }}
        />
      </div>

      <div
        style={{
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <InputCustom label="Enter 4 Digit OTP" placeholder="Enter OTP" />
      </div>
      <hr
        style={{
          backgroundColor: "#D6D6D6",
          height: "1px",
          marginTop: "16px",
        }}
      />
      <DialogActions
        sx={{
          width: "100%",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <button
          disabled
          style={{
            color: "white",
            width: "100%",
            padding: "6px 0px",
            borderRadius: "10px",
            fontSize: "14px",
          }}
        >
          Continue
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalPinPass;
