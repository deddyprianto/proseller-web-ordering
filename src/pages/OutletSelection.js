/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import Shimmer from 'react-shimmer-effect';
import { connect } from 'react-redux';
import _ from 'lodash';

import { OutletAction } from '../redux/actions/OutletAction';
import { OrderAction } from '../redux/actions/OrderAction';
import config from '../config';
import { CONSTANT } from 'helpers';
import LoadingOverlayCustom from 'components/loading/LoadingOverlay';

const Swal = require('sweetalert2');
class OutletSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingShow: true,
      isLoading: false,
      outlets: [],
      cart: {},
      showMoreDescription: {},
    };
  }

  viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div
          style={{
            width: '100%',
            height: isHeight,
            alignSelf: 'center',
            borderRadius: '8px',
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  componentDidMount = async () => {
    let response = await this.props.dispatch(OutletAction.fetchAllOutlet(true));
    try {
      let cart = await this.props.dispatch(OrderAction.getCart());
      if (cart && cart.data) {
        await this.setState({ cart: cart.data });
      }
    } catch (e) {
      console.log(e);
    }
    await this.setState({ outlets: response });
    const showMore = response.reduce((acc, outlet) => {
      return {
        ...acc,
        [outlet.id]: false,
      };
    }, {});
    this.setState({ showMoreDescription: showMore });
    await this.setState({ loadingShow: false });
  };

  checkCartExist = async (outlet) => {
    try {
      if (
        this.state.cart &&
        this.state.cart.outlet &&
        this.state.cart.outlet.id !== outlet.id
      ) {
        Swal.fire({
          title: 'Change Outlet ?',
          text: 'You will delete your cart at the previous outlet',
          icon: 'warning',
          confirmButtonText: 'Sure',
          showCancelButton: true,
        }).then(async (data) => {
          if (data.isConfirmed) {
            this.setState({ isLoading: true });
            await this.props.dispatch(OrderAction.deleteCart());
            this.handleSelectOutlet(outlet);
            this.setState({ isLoading: false });
          }
        });
        return false;
      } else if (
        !this.props.guestCheckoutCart.message ||
        this.props.guestCheckoutCartResponse
      ) {
        Swal.fire({
          title: 'Change Outlet in Guest Mode?',
          text: 'You will delete your cart at the previous outlet in GuestMode.',
          icon: 'warning',
          confirmButtonText: 'Sure',
          showCancelButton: true,
        }).then(async (data) => {
          if (data.isConfirmed) {
            this.setState({ isLoading: true });
            await this.props.dispatch(
              OrderAction.deleteCartGuestMode(
                this.props.guestCheckoutCart?.guestID ||
                  this.props.guestCheckoutCartResponse?.guestID
              )
            );
            this.props.dispatch({ type: CONSTANT.SAVE_DATE, payload: '' });
            this.props.dispatch({ type: CONSTANT.SAVE_TIMESLOT, payload: '' });
            this.props.dispatch({ type: CONSTANT.SAVE_TIME, payload: '' });
            this.props.dispatch({
              type: CONSTANT.SET_DELIVERY_PROVIDER_GUEST_CHECKOUT,
              payload: null,
            });
            this.props.dispatch({
              type: CONSTANT.SAVE_EDIT_RESPONSE_GUESTCHECKOUT,
              payload: {},
            });
            this.setState({ isLoading: false });
            this.handleSelectOutlet(outlet);
          }
        });
      } else {
        this.handleSelectOutlet(outlet);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleSelectOutlet = async (outlet) => {
    await this.setState({ loadingShow: true });
    await this.props.dispatch(OutletAction.setDefaultOutlet(outlet));
    if (!_.isEmpty(this.props.setting)) {
      const { ShowOrderingModeModalFirst } = this.props.setting;
      if (this.props.orderingModes.length === 1) {
        await this.props.dispatch({
          type: 'SET_ORDERING_MODE',
          payload: this.props.orderingModes[0],
        });
      } else if (
        ShowOrderingModeModalFirst &&
        this.props.orderingModes.length > 1
      ) {
        document.getElementById('open-modal-ordering-mode').click();
      } else {
        this.props.dispatch({
          type: 'REMOVE_ORDERING_MODE',
        });
      }
    }
    await this.setState({ loadingShow: false });
    try {
      this.props.history.push('/');
    } catch (e) {
      console.log(e);
    }
  };

  handleShowMoreClick = async (id) => {
    this.setState((prevState) => {
      return {
        showMoreDescription: {
          ...prevState.showMoreDescription,
          [id]: !prevState.showMoreDescription[id],
        },
      };
    });
  };

  render() {
    let { loadingShow, outlets, isLoading } = this.state;
    const getLogo = this.props.getSpaceLogo;
    return (
      <LoadingOverlayCustom active={isLoading} spinner text='Loading...'>
        <div style={{ marginTop: !getLogo ? 70 : 100, marginBottom: 50 }}>
          <div id='primary' className='content-area'>
            <div className=''>
              <main
                id='main'
                className='site-main'
                style={{ textAlign: 'center', paddingBottom: 40 }}
              >
                {loadingShow ? (
                  <Row>
                    <Col sm={6}>{this.viewShimmer(50)}</Col>
                    <Col sm={6}>{this.viewShimmer(50)}</Col>
                  </Row>
                ) : (
                  <Row>
                    {outlets.map((items, keys) => (
                      <Col key={keys} sm={6}>
                        <div
                          style={{
                            backgroundColor:
                              items.orderingStatus !== 'UNAVAILABLE'
                                ? null
                                : '#ecf0f1',
                            opacity:
                              items.orderingStatus !== 'UNAVAILABLE' ? 1 : 0.6,
                            boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.2)',
                            border: '1px solid #CDCDCD',
                            padding: 10,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'row',
                            margin: 5,
                            borderRadius: 5,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              width: '100%',
                              textAlign: 'left',
                            }}
                          >
                            <div
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <div
                                className='customer-group-name'
                                style={{
                                  fontWeight: 'bold',
                                  fontSize: 14,
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                }}
                                onClick={() =>
                                  items.orderingStatus !== 'UNAVAILABLE'
                                    ? this.checkCartExist(items)
                                    : false
                                }
                              >
                                <div>
                                  {items.outletStatus === true &&
                                  items.orderingStatus === 'AVAILABLE' ? (
                                    <div
                                      style={{
                                        backgroundColor: '#2ecc71',
                                        display: 'inline-block',
                                        borderRadius: 7,
                                      }}
                                    >
                                      <p
                                        style={{
                                          padding: 4,
                                          marginBottom: -4,
                                          marginTop: -4,
                                          fontSize: 12,
                                        }}
                                      >
                                        <b style={{ color: 'white' }}>Open</b>
                                      </p>
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        backgroundColor: '#e74c3c',
                                        display: 'inline-block',
                                        borderRadius: 7,
                                      }}
                                    >
                                      <p
                                        style={{
                                          padding: 4,
                                          marginBottom: -4,
                                          marginTop: -4,
                                          fontSize: 12,
                                        }}
                                      >
                                        <b style={{ color: 'white' }}>Closed</b>
                                      </p>
                                    </div>
                                  )}
                                  <span
                                    style={{ fontSize: 17, marginLeft: 10 }}
                                  >
                                    {items.name}
                                  </span>
                                </div>
                                {items.distance && (
                                  <div>
                                    <i className='fa fa-map-marker'></i>
                                    {'  '}
                                    <span
                                      className='font-color-theme'
                                      style={{ fontSize: 11 }}
                                    >
                                      {items.distance}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {items.remark && (
                                <div style={{ fontSize: '80%' }}>
                                  <span
                                    onClick={() =>
                                      items.orderingStatus !== 'UNAVAILABLE'
                                        ? this.checkCartExist(items)
                                        : false
                                    }
                                  >
                                    {/* start 0001 */}
                                    {items.remark}
                                    {/* end 0001 */}

                                    {/* {items.remark.length > 100 &&
                                  !this.state.showMoreDescription[items.id]
                                    ? items.remark.slice(0, 100) + "..."
                                    : items.remark} */}
                                  </span>
                                  {/* {items.remark.length > 100 && (
                                  <button
                                    onClick={() =>
                                      this.handleShowMoreClick(items.id)
                                    }
                                    className="btn btn-link"
                                  >
                                    <strong>
                                      Show{" "}
                                      {!this.state.showMoreDescription[items.id]
                                        ? "more"
                                        : "less"}
                                    </strong>
                                  </button>
                                )} */}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
                {!loadingShow && outlets && outlets.length === 0 && (
                  <div>
                    <img
                      src={config.url_emptyImage}
                      alt='is empty'
                      style={{ marginTop: 30 }}
                    />
                    <div>Data is empty</div>
                  </div>
                )}
              </main>
            </div>
          </div>
          {this.state.isLoading ? Swal.showLoading() : Swal.close()}
        </div>
      </LoadingOverlayCustom>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    basket: state.order.basket,
    orderingModes: state.order.orderingModes,
    orderingMode: state.order.orderingMode,
    setting: state.order.orderingSetting,
    getSpaceLogo: state.getSpaceLogo.logo,
    guestCheckoutCart: state.guestCheckoutCart.data,
    guestCheckoutCartResponse: state.guestCheckoutCart.response,
    mode: state.guestCheckoutCart.mode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(OutletSelection);
