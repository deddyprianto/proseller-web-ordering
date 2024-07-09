import React, { useState, useRef } from "react";
import { InputCustom } from "components/InputCustom";
import PinPasswordHeader from "components/PinPasswordHeader";
import { useDispatch, useSelector } from "react-redux";
import { CustomerAction } from "redux/actions/CustomerAction";
import ModalPinPass from "components/ModalPinPass";
import Swal from "sweetalert2";

const ChangePIN = () => {
  const inputOldPIN = useRef();
  const inputRefNewPin = useRef();
  const inputRefConfirmNewPin = useRef();
  const dispatch = useDispatch();
  const { color } = useSelector((state) => state.theme);
  const [showError, setShowError] = useState(false);
  const [checkIsEmpty, setCheckIsEmpty] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const orderingSetting = useSelector((state) => state);
  // const payload = {
  //   phoneNumber: orderingSetting.auth?.account?.idToken?.payload?.phoneNumber,
  // };

  const handleCreateChangePin = async () => {
    if (
      inputOldPIN.current.value &&
      inputRefConfirmNewPin.current.value &&
      inputRefNewPin.current.value
    ) {
      setCheckIsEmpty(false);
      if (
        inputRefConfirmNewPin.current.value !== inputRefNewPin.current.value
      ) {
        setShowError(true);
        return;
      }
      setShowError(false);
      try {
        Swal.showLoading();
        const data = await dispatch(
          CustomerAction.getCustomerPin(
            {
              oldPin: inputOldPIN.current.value,
              newPin: inputRefNewPin.current.value,
            },
            "PUT"
          )
        );
        Swal.hideLoading();
        if (data?.status === "FAILED") {
          Swal.fire({
            icon: "info",
            iconColor: "#333",
            title: data.message,
            allowOutsideClick: false,
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      Swal.fire({
        icon: "error",
        iconColor: "#333",
        title: "Make sure all fields are filled in",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      });
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
        <PinPasswordHeader label="Change PIN" />
        <div style={{ marginTop: "24px", width: "100%" }}>
          <InputCustom
            inputRef={inputOldPIN}
            label="Current PIN"
            placeholder="Enter PIN"
          />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <div
              onClick={() => setIsOpenModal(true)}
              style={{
                fontSize: "14px",
                color: "#306AFF",
                textDecoration: "underline",
                cursor: "pointer",
                margin: 0,
                padding: 0,
              }}
            >
              Forget PIN?
            </div>
          </div>
        </div>

        <div style={{ marginTop: checkIsEmpty ? "0px" : "16px" }}>
          <InputCustom
            inputRef={inputRefNewPin}
            label="New PIN"
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
          onClick={handleCreateChangePin}
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
      {/* end button */}
      <ModalPinPass isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
    </div>
  );
};

export default ChangePIN;
