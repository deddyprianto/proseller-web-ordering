import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { VoucherAction } from "../../../redux/actions/VoucherAction";

import { connect } from "react-redux";

import cx from "classnames";

import styles from "./styles.module.css";
import voucherIcon from "../../../assets/images/voucher-icon.png";

import Swal from "sweetalert2";

const GiftVoucherModal = ({
  voucher,
  onClose,
  isSubmitting,
  failed,
  color,
  dispatch,
  errorMessage,
  successMessage,
  account,
}) => {
  const [count, setCount] = useState(0);
  const [method, setMethod] = useState("email");
  const [receiver, setReceiver] = useState("");

  const handleSubmit = () => {
    const { email, phoneNumber } = account;
    if (email === receiver || phoneNumber === receiver) {
      dispatch({
        type: "SEND_VOUCHER_FAILED",
        payload: "Can't gift voucher to your own account",
      });
    } else {
      const sendMethod =
        method === "email" ? "transferToEmail" : "transferToPhoneNumber";
      const payload = {
        voucherID: voucher.id,
        quantity: count,
        [sendMethod]: receiver,
      };
      dispatch(VoucherAction.transferVoucher(payload));
    }
  };

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  });

  useEffect(() => {
    if (count > voucher.totalRedeem) {
      setCount(voucher.totalRedeem);
    }
    if (count < 0 || count === "") {
      setCount(0);
    }
  }, [count]);

  useEffect(() => {
    setReceiver("");
    dispatch({
      type: "INIT_VOUCHER_SEND",
    });
  }, [method]);

  return (
    <div className={styles.modalContainer}>
      {isSubmitting ? Swal.showLoading() : Swal.close()}
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>Gift Voucher</div>
          <button
            onClick={onClose}
            className={cx(styles.closeButton, "close close-modal")}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className={styles.scrollable}>
          <div className={styles.body}>
            <div className={styles.image}>
              <img
                src={voucher.image ? voucher.image : voucherIcon}
                alt="voucher"
              />
            </div>
            <div className={styles.name}>{voucher.name}</div>
            <div className={styles.description}>{`Discount ${voucher.voucherType === "discPercentage"
              ? voucher.voucherValue + "%"
              : "$" + voucher.voucherValue
              }`}</div>
            <div style={{ height: 1, backgroundColor: "#CDCDCD", width: "100%" }} />
            <div className={styles.receiverForm} style={{ marginBottom: 10 }}>
              {failed && (
                <div className={styles.errorMessage}>{errorMessage}</div>
              )}
              {!isSubmitting && !failed && (
                <div className={styles.successMessage}>{successMessage}</div>
              )}
              <div>Gift to:</div>
              <input
                type={method === "email" ? "email" : "number"}
                name="receiver"
                placeholder={`Enter ${method === "email" ? "email" : "phone number"}`}
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
              ></input>
              <div
                style={{ color: color }}
                onClick={(e) =>
                  setMethod(method !== "email" ? "email" : "phone number")
                }
              >
                <strong>
                  Use {method !== "email" ? "email" : "phone number"}
                </strong>
              </div>
            </div>
            <div style={{ height: 1, backgroundColor: "#CDCDCD", width: "100%" }} />
            <div style={{ marginTop: 10 }}>Voucher owned : {voucher.totalRedeem} items</div>
            <div className={styles.counter} style={{ marginTop: -30, marginBottom: -30 }}>
              <button
                className={styles.decrease}
                onClick={() => count > 0 && setCount(count - 1)}
                disabled={count === 0}
              >
                -
              </button>
              <input
                type="number"
                name="count"
                min={0}
                value={count}
                onChange={(e) =>
                  e.target.value !== ""
                    ? setCount(parseInt(e.target.value))
                    : setCount(0)
                }
              ></input>
              <button
                className={styles.increase}
                onClick={() =>
                  count <= voucher.totalRedeem && setCount(count + 1)
                }
                disabled={count === voucher.totalRedeem}
              >
                +
              </button>
            </div>
            <div style={{ height: 1, backgroundColor: "#CDCDCD", width: "100%" }} />
          </div>

          <div className={styles.footer} style={{ marginTop: 10 }}>
            <button onClick={handleSubmit} disabled={isSubmitting || count < 1} style={{ width: "100%", borderRadius: 5 }}>
              <i className="fa fa-paper-plane" aria-hidden="true"></i> Send Gifts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

GiftVoucherModal.propTypes = {
  voucher: PropTypes.object,
  onClose: PropTypes.func,
  isSubmitting: PropTypes.bool,
  failed: PropTypes.bool,
  color: PropTypes.string,
  dispatch: PropTypes.func,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
  account: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    isSubmitting: state.voucher.isSending,
    failed: state.voucher.sendFailed,
    errorMessage: state.voucher.errorMessage,
    successMessage: state.voucher.successMessage,
    color: state.theme.color,
    account: state.auth.account.idToken.payload,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(GiftVoucherModal);
