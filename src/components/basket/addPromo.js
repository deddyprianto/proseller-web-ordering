import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Point from '../../assets/images/icon-point.png';
import RedeemPointBasket from './redeemPointBasket';
import { connect } from "react-redux";
import RedeemIcon from '@material-ui/icons/Redeem';

class AddPromo extends Component {
  render() {
    let props = this.props.data
    let selectedVoucher = this.props.selectedVoucher
    let colorText = this.props.disabledBtn ? "#777" : (this.props.color.primary || "#c00a27") 
    return (
      <div>
        <RedeemPointBasket
          data={props}
          handleRedeemPoint={() => this.props.handleRedeemPoint()}
          cancelSelectPoint={() => this.props.cancelSelectPoint()}
          getCurrency={(price) => this.props.getCurrency(price)}
          scrollPoint={(data) => this.props.scrollPoint(data)}
          setPoint={(point) => this.props.setPoint(point)}
        />
        <div style={{ width: "100%", }}>
          {
            props.myVoucher && props.myVoucher.length > 0 &&
            <div style={{ 
              border: "1px solid #DCDCDC", padding: 10, borderRadius: 5, width: "100%",
              marginTop: 10
            }}>
              <Button disabled={this.props.roleBtnClear || this.props.disabledBtn}
                onClick={() => this.props.handleRedeemVoucher()}
                style={{
                  fontWeight: "bold", color: colorText, cursor: "pointer", backgroundColor: "#FFF",
                  width: "100%", justifyContent: "space-between", display: "flex", flexDirection: "row",
                  alignItems: "center", fontSize: 13, height: 40, border: `1px solid ${colorText}`
                }}>
                <dev style={{display: "flex", alignItems: "center"}}>
                  <RedeemIcon style={{ fontSize: 16, marginRight: 10 }} />
                  Use Voucher
                </dev>
                <i className="fa fa-chevron-right" aria-hidden="true" />
              </Button>
              {
                selectedVoucher && selectedVoucher.length > 0 &&
                <div style={{marginTop: 10}}>
                {
                  selectedVoucher.map((items, key) => (
                    <div>
                      <div key={key} style={{
                        display: "flex", flexDirection: "row", justifyContent: "space-between",
                        alignItems: "center", marginTop: 5, marginBottom: 5, color: this.props.color.primary || "#c00a27",
                      }}>
                        <div style={{fontWeight: "bold", fontSize: 13}}>{items.name}</div>
                        <i className="fa fa-times" aria-hidden="true" style={{cursor: "pointer"}} onClick={() => this.props.handleCancelVoucher(items)} />
                      </div>
                      <div style={{height: 1, backgroundColor: "#DCDCDC"}}/>
                    </div>
                  ))
                }
                </div>
              }
            </div>
          }
          {
            props.totalPoint > 0 && props.storeDetail.enableRedeemPoint === true &&
            <div style={{ 
              border: "1px solid #DCDCDC", padding: 10, borderRadius: 5, width: "100%",
              marginTop: 10, display: "flex", alignItems: "center"
            }}>
              <Button disabled={this.props.roleBtnClear || this.props.disabledBtn}
                data-toggle="modal" data-target="#redeem-point-modal"
                onClick={() => this.props.handleRedeemPoint()}
                style={{
                  fontWeight: "bold", color: colorText, cursor: "pointer", backgroundColor: "#FFF",
                  width: "100%", justifyContent: "space-between", display: "flex", flexDirection: "row",
                  alignItems: "center", fontSize: 13, height: 40, border: `1px solid ${colorText}`
                }}>
                <dev style={{display: "flex", alignItems: "center"}}>
                  <i className="fa fa-tags" aria-hidden="true" style={{ fontSize: 16, marginRight: 10 }}/>
                  {`${props.selectedPoint > 0 ? `${props.selectedPoint} point` : 'Use Point'}`}
                </dev>
                <i className="fa fa-chevron-right" aria-hidden="true" />
              </Button>
              {
                props.selectedPoint > 0 && 
                <i className="fa fa-times" aria-hidden="true" 
                  style={{color: this.props.color.primary || "#c00a27", paddingLeft: 10, cursor: "pointer"}}
                  onClick={() => this.props.handleCancelPoint()}
                />
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    color: state.theme.color,
    selectedVoucher: state.payment.selectedVoucher
  };
};

export default connect(mapStateToProps, {})(AddPromo);