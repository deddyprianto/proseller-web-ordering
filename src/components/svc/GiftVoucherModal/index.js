import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { SVCAction } from '../../../redux/actions/SVCAction';

import { connect } from 'react-redux';

import cx from 'classnames';

import styles from './styles.module.css';

import Swal from 'sweetalert2';

const GiftVoucherModal = ({
  balance,
  stringBalance,
  onClose,
  failed,
  color,
  dispatch,
  errorMessage,
  successMessage,
  account,
}) => {
  const [method, setMethod] = useState('email');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState(0);
  const [isSubmitting, setSubmit] = useState(false);

  const handleSubmit = () => {
    setSubmit(true);
    const { email, phoneNumber } = account;
    if (email === receiver || phoneNumber === receiver) {
      dispatch({
        type: 'TRANSFER_SVC_FAILED',
        payload: "Can't transfer to your own account",
      });
    } else {
      const sendMethod = method === 'email' ? 'email' : 'phoneNumber';
      const payload = {
        [sendMethod]: receiver,
        value: Number(amount),
      };
      dispatch(SVCAction.transferSVC(payload));
      setReceiver('');
      setAmount(0);
      setSubmit(false);
    }
  };

  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    return () => {
      document.body.style.overflowY = 'scroll';
    };
  }, []);

  useEffect(() => {
    setReceiver('');
    setAmount(0);
    dispatch({
      type: 'INIT_TRANSFER_SVC',
    });
  }, [method]);

  return (
    <div className={styles.modalContainer}>
      {isSubmitting ? Swal.showLoading() : Swal.close()}
      <div className={cx(styles.modal, 'background-theme')}>
        <div className={styles.header}>
          <div>Transfer Store Value Card</div>
          <button
            onClick={onClose}
            className={cx(styles.closeButton, 'close close-modal')}
          >
            <i className='fa fa-times'></i>
          </button>
        </div>
        <div className={styles.scrollable}>
          <div className={styles.body}>
            <div className={styles.image}></div>
            <div className={styles.description}>Total Balance</div>
            <div className={styles.name}>{stringBalance}</div>
            <div
              style={{ height: 1, backgroundColor: '#CDCDCD', width: '100%' }}
            />
            <div className={styles.receiverForm} style={{ marginBottom: 10 }}>
              <div style={{ textAlign: 'left' }}>
                <b>Amount to Transfer :</b>
              </div>
              <input
                type={'number'}
                onFocus={(e) => setAmount('')}
                name='amountToTransfer'
                placeholder={`Enter amount to transfer`}
                value={amount}
                onChange={(e) =>
                  e.target.value <= balance ? setAmount(e.target.value) : false
                }
              ></input>
            </div>
            <div className={styles.receiverForm} style={{ marginBottom: 10 }}>
              <div style={{ textAlign: 'left' }}>
                <b>Transfer to :</b>
              </div>
              <input
                type={method === 'email' ? 'email' : 'text'}
                name='receiver'
                placeholder={`Enter ${
                  method === 'email' ? 'email' : 'phone number'
                }`}
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
              ></input>
              <div
                style={{ color: color, textDecoration: 'underline' }}
                onClick={(e) =>
                  setMethod(method !== 'email' ? 'email' : 'phone number')
                }
              >
                <strong>
                  Use {method !== 'email' ? 'email' : 'phone number'}
                </strong>
              </div>
            </div>
            <div
              style={{ height: 1, backgroundColor: '#CDCDCD', width: '100%' }}
            />
          </div>

          {failed && (
            <div
              style={{ fontSize: 20, marginTop: 20, marginBottom: 20 }}
              className={styles.errorMessage}
            >
              <b>{errorMessage}</b>
            </div>
          )}
          {!isSubmitting && !failed && (
            <div
              style={{ fontSize: 20, marginTop: 20, marginBottom: 20 }}
              className={styles.successMessage}
            >
              <b>{successMessage}</b>
            </div>
          )}

          <div className={styles.footer} style={{ marginTop: 10 }}>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || amount < 1}
              style={{ width: '100%', borderRadius: 5, height: 50 }}
            >
              <i className='fa fa-paper-plane' aria-hidden='true'></i> Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

GiftVoucherModal.propTypes = {
  balance: PropTypes.number,
  stringBalance: PropTypes.string,
  onClose: PropTypes.func,
  failed: PropTypes.bool,
  dispatch: PropTypes.func,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
  account: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    failed: state.svc.sendFailed,
    errorMessage: state.svc.errorMessage,
    successMessage: state.svc.successMessage,
    color: state.theme.color,
    account: state.auth.account.idToken.payload,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(GiftVoucherModal);
