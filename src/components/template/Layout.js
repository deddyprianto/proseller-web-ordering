import React, { Component } from "react";
import { connect } from "react-redux";
import loadable from "@loadable/component";
import { MasterdataAction } from "../../redux/actions/MaterdataAction";
import { OrderAction } from "../../redux/actions/OrderAction";
import { AuthActions } from "../../redux/actions/AuthAction";
import { Switch, Route, Redirect } from "react-router-dom";
import config from "../../config";

const HeaderEmenu = loadable(() => import("./HeaderEmenu"));
const HeaderWebOrdering = loadable(() => import("./HeaderWebOrdering"));
const FooterEmenu = loadable(() => import("./FooterEmenu"));
const FooterWebOrdering = loadable(() => import("./FooterWebOrdering"));
const Home = loadable(() => import("../../pages/Home"));
const Profile = loadable(() => import("../../pages/Profile"));
const History = loadable(() => import("../../pages/History"));
const Inbox = loadable(() => import("../../pages/Inbox"));
const PageNotFound = loadable(() => import("../../pages/PageNotFound"));
const Voucher = loadable(() => import("../../pages/Voucher"));
const DeliveryAddress = loadable(() =>
  import("../../components/delivery-address")
);
const Payment = loadable(() => import("../../components/payment/index"));
const PaymentMethod = loadable(() =>
  import("../../components/payment/paymentMethod")
);
const Setting = loadable(() => import("../../components/setting"));
const Referral = loadable(() => import("../../components/referral"));
const Basket = loadable(() => import("../../components/basket"));
const PendingDetail = loadable(() => import("../../components/basket_pending"));
const SettleSuccess = loadable(() =>
  import("../../components/basket/settleSuccess")
);
const ScanTable = loadable(() => import("../../components/basket/scanTable"));
const SelectVoucher = loadable(() =>
  import("../../components/voucher/SelectVoucher")
);

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmenu: window.location.pathname.includes("emenu"),
    };
  }

  componentDidMount = async () => {
    const { isEmenu } = this.state;
    let infoCompany = await this.props.dispatch(
      MasterdataAction.getInfoCompany()
    );
    localStorage.setItem(
      `${config.prefix}_infoCompany`,
      JSON.stringify(encryptor.encrypt(infoCompany))
    );

    if (infoCompany) {
      document.title = `${isEmenu ? "E-Menu" : "Web Ordering"} - ${
        infoCompany.companyName
      }`;
      try {
        document.getElementById("icon-theme").href =
          infoCompany.imageURL || config.url_logo;
      } catch (error) {}
    }

    // Refresh Token
    // await this.props.dispatch(AuthActions.refreshToken());

    let response = await this.props.dispatch(OrderAction.getCart());
    if (
      response &&
      response.data &&
      Object.keys(response.data).length > 0 &&
      response.data.status !== "failed"
    ) {
      localStorage.setItem(
        `${config.prefix}_dataBasket`,
        JSON.stringify(encryptor.encrypt(response.data))
      );
    }
  };

  render() {
    const { isLoggedIn } = this.props;
    const { isEmenu } = this.state;
    console.log("mode emenu", isEmenu);
    return (
      <div id="page" className="hfeed site">
        {isEmenu ? <HeaderEmenu /> : <HeaderWebOrdering />}
        <div id="content" className="site-content">
          <Switch>
            <Route exact path={"/"} component={Home} />
            {isLoggedIn && (
              <Route exact path={"/profile"} component={Profile} />
            )}
            {isLoggedIn && <Route exact path={"/inbox"} component={Inbox} />}
            {isLoggedIn && (
              <Route exact path={"/voucher"} component={Voucher} />
            )}
            {isLoggedIn && (
              <Route exact path={"/setting"} component={Setting} />
            )}
            {isLoggedIn && (
              <Route exact path={"/payment-method"} component={PaymentMethod} />
            )}
            {isLoggedIn && (
              <Route
                exact
                path={"/delivery-address"}
                component={DeliveryAddress}
              />
            )}
            {isLoggedIn && (
              <Route exact path={"/referral"} component={Referral} />
            )}
            {isLoggedIn && (
              <Route exact path={"/myVoucher"} component={SelectVoucher} />
            )}
            {isLoggedIn && (
              <Route exact path={"/scanTable"} component={ScanTable} />
            )}
            {isLoggedIn && (
              <Route exact path={"/settleSuccess"} component={SettleSuccess} />
            )}
            {isLoggedIn && (
              <Route exact path={"/history/detail"} component={PendingDetail} />
            )}
            <Route exact path={"/history"} component={History} />
            <Route exact path={"/payment"} component={Payment} />
            <Route exact path={"/basket"} component={Basket} />
            <Route exact path={"/404"} component={PageNotFound} />
            <Redirect from="*" to="/" />
          </Switch>
          <div style={{ clear: "both" }}></div>
        </div>
        {isEmenu ? <FooterEmenu /> : <FooterWebOrdering />}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => {
      dispatch(AuthActions.logout());
    },
    dispatch,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
