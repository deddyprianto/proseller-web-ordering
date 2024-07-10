import { InputCustom } from "components/InputCustom";
import PinPasswordHeader from "components/PinPasswordHeader";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CustomerAction } from "redux/actions/CustomerAction";
import Swal from "sweetalert2";

const ResetPin = () => {
  const dispatch = useDispatch();
  const inputRefNewPin = useRef();
  const inputRefConfirmNewPin = useRef();
  const [showError, setShowError] = useState(false);
  const { color } = useSelector((state) => state.theme);
  const history = useHistory();
  const verifyID = useSelector((state) => state.customer.otpVerify);
  const urlObj = new URL(window.location.href);
  const hash = urlObj.hash;
  const queryString = hash.substring(hash.indexOf("?") + 1);
  const params = new URLSearchParams(queryString);
  const qs = params.get("verify");

  useEffect(() => {
    if (qs !== verifyID) {
      history.push("/");
    }
  }, []);

  const handleResetPIN = async () => {
    if (!inputRefConfirmNewPin.current.value && !inputRefNewPin.current.value) {
      Swal.fire({
        icon: "error",
        iconColor: "#333",
        title: "Make sure all fields are filled in",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      });
      return;
    }
    if (inputRefNewPin.current.value !== inputRefConfirmNewPin.current.value) {
      setShowError(true);
      return;
    }
    setShowError(false);

    try {
      const payload = {
        token: qs,
        newPin: inputRefNewPin.current.value,
      };
      Swal.showLoading();
      const data = await dispatch(CustomerAction.resetCustomerPin(payload));
      Swal.hideLoading();
      if (data?.status === "SUCCESS") {
        Swal.fire({
          icon: "success",
          title: data?.message,
          confirmButtonText: "OK",
        }).then((res) => {
          if (res.isConfirmed) {
            history.push("/profile");
          }
        });
      } else {
        Swal.fire({
          icon: "info",
          iconColor: "#333",
          title: data?.message,
          confirmButtonText: "OK",
        });
      }
      // resetCustomerPin
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        style={{
          marginTop: "52px",
          padding: "16px",
          height: "85vh",
        }}
      >
        <PinPasswordHeader label="New PIN" />
        <p
          style={{
            marginTop: "24px",
            color: "var(--Text-color-Primary, #2F2F2F)",
            fontFamily: '"Plus Jakarta Sans"',
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: "500",
            lineHeight: "normal",
          }}
        >
          Your new PIN must be different from previously used password.
        </p>
        <div style={{ marginTop: "16px" }}>
          <InputCustom
            inputRef={inputRefNewPin}
            label="New Pin"
            placeholder="Enter PIN"
          />
        </div>
        <div style={{ marginTop: "16px" }}>
          <InputCustom
            inputRef={inputRefConfirmNewPin}
            label="Confirm New PIN"
            placeholder="Enter PIN"
          />
          {showError && (
            <div
              style={{
                color: "red",
                fontStyle: "italic",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              fields are not the same with new PIN
            </div>
          )}
        </div>
      </div>
      {/* button */}
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
          onClick={handleResetPIN}
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
          Update
        </button>
      </div>
      {/* end button */}
    </div>
  );
};

export default ResetPin;
