/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import loadable from '@loadable/component';
import { MasterDataAction } from '../../redux/actions/MasterDataAction';
import { AuthActions } from '../../redux/actions/AuthAction';
import { InboxAction } from '../../redux/actions/InboxAction';
import { HistoryAction } from '../../redux/actions/HistoryAction';
import { Switch, Route, Redirect } from 'react-router-dom';
import config from '../../config';

const HeaderEmenu = loadable(() => import('./HeaderEmenu'));
const HeaderWebOrdering = loadable(() => import('./headerWebOrdering'));
const FooterEmenu = loadable(() => import('./FooterEmenu'));
const FooterWebOrdering = loadable(() => import('./FooterWebOrdering'));
const Home = loadable(() => import('../../pages/Home'));
const Cart = loadable(() => import('../../pages/Cart'));
const Payment = loadable(() => import('pages/Payment'));
const MyVoucher = loadable(() => import('pages/MyVoucher'));
const Profile = loadable(() => import('../../pages/Profile'));
const ListMembership = loadable(() => import('../../pages/ListMembership'));
const DetailMembership = loadable(() => import('../../pages/DetailMembership'));
const History = loadable(() => import('../../pages/History'));
const Inbox = loadable(() => import('../../pages/Inbox'));
const Voucher = loadable(() => import('../../pages/Voucher'));
const Map = loadable(() => import('../../pages/Map/Map'));
const ScanBarcode = loadable(() => import('../../pages/ScanBarcode'));
const OutletSelection = loadable(() => import('../../pages/OutletSelection'));
const StoreValueCard = loadable(() => import('../../pages/StoreValueCard'));
const BuyStoreValueCard = loadable(() => import('../../components/svc/BuySVC'));
const UseSVC = loadable(() => import('../../components/svc/useSVC'));
const DeliveryAddress = loadable(() => import('../../pages/DeliveryAddress'));
const PaymentMethod = loadable(() => import('../../pages/PaymentMethod'));
const Setting = loadable(() => import('../../components/setting'));
const Referral = loadable(() => import('../../components/referral'));
const Basket = loadable(() => import('../../components/basket'));
const PendingDetail = loadable(() => import('../../components/basket_pending'));
const SettleSuccess = loadable(() =>
  import('../../components/basket/settleSuccess')
);
const ScanTable = loadable(() => import('../../components/basket/scanTable'));
const EditProfile = loadable(() =>
  import('../../components/profile/EditProfile')
);
const Categories = loadable(() => import('../../pages/AllCategory'));
const Products = loadable(() => import('../../pages/Products'));
const Promotions = loadable(() =>
  import('../../components/ordering/Promotions')
);
const PromotionsDetail = loadable(() => import('../../pages/Promotions'));
const Search = loadable(() => import('../../pages/Search'));
const ProductSearchResult = loadable(() => import('../../pages/ProductSearch'));

