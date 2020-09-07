import React, { Component } from "react";
import { connect } from "react-redux";
import Promotion from "../components/promotion";
import Ordering from "../components/ordering";
import { OutletAction } from "../redux/actions/OutletAction";
import { OrderAction } from "../redux/actions/OrderAction";
import { PromotionAction } from "../redux/actions/PromotionAction";
import LoadingAddCart from '../components/loading/LoadingAddCart';
import { isEmptyData, isEmptyArray, isEmptyObject } from "../helpers/CheckEmpty";

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);
const account = encryptor.decrypt(JSON.parse(localStorage.getItem('webordering_account')));

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount = async () => {
    await this.props.dispatch(PromotionAction.fetchPromotion());
    await this.setState({ loading: true });
    await this.checkOfflineCart();
    await this.setState({ loading: false });
    // navigator.geolocation.getCurrentPosition(function(position) {
    //   console.log("Latitude is :", position.coords.latitude);
    //   console.log("Longitude is :", position.coords.longitude);
    // });
  }

  checkOfflineCart = async () => {
    try {
      let offlineCart = localStorage.getItem('webordering_offlineCart');
      offlineCart = JSON.parse(offlineCart);

      if (isEmptyObject(offlineCart)) return;

      if (account != undefined) {
        for (let i = 0; i < offlineCart.details.length; i++) {
          let product = {
            productID: offlineCart.details[i].productID,
            unitPrice: offlineCart.details[i].retailPrice,
            quantity: offlineCart.details[i].quantity
          };

          if (!isEmptyArray(offlineCart.details[i].modifiers)) {
            product.modifiers = offlineCart.details[i].modifiers;
          }

          let payload = {
            outletID: offlineCart.outletID,
            details: []
          };
          payload.details.push(product);
          await this.props.dispatch(OrderAction.addCart(payload));
        }
        localStorage.removeItem('webordering_offlineCart');
      }
    } catch (e) { }
  }

  render() {
    return (
      <div className="col-full">
        <div id="primary" className="content-area" style={{ paddingBottom: 100 }}>
          {this.state.loading ? <LoadingAddCart /> : null}
          <div className="stretch-full-width">
            <main id="main" className="site-main">
              <Promotion />
              <Ordering />
            </main>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps)(Home);
