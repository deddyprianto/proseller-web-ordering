import React, { useState, useRef } from "react";
import { InputCustom } from "components/InputCustom";
import PinPasswordHeader from "components/PinPasswordHeader";
import { useDispatch, useSelector } from "react-redux";
import { CustomerAction } from "redux/actions/CustomerAction";
import ModalPinPass from "components/ModalPinPass";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const ChangePIN = () => {
  const history = useHistory();
  const [btnSubmit, setBtnSubmit] = useState(true);
  const [newPin, setNewPin] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [showErrorOldPIN, setShowErrorOldPIN] = useState("");
  const [showErrorNewPIN, setShowErrorNewPIN] = useState("");
  const [showErrorConfirmPIN, setShowErrorConfirmPIN] = useState("");
  const dispatch = useDispatch();
  const { color } = useSelector((state) => state.theme);
  const [isOpenModal, setIsOpenModal] = useState(false);

  //
  const handleChangePassword = async () => {
    try {
      Swal.showLoading();
      const data = await dispatch(
        CustomerAction.getCustomerPin(
          {
            oldPin: oldPin,
            newPin: newPin,
          },
          "PUT"
        )
      );
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
          allowOutsideClick: false,
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
        <PinPasswordHeader label="Change PIN" />
        <div style={{ marginTop: "24px", width: "100%" }}>
          <div style={{ marginTop: "16px" }}>
            <InputCustom
              handleChangeCustom={(e) => {
                setOldPin(e.target.value);
                if (e.target.value.length < 4) {
                  setShowErrorOldPIN("PIN consists of 4 characters or more");
                } else {
                  setShowErrorOldPIN("");
                }
              }}
              label="Current PIN"
              placeholder="Enter PIN"
            />
            {showErrorOldPIN && (
              <div
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {showErrorOldPIN}
              </div>
            )}
          </div>
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
                fontWeight: 600,
              }}
            >
              Forget PIN?
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <InputCustom
            handleChangeCustom={(e) => {
              setNewPin(e.target.value);
              if (e.target.value.length < 4) {
                setShowErrorNewPIN("PIN consists of 4 characters or more");
              } else {
                setShowErrorNewPIN("");
              }
            }}
            label="Current PIN"
            placeholder="Enter PIN"
          />
          {showErrorNewPIN && (
            <div
              style={{
                color: "red",
                fontStyle: "italic",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {showErrorNewPIN}
            </div>
          )}
        </div>
        <div style={{ marginTop: "16px" }}>
          <InputCustom
            handleChangeCustom={(e) => {
              if (e.target.value !== newPin) {
                setBtnSubmit(true);
                setShowErrorConfirmPIN("fields are not the same with new PIN");
              } else {
                setBtnSubmit(false);
                setShowErrorConfirmPIN("");
              }
            }}
            label="Current PIN"
            placeholder="Enter PIN"
          />
          {showErrorConfirmPIN && (
            <div
              style={{
                color: "red",
                fontStyle: "italic",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {showErrorConfirmPIN}
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
          disabled={btnSubmit}
          onClick={handleChangePassword}
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
      <ModalPinPass isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
    </div>
  );
};

export default ChangePIN;