const encryptor = require('simple-encryptor')(process.env.REACT_APP_KEY_DATA);

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEmenu: window.location.hostname.includes('emenu'),
      enableOrdering: true,
      logoCompany: config.url_logo,
      infoCompany: {},
    };
  }

  async componentDidMount() {
    const { isLoggedIn } = this.props;
    const { isEmenu } = this.state;
    let infoCompany = await this.props.dispatch(
      MasterDataAction.getInfoCompany()
    );

    if (isLoggedIn) {
      Promise.all([
        this.props.dispatch(InboxAction.getBroadcast({ take: 5, skip: 0 })),
        this.props.dispatch(HistoryAction.getBasketPending()),
      ]);
    }

    localStorage.setItem(
      `${config.prefix}_infoCompany`,
      JSON.stringify(encryptor.encrypt(infoCompany))
    );

    if (infoCompany) {
      document.title = `${isEmenu ? 'E-Menu' : 'Web Ordering'} - ${
        infoCompany.companyName
      }`;
      try {
        document.getElementById('icon-theme').href =
          infoCompany.imageURL || this.state.logoCompany;
      } catch (e) {
        console.log(e);
      }
      this.setState({ infoCompany });
    }

    // TODO: Change this with react router use useRouteMatch
    if (window.location.href.includes('/signin')) {
      try {
        console.log('SIGN IN');
        setTimeout(() => {
          document.getElementById('login-register-btn').click();
        }, 700);
      } catch (e) {
        console.log(e);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      let infoCompany = this.state.infoCompany;
      let enableOrdering = this.props.setting.find((items) => {
        return items.settingKey === 'EnableOrdering';
      });
      if (enableOrdering) {
        this.setState({ enableOrdering: enableOrdering.settingValue });
      }

      let logoCompany = this.props.setting.find((items) => {
        return items.settingKey === 'Logo';
      });
      if (logoCompany) {
        try {
          document.getElementById('icon-theme').href =
            infoCompany.imageURL || logoCompany.settingValue;
        } catch (e) {
          console.log(e);
        }
        this.setState({
          logoCompany: infoCompany.imageURL || logoCompany.settingValue,
        });
      }
    }
  }

  render() {
    const { isLoggedIn } = this.props;
    const { isEmenu, enableOrdering } = this.state;
    return (
      <div id='page' className='hfeed site'>
        {isEmenu ? <HeaderEmenu /> : <HeaderWebOrdering />}
        <div id='content' className='site-content'>
          <Switch>
            {enableOrdering && <Route exact path='/' component={Home} />}
            {enableOrdering && (
              <Route exact path='/outlets' component={OutletSelection} />
            )}
            {enableOrdering && <Route exact path='/signIn' component={Home} />}
            {enableOrdering && <Route exact path='/cart' component={Cart} />}
            {/* TODO: component basket will remove later */}
            {enableOrdering && (
              <Route exact path='/basket' component={Basket} />
            )}
            {(isLoggedIn || !enableOrdering) && (
              <Route exact path='/profile' component={Profile} />
            )}
            {(isLoggedIn || !enableOrdering) && (
              <Route
                exact
                path='/profile/delivery-address'
                component={DeliveryAddress}
              />
            )}
            {(isLoggedIn || !enableOrdering) && (
              <Route
                exact
                path='/profile/payment-method'
                component={PaymentMethod}
              />
            )}
            {(isLoggedIn || !enableOrdering) && (
              <Route exact path='/rewards' component={Profile} />
            )}
            {isLoggedIn && <Route exact path='/inbox' component={Inbox} />}
            {isLoggedIn && <Route exact path='/voucher' component={Voucher} />}
            {isLoggedIn && (
              <Route exact path='/svc' component={StoreValueCard} />
            )}
            {isLoggedIn && (
              <Route exact path='/buy-svc' component={BuyStoreValueCard} />
            )}
            {isLoggedIn && <Route exact path='/use-svc' component={UseSVC} />}
            {isLoggedIn && <Route exact path='/setting' component={Setting} />}
            {isLoggedIn && (
              <Route exact path='/payment-method' component={PaymentMethod} />
            )}
            {isLoggedIn && (
              <Route
                exact
                path='/delivery-address'
                component={DeliveryAddress}
              />
            )}
            {isLoggedIn && (
              <Route exact path='/referral' component={Referral} />
            )}
            {isLoggedIn && (
              <Route exact path='/edit-profile' component={EditProfile} />
            )}
            {isLoggedIn && (
              <Route exact path='/my-voucher' component={MyVoucher} />
            )}
            {isLoggedIn && (
              <Route exact path='/scanTable' component={ScanTable} />
            )}
            {isLoggedIn && (
              <Route exact path='/settleSuccess' component={SettleSuccess} />
            )}
            {isLoggedIn && (
              <Route exact path='/history/detail' component={PendingDetail} />
            )}
            {isLoggedIn && (
              <Route exact path='/paid-membership' component={ListMembership} />
            )}
            {isLoggedIn && (
              <Route
                exact
                path='/detail-membership'
                component={DetailMembership}
              />
            )}
            <Route exact path='/cart' component={Cart} />
            <Route exact path='/history' component={History} />
            <Route exact path='/category' component={Categories} />
            <Route exact path='/category/:childId' component={Categories} />
            <Route
              exact
              path='/category/:categoryId/products'
              component={Products}
            />
            <Route exact path='/promotions' component={Promotions} />
            <Route
              exact
              path='/promotions-detail/:id'
              component={PromotionsDetail}
            />
            <Route exact path='/products' component={ProductSearchResult} />
            <Route exact path='/search' component={Search} />
            <Route exact path='/payment' component={Payment} />
            <Route exact path='/map' component={Map} />
            <Route exact path='/scan-barcode' component={ScanBarcode} />
            <Redirect from='*' to={!enableOrdering ? '/profile' : '/'} />
          </Switch>
          <div style={{ clear: 'both' }}></div>
          <span
            data-toggle='modal'
            data-target='#detail-product-modal'
            id='open-modal-product'
            style={{ color: 'white' }}
          ></span>
          <span
            data-toggle='modal'
            data-target='#ordering-mode'
            id='open-modal-ordering-mode'
            style={{ color: 'white' }}
          ></span>
        </div>
        {isEmenu ? <FooterEmenu /> : <FooterWebOrdering />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
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
