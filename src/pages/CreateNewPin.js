import React, { useState, useRef } from "react";
import { InputCustom } from "components/InputCustom";
import PinPasswordHeader from "components/PinPasswordHeader";
import { useDispatch, useSelector } from "react-redux";
import { CustomerAction } from "redux/actions/CustomerAction";
import ModalPinPass from "components/ModalPinPass";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const CreateNewPin = () => {
  const [btnSubmit, setBtnSubmit] = useState(true);
  const [showErrorInputPin, setShowErrorInputPin] = useState("");
  const [showErrorInputPin2, setShowErrorInputPin2] = useState("");
  const [inputPIN, setInputPIN] = useState("");
  const history = useHistory();
  const inputRefNewPin = useRef();
  const dispatch = useDispatch();
  const { color } = useSelector((state) => state.theme);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleCreatePin = async () => {
    try {
      Swal.showLoading();
      const data = await dispatch(
        CustomerAction.getCustomerPin({ pin: inputPIN })
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
          confirmButtonText: "OK",
        }).then((res) => {
          if (res.isConfirmed) {
            history.push("/profile");
          }
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
            handleChangeCustom={(e) => {
              setInputPIN(e.target.value);
              if (e.target.value.length < 4) {
                setShowErrorInputPin("PIN consists of 4 characters or more");
              } else {
                setShowErrorInputPin("");
              }
            }}
            label="New Pin"
            placeholder="Enter PIN"
          />
          {showErrorInputPin && (
            <div
              style={{
                color: "red",
                fontStyle: "italic",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {showErrorInputPin}
            </div>
          )}
        </div>
        <div style={{ marginTop: "16px" }}>
          <InputCustom
            handleChangeCustom={(e) => {
              if (e.target.value !== inputPIN) {
                setBtnSubmit(true);
                setShowErrorInputPin2("fields are not the same with new PIN");
              } else {
                setBtnSubmit(false);
                setShowErrorInputPin2("");
              }
            }}
            label="Confirm New PIN"
            placeholder="Enter PIN"
          />
          {showErrorInputPin2 && (
            <div
              style={{
                color: "red",
                fontStyle: "italic",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {showErrorInputPin2}
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
