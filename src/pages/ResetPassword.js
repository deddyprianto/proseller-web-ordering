import { InputCustom } from "components/InputCustom";
import PinPasswordHeader from "components/PinPasswordHeader";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CustomerAction } from "redux/actions/CustomerAction";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [btnSubmit, setBtnSubmit] = useState(true);
  const [showErrorInputPassword, setShowErrorInputPassword] = useState("");
  const [showErrorInputPassword2, setShowErrorInputPassword2] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const dispatch = useDispatch();
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

  const handleResetPassword = async () => {
    try {
      const payload = {
        token: qs,
        newPassword: inputPassword,
      };
      Swal.showLoading();
      const data = await dispatch(CustomerAction.changePassword(payload));
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
        <PinPasswordHeader label="New Password" />
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
          Your new password must be different from previously used password.
        </p>
        <div style={{ marginTop: "16px" }}>
          <InputCustom
            handleChangeCustom={(e) => {
              const data = e.target.value;
              if (data === "") {
                setShowErrorInputPassword("Password is required");
              } else if (data.length < 8) {
                setShowErrorInputPassword(
                  "Password consists of 8 characters or more"
                );
              } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(data)) {
                setShowErrorInputPassword(
                  "Password must contain 1 uppercase, 1 lowercase, and 1 special character"
                );
                setBtnSubmit(false);
              } else {
                setInputPassword(data);
                setShowErrorInputPassword("");
                setBtnSubmit(true);
              }
            }}
            label="New Password"
            placeholder="Enter Password"
          />
          {showErrorInputPassword && (
            <div
              style={{
                color: "red",
                fontStyle: "italic",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {showErrorInputPassword}
            </div>
          )}
        </div>
        <div style={{ marginTop: "16px" }}>
          <InputCustom
            handleChangeCustom={(e) => {
              if (e.target.value !== inputPassword) {
                setBtnSubmit(true);
                setShowErrorInputPassword2(
                  "fields are not the same with new Password"
                );
              } else {
                setBtnSubmit(false);
                setShowErrorInputPassword2("");
              }
            }}
            label="Confirm New Password"
            placeholder="Enter Password"
          />
          {showErrorInputPassword2 && (
            <div
              style={{
                color: "red",
                fontStyle: "italic",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {showErrorInputPassword2}
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
          onClick={handleResetPassword}
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

export default ResetPassword;
