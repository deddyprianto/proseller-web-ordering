import React, { useState, useRef } from "react";
import { InputCustom } from "components/InputCustom";
import PinPasswordHeader from "components/PinPasswordHeader";
import { useDispatch, useSelector } from "react-redux";
import { CustomerAction } from "redux/actions/CustomerAction";
import ModalPinPass from "components/ModalPinPass";
import Swal from "sweetalert2";

const CreateNewPin = () => {
  const inputRefNewPin = useRef();
  const inputRefConfirmNewPin = useRef();
  const dispatch = useDispatch();
  const { color } = useSelector((state) => state.theme);
  const [showError, setShowError] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const orderingSetting = useSelector((state) => state);
  const payload = {
    phoneNumber: orderingSetting.auth?.account?.idToken?.payload?.phoneNumber,
  };

  const handleCreatePin = async () => {
    if (inputRefConfirmNewPin.current.value !== inputRefNewPin.current.value) {
      setShowError(true);
      return;
    }
    setShowError(false);
    try {
      Swal.showLoading();
      const data = await dispatch(
        CustomerAction.getCustomerPin({ pin: inputRefNewPin.current.value })
      );
      Swal.hideLoading();
      if (data?.status === "SUCCESS") {
        Swal.fire({
          icon: "success",
          title: data.message,
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "info",
          iconColor: "#333",
          title: data.message,
          confirmButtonText: "OK",
        });
      }
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
        <PinPasswordHeader label="Create New Pin" />
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
          onClick={handleCreatePin}
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

export default CreateNewPin;
