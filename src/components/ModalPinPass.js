import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { InputCustom } from "./InputCustom";
import { useSelector, useDispatch } from "react-redux";
import { AuthActions } from "redux/actions/AuthAction";
import OTPCountdown from "./OtpCountDown";
import { CustomerAction } from "redux/actions/CustomerAction";
import { CONSTANT } from "helpers";
import { useHistory } from "react-router-dom";

const ModalPinPass = ({ isOpenModal, setIsOpenModal }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const refEnterOTP = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorField, setShowErrorField] = useState(false);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [disableButtonResendOTP, setDisableButtonResendOTP] = useState(true);
  const [resendOTP, setResendOTP] = useState(true);
  const orderingSetting = useSelector((state) => state);
  const payload = {
    phoneNumber: orderingSetting.auth?.account?.idToken?.payload?.phoneNumber,
  };
  const handleOTP = async () => {
    setResendOTP(true);
    setMinutes(1); // Reset to 1 minute
    setSeconds(0);
    try {
      const data = await dispatch(AuthActions.sendOtp(payload));
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    console.log("RESEND OTP");
  };
  useEffect(() => {
    if (isOpenModal) {
      handleOTP();
    }
  }, [isOpenModal]);

  function formatPhoneNumber(phoneNumber) {
    console.log(phoneNumber);
    if (phoneNumber.length < 8) {
      throw new Error("Phone number is too short");
    }
    const countryCode = phoneNumber.slice(0, 3);
    const firstTwoDigits = phoneNumber.slice(3, 5);
    const lastFourDigits = phoneNumber.slice(-4);
    const formattedPhoneNumber = `${countryCode} ${firstTwoDigits} *** ${lastFourDigits}`;
    return formattedPhoneNumber;
  }

  const handleVerifyOTP = async () => {
    if (!refEnterOTP.current.value) {
      setShowErrorField(true);
      return;
    }
    try {
      setIsLoading(true);
      const data = await dispatch(
        CustomerAction.verifyCustomerPin({ otp: refEnterOTP.current.value })
      );
      setIsLoading(false);
      if (data.status === "SUCCESS") {
        dispatch({
          type: CONSTANT.OTP_VERIFY,
          payload: data.data.token,
        });
        history.push(`/resetpin?verify=${data.data.token}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
            onClick={() => {
              setShowErrorField(false);
              setIsOpenModal(false);
            }}
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
            marginTop: "4px",
          }}
        >
          We’ve sent a code to{" "}
          {formatPhoneNumber(
            orderingSetting.auth?.account?.idToken?.payload?.phoneNumber
          )}
        </div>
        <button
          onClick={handleOTP}
          disabled={disableButtonResendOTP}
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
            color: !disableButtonResendOTP
              ? "black"
              : "var(--Button-color-Disable, #B7B7B7)",
            fontFamily: '"Plus Jakarta Sans"',
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "normal",
          }}
        >
          Resend OTP via Email
        </button>
        {resendOTP && (
          <OTPCountdown
            setSeconds={setSeconds}
            setMinutes={setMinutes}
            seconds={seconds}
            minutes={minutes}
            setResendOTP={setResendOTP}
            resendOTP={resendOTP}
            setDisableButtonResendOTP={setDisableButtonResendOTP}
          />
        )}

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
        <InputCustom
          inputRef={refEnterOTP}
          label="Enter 4 Digit OTP"
          placeholder="Enter OTP"
        />
      </div>
      {showErrorField && (
        <div
          style={{
            color: "red",
            marginLeft: "15px",
            fontSize: "10px",
            fontStyle: "italic",
            fontWeight: 600,
          }}
        >
          This field still empty
        </div>
      )}
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
          onClick={handleVerifyOTP}
          style={{
            color: "white",
            width: "100%",
            padding: "6px 0px",
            borderRadius: "10px",
            fontSize: "14px",
          }}
        >
          {isLoading ? "Loading..." : "Continue"}
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalPinPass;
