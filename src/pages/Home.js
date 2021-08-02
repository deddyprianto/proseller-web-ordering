import React, { Component } from "react";
import { connect } from "react-redux";
import Promotion from "../components/promotion";
import Ordering from "../components/ordering";
import OrderingRetail from "../components/ordering/indexRetail";
import OutletSelection from "./OutletSelection";
import { OrderAction } from "../redux/actions/OrderAction";
import { PromotionAction } from "../redux/actions/PromotionAction";
import LoadingAddCart from "../components/loading/LoadingAddCart";
import { isEmptyArray, isEmptyObject } from "../helpers/CheckEmpty";
import config from "../config";

import { lsLoad } from "../helpers/localStorage";

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isEmenu: window.location.hostname.includes("emenu"),
    };
  }

  componentDidMount = async () => {
    await this.props.dispatch(PromotionAction.fetchPromotion());
    await this.setState({ loading: true });
    await this.checkOfflineCart();
    await this.setState({ loading: false });
  };

  checkOfflineCart = async () => {
    try {
      let account = encryptor.decrypt(lsLoad(`${config.prefix}_account`, true));
      let offlineCart = localStorage.getItem(`${config.prefix}_offlineCart`);
      offlineCart = JSON.parse(offlineCart);

      if (isEmptyObject(offlineCart)) return;
      if (account) {
        for (let i = 0; i < offlineCart.details.length; i++) {
          let product = {
            productID: offlineCart.details[i].productID,
            unitPrice: offlineCart.details[i].unitPrice,
            quantity: offlineCart.details[i].quantity,
          };

          if (!isEmptyArray(offlineCart.details[i].modifiers)) {
            product.modifiers = offlineCart.details[i].modifiers;
          }

          let payload = {
            outletID: offlineCart.outletID,
            details: [],
          };
          payload.details.push(product);
          await this.props.dispatch(OrderAction.addCart(payload));
        }
        localStorage.removeItem(`${config.prefix}_offlineCart`);
      }
    } catch (e) {}
  };

  render() {
    const { isEmenu } = this.state;
    const { defaultOutlet } = this.props;
    // console.log(defaultOutlet, 'defaultOutlet')
    return (
      <div className="col-full">
        <div
          id="primary"
          className="content-area"
          style={{ paddingBottom: 100 }}
        >
          {this.state.loading ? <LoadingAddCart /> : null}
          <div className="stretch-full-width">
            {this.props.setting.outletSelection === "MANUAL" &&
            !this.props.defaultOutlet.id &&
            !isEmenu ? (
              <OutletSelection />
            ) : (
              <main id="main" className="site-main">
                {!isEmenu && <Promotion />}
                <Ordering />
              </main>
            )}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    setting: state.order,
    defaultOutlet: state.outlet.defaultOutlet,
  };
};

export default connect(mapStateToProps)(Home);
