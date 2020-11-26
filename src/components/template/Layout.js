import React, { Component } from "react";
import { connect } from "react-redux";
import loadable from "@loadable/component";
import { MasterdataAction } from "../../redux/actions/MaterdataAction";
import { AuthActions } from "../../redux/actions/AuthAction";
import { InboxAction } from "../../redux/actions/InboxAction";
import { HistoryAction } from "../../redux/actions/HistoryAction";
import { Switch, Route, Redirect } from "react-router-dom";
import config from "../../config";

const HeaderEmenu = loadable(() => import("./HeaderEmenu"));
const HeaderWebOrdering = loadable(() => import("./HeaderWebOrdering"));
const FooterEmenu = loadable(() => import("./FooterEmenu"));
const FooterWebOrdering = loadable(() => import("./FooterWebOrdering"));
const Home = loadable(() => import("../../pages/Home"));
const Profile = loadable(() => import("../../pages/Profile"));
const PaidMembership = loadable(() => import("../../pages/PaidMembership"));
const History = loadable(() => import("../../pages/History"));
const Inbox = loadable(() => import("../../pages/Inbox"));
const Voucher = loadable(() => import("../../pages/Voucher"));
const StoreValueCard = loadable(() => import("../../pages/StoreValueCard"));
const BuyStoreValueCard = loadable(() => import("../../components/svc/BuySVC"));
const DeliveryAddress = loadable(() => import("../../components/delivery-address") );
const Payment = loadable(() => import("../../components/payment/index"));
const PaymentMethod = loadable(() => import("../../components/payment/paymentMethod") );
const Setting = loadable(() => import("../../components/setting"));
const Referral = loadable(() => import("../../components/referral"));
const Basket = loadable(() => import("../../components/basket"));
const PendingDetail = loadable(() => import("../../components/basket_pending"));
const SettleSuccess = loadable(() => import("../../components/basket/settleSuccess") );
const ScanTable = loadable(() => import("../../components/basket/scanTable"));
const SelectVoucher = loadable(() => import("../../components/voucher/SelectVoucher") );
const EditProfile = loadable(() => import("../../components/profile/EditProfile") );

const encryptor = require("simple-encryptor")(process.env.REACT_APP_KEY_DATA);

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmenu: window.location.pathname.includes("emenu"),
      enableOrdering: true,
      logoCompany: config.url_logo,
      infoCompany: {},
    };
  }

  componentDidMount = async () => {
    const { isLoggedIn } = this.props;
    const { isEmenu } = this.state;
    let infoCompany = await this.props.dispatch(
      MasterdataAction.getInfoCompany()
    );

    if(isLoggedIn){
      Promise.all([
        this.props.dispatch(
          InboxAction.getBroadcast({ take: 5, skip: 0 })
        ),
        this.props.dispatch(HistoryAction.getBasketPending())
      ]);
    }

    localStorage.setItem(
      `${config.prefix}_infoCompany`,
      JSON.stringify(encryptor.encrypt(infoCompany))
    );

    if (infoCompany) {
      document.title = `${isEmenu ? "E-Menu" : "Web Ordering"} - ${infoCompany.companyName}`;
      try {
        document.getElementById("icon-theme").href = infoCompany.imageURL || this.state.logoCompany;
      } catch (error) { }
      this.setState({infoCompany})
    }

    if(window.location.href.includes('/signin') && !isLoggedIn){
      try {
        document.getElementById("login-register-btn").click();
      } catch (error) {}
    }

  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props !== prevProps) {
      let infoCompany = this.state.infoCompany
      let enableOrdering = this.props.setting.find(items => { return items.settingKey === "EnableOrdering" })
      if (enableOrdering) {
        this.setState({ enableOrdering: enableOrdering.settingValue });
      }

      let logoCompany = this.props.setting.find(items => { return items.settingKey === "Logo" })
      if (logoCompany) {
        try {
          document.getElementById("icon-theme").href = infoCompany.imageURL || logoCompany.settingValue;
        } catch (error) { }
        this.setState({ logoCompany: infoCompany.imageURL || logoCompany.settingValue });
      }
    }
  }

  render() {
    const { isLoggedIn } = this.props;
    const { isEmenu, enableOrdering } = this.state;
    // console.log("mode emenu", isEmenu);
    return (
      <div id="page" className="hfeed site">
        {isEmenu ? <HeaderEmenu /> : <HeaderWebOrdering />}
        <div id="content" className="site-content">
          <Switch>
            {enableOrdering && <Route exact path={"/"} component={Home} /> }
            {enableOrdering && <Route exact path={"/signIn"} component={Home} /> }
            {enableOrdering && <Route exact path={"/basket"} component={Basket} /> }
            {(isLoggedIn || !enableOrdering) && <Route exact path={"/profile"} component={Profile} /> }
            {(isLoggedIn || !enableOrdering) && <Route exact path={"/rewards"} component={Profile} /> }
            {isLoggedIn && <Route exact path={"/inbox"} component={Inbox} />}
            {isLoggedIn &&  <Route exact path={"/voucher"} component={Voucher} /> }
            {isLoggedIn &&  <Route exact path={"/svc"} component={StoreValueCard} /> }
            {isLoggedIn &&  <Route exact path={"/buy-svc"} component={BuyStoreValueCard} /> }
            {isLoggedIn &&  <Route exact path={"/setting"} component={Setting} /> }
            {isLoggedIn && <Route exact path={"/payment-method"} component={PaymentMethod} /> }
            {isLoggedIn && <Route exact path={"/delivery-address"} component={DeliveryAddress} /> }
            {isLoggedIn && <Route exact path={"/referral"} component={Referral} /> }
            {isLoggedIn && <Route exact path={"/edit-profile"} component={EditProfile} /> }
            {isLoggedIn &&  <Route exact path={"/myVoucher"} component={SelectVoucher} /> }
            {isLoggedIn &&  <Route exact path={"/scanTable"} component={ScanTable} /> }
            {isLoggedIn &&  <Route exact path={"/settleSuccess"} component={SettleSuccess} /> }
            {isLoggedIn && <Route exact path={"/history/detail"} component={PendingDetail} /> }
            {isLoggedIn && <Route exact path={"/paid-membership"} component={PaidMembership} /> }
            <Route exact path={"/history"} component={History} />
            <Route exact path={"/payment"} component={Payment} />
            <Redirect from="*" to={!enableOrdering ? '/profile' : '/'} />
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
    setting: state.order.setting,
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
