import React, { useState, useRef } from "react";
import { InputCustom } from "components/InputCustom";
import PinPasswordHeader from "components/PinPasswordHeader";
import { useDispatch, useSelector } from "react-redux";
import { CustomerAction } from "redux/actions/CustomerAction";
import ModalPinPass from "components/ModalPinPass";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const ChangePassword = () => {
  const history = useHistory();
  const [btnSubmit, setBtnSubmit] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showErrorOldPassword, setShowErrorOldPassword] = useState("");
  const [showErrorNewPassword, setShowErrorNewPassword] = useState("");
  const [showErrorConfirmPassword, setShowErrorConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { color } = useSelector((state) => state.theme);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleCreateChangePassword = async () => {
    try {
      Swal.showLoading();
      const data = await dispatch(
        CustomerAction.editCustomerPassword(
          {
            oldPassword: oldPassword,
            newPassword: newPassword,
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
        <PinPasswordHeader label="Change Password" />
        <div style={{ marginTop: "24px", width: "100%" }}>
          <div style={{ marginTop: "16px" }}>
            <InputCustom
              handleChangeCustom={(e) => {
                const data = e.target.value;
                if (data === "") {
                  setShowErrorOldPassword("Password is required");
                } else if (data.length < 8) {
                  setShowErrorOldPassword(
                    "Password consists of 8 characters or more"
                  );
                } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(data)) {
                  setShowErrorOldPassword(
                    "Password must contain 1 uppercase, 1 lowercase, and 1 special character"
                  );
                  setBtnSubmit(false);
                } else {
                  setOldPassword(data);
                  setShowErrorOldPassword("");
                  setBtnSubmit(true);
                }
              }}
              label="Current Password"
              placeholder="Enter Password"
            />
            {showErrorOldPassword && (
              <div
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                {showErrorOldPassword}
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
              Forget Password?
            </div>
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <InputCustom
            handleChangeCustom={(e) => {
              const data = e.target.value;
              if (data === "") {
                setShowErrorNewPassword("Password is required");
              } else if (data.length < 8) {
                setShowErrorNewPassword(
                  "Password consists of 8 characters or more"
                );
              } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(data)) {
                setShowErrorNewPassword(
                  "Password must contain 1 uppercase, 1 lowercase, and 1 special character"
                );
                setBtnSubmit(false);
              } else {
                setNewPassword(data);
                setShowErrorNewPassword("");
                setBtnSubmit(true);
              }
            }}
            label="New Password"
            placeholder="Enter Password"
          />
          {showErrorNewPassword && (
            <div
              style={{
                color: "red",
                fontStyle: "italic",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {showErrorNewPassword}
            </div>
          )}
        </div>
        <div style={{ marginTop: "16px" }}>
          <InputCustom
            handleChangeCustom={(e) => {
              if (e.target.value !== newPassword) {
                setBtnSubmit(true);
                setShowErrorConfirmPassword(
                  "fields are not the same with `new Password`"
                );
              } else {
                setBtnSubmit(false);
                setShowErrorConfirmPassword("");
              }
            }}
            label="Confirm New Password"
            placeholder="Enter Password"
          />
          {showErrorConfirmPassword && (
            <div
              style={{
                color: "red",
                fontStyle: "italic",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {showErrorConfirmPassword}
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
          onClick={handleCreateChangePassword}
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
      <ModalPinPass
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        labelHeader="Forget Password"
      />
    </div>
  );
};

export default ChangePassword;
