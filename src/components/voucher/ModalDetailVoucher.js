import React, { Component } from 'react';
import { VoucherAction } from '../../redux/actions/VoucherAction';
import { CampaignAction } from '../../redux/actions/CampaignAction';
import { connect } from "react-redux";
import voucherIcon from '../../assets/images/voucher-icon.png'
import { Button } from 'reactstrap';
import styles from "./GiftVoucherModal/styles.module.css";
import LoadingOverlay from 'react-loading-overlay';

const Swal = require('sweetalert2')

class ModalDetailVoucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      count: 0
    }
  }

  handleRedeemVoucher = async () => {
    let { dataDetail } = this.props
    let { count } = this.state
    Swal.fire({
      title: `Redeem ${count} vouchers?`,
      text: "You cannot return this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Yes",
      cancelButtonText: "cancel"
    }).then(async (result) => {
      if (result.value) {
        Swal.fire({
          onOpen: () => {
            Swal.showLoading()
          }
        })

        let response = await this.props.dispatch(VoucherAction.redeemVoucher(dataDetail, count));
        await this.props.dispatch(CampaignAction.getCampaignPoints({ history: "true" }, this.props.account.companyId))
        if (response.ResultCode === 200) {
          document.getElementById('btn-close-detail-voucher').click()
          Swal.fire({
            icon: 'success', timer: 1500,
            title: response.message, showConfirmButton: false,
          })
        } else {
          Swal.fire({
            icon: 'error', timer: 1500,
            title: response.message, showConfirmButton: false,
          })
        }
      }
    })
  }

  render() {
    let { dataDetail, getCurrency, pointData } = this.props
    
    let { count } = this.state
    let disableBtn = dataDetail && dataDetail.redeemValue > (pointData.totalPoint - (pointData.pendingPoints || 0) - (pointData.lockPoints || 0) )
    let maxRedeem = 0
    if(dataDetail){
      maxRedeem = Math.floor(pointData.totalPoint / dataDetail.redeemValue)
    }

    if(count > maxRedeem) count = maxRedeem
    return (
      <LoadingOverlay active={this.state.isLoading} spinner text='Loading...'>
        <div>
          <div
            className='modal fade'
            id='voucher-detail-modal'
            tabIndex={-1}
            role='dialog'
            aria-labelledby='exampleModalCenterTitle'
            aria-hidden='true'
          >
            <div className='modal-dialog modal-dialog-centered' role='document'>
              {dataDetail && (
                <div
                  className='modal-content'
                  style={{ width: '100%', marginTop: 100, marginBottom: 100 }}
                >
                  <div
                    className='modal-header'
                    style={{ display: 'flex', justifyContent: 'left' }}
                  >
                    <h5
                      className='modal-title'
                      id='exampleModalLabel'
                      style={{ fontSize: 20 }}
                    >
                      {dataDetail.name}
                    </h5>
                    <button
                      id='btn-close-detail-voucher'
                      type='button'
                      className='close'
                      data-dismiss='modal'
                      aria-label='Close'
                      style={{
                        position: 'absolute',
                        right: 10,
                        top: 13,
                      }}
                    >
                      <span aria-hidden='true' style={{ fontSize: 30 }}>
                        ×
                      </span>
                    </button>
                  </div>
                  <div className='modal-body'>
                    <img
                      style={{
                        width: '100%',
                        height: 150,
                        objectFit: 'contain',
                        overflow: 'hidden',
                      }}
                      src={dataDetail.image ? dataDetail.image : voucherIcon}
                      alt='voucher'
                    />

                    <div
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        marginTop: 5,
                      }}
                    >
                      <div style={{ fontSize: 12 }}>
                        {dataDetail.voucherDesc}
                      </div>
                      <div
                        className='customer-group-name'
                        style={{ fontSize: 14, fontWeight: 'bold' }}
                      >
                        {`Discount ${
                          dataDetail.voucherType === 'discPercentage'
                            ? dataDetail.voucherValue + '%'
                            : getCurrency(dataDetail.voucherValue)
                        }`}
                      </div>
                    </div>

                    {pointData.pendingPoints && pointData.pendingPoints > 0 ? (
                      <div
                        className='text text-warning-theme'
                        style={{
                          fontSize: 14,
                          border: '1px solid #DCDCDC',
                          borderRadius: 5,
                          padding: 5,
                          lineHeight: '17px',
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      >
                        {`Your ${pointData.pendingPoints} points is blocked, because your order has not been completed.`}
                      </div>
                    ) : null}

                    {pointData.lockPoints && pointData.lockPoints > 0 ? (
                      <div
                        className='text text-warning-theme'
                        style={{
                          fontSize: 14,
                          border: '1px solid #DCDCDC',
                          borderRadius: 5,
                          padding: 5,
                          lineHeight: '17px',
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      >
                        {`Your ${pointData.lockPoints} SVC points are locked, because your Store Value Card balance is still remaining.`}
                      </div>
                    ) : null}

                    <div
                      className={styles.counter}
                      style={{ marginTop: -30, marginBottom: -20 }}
                    >
                      <button
                        className='font-color-theme'
                        onClick={() =>
                          count > 0 && this.setState({ count: count - 1 })
                        }
                        disabled={count === 0}
                      >
                        -
                      </button>
                      <input
                        type='number'
                        name='count'
                        min={0}
                        max={maxRedeem}
                        value={parseInt(count)}
                        style={{ height: 40, fontSize: 20 }}
                        onChange={(e) => {
                          let value = parseInt(e.target.value) || 0;
                          value <= maxRedeem
                            ? this.setState({ count: value })
                            : this.setState({ count: maxRedeem });
                        }}
                      />
                      <button
                        className='font-color-theme'
                        onClick={() =>
                          count <= maxRedeem &&
                          this.setState({ count: count + 1 })
                        }
                        disabled={count === maxRedeem}
                      >
                        +
                      </button>
                    </div>

                    <Button
                      disabled={disableBtn || count < 1}
                      className='button'
                      style={{
                        width: '100%',
                        marginTop: 10,
                        borderRadius: 5,
                        height: 50,
                      }}
                      onClick={() => this.handleRedeemVoucher()}
                    >
                      <i className='fa fa-paper-plane' aria-hidden='true' />{' '}
                      Redeem Voucher
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.auth.account.idToken.payload,
    pointData: state.campaign.data,
  };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetailVoucher);