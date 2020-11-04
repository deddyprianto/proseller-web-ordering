import React, { Component } from 'react';
import { VoucherAction } from '../../redux/actions/VoucherAction';
import { CampaignAction } from '../../redux/actions/CampaignAction';
import { connect } from "react-redux";
import voucherIcon from '../../assets/images/voucher-icon.png'
import { Button } from 'reactstrap';

const Swal = require('sweetalert2')

class ModalDetailVoucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    }
  }

  handleRedeemVoucher = async () => {
    const { dataDetail } = this.props
    Swal.fire({
      title: "Redeem it?",
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
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          onOpen: () => {
            Swal.showLoading()
          }
        })
        let response = await this.props.dispatch(VoucherAction.redeemVoucher(dataDetail));
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
    let disableBtn = dataDetail && dataDetail.redeemValue > pointData.totalPoint - (pointData.pendingPoints || 0)

    return (
      <div>
        <div className="modal fade" id="voucher-detail-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            {
              dataDetail &&
              <div className="modal-content" style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
                <div className="modal-header" style={{ display: "flex", justifyContent: "left" }}>
                  <h5 className="modal-title" id="exampleModalLabel" style={{ fontSize: 20 }}>{dataDetail.name}</h5>
                  <button id="btn-close-detail-voucher" type="button" className="close" data-dismiss="modal" aria-label="Close" style={{
                    position: "absolute", right: 10, top: 13
                  }}>
                    <span aria-hidden="true" style={{ fontSize: 30 }}>×</span>
                  </button>
                </div>
                <div className="modal-body">

                  <img style={{ width: '100%', height: 150, objectFit: "contain", overflow: 'hidden' }}
                    src={dataDetail.image ? dataDetail.image : voucherIcon} alt="voucher" />

                  <div style={{ width: '100%', marginLeft: 10, marginRight: 10, textAlign: "center", marginTop: 5 }}>
                    <div style={{ fontSize: 12 }}>
                      {dataDetail.voucherDesc}
                    </div>
                    <div className="customer-group-name" style={{ fontSize: 14, fontWeight: "bold" }}>
                      {`Discount ${dataDetail.voucherType === "discPercentage" ? dataDetail.voucherValue + "%" : getCurrency(dataDetail.voucherValue)}`}
                    </div>
                  </div>
                  
                  {
                    pointData.pendingPoints && pointData.pendingPoints > 0 ?
                    <div className="text text-warning-theme" style={{
                      fontSize: 14, border: "1px solid #DCDCDC", borderRadius: 5, padding: 5, lineHeight: "17px",
                      marginTop: 10, marginBottom: 10
                    }}>
                      {`Your ${pointData.pendingPoints} points is blocked, because your order has not been completed.`}
                    </div> : null
                  }

                  <Button 
                  disabled={disableBtn}
                    className="button" 
                    style={{ width: "100%", marginTop: 10, borderRadius: 5, height: 50 }} 
                    onClick={() => this.handleRedeemVoucher()}
                  >
                    Redeem Voucher
                  </Button>
                </div>
              </div>
            }
          </div>
        </div>
        {/* {isLoading ? Swal.showLoading() : Swal.close()} */}
      </div>
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