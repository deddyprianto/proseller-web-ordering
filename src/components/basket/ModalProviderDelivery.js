import React, { useEffect } from "react";
import { connect } from "react-redux";

import { OrderAction } from "../../redux/actions/OrderAction";

import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

const ModalProviderDelivery = ({
  deliveryProviders,
  handleSetProvaider,
  dispatch,
  basket,
  deliveryAddress,
  companyInfo,
}) => {
  const getCurrency = (price) => {
    if (companyInfo) {
      if (price !== undefined) {
        const { currency } = companyInfo;
        if (!price || price === "-") price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: "currency",
          currency: currency.code,
        });
        return result;
      }
    }
    return price;
  };

  const handleProviderClick = (data) => {
    dispatch({
      type: "SET_SELECTED_DELIVERY_PROVIDERS",
      payload: data,
    });
    handleSetProvaider(data);
  };

  const refreshDeliveryProvider = async () => {
    const newDeliveryProvider = await Promise.all(
      deliveryProviders.map(async (provider) => {
        const payload = {
          outletId: basket.outlet.id,
          cartID: basket.cartID,
          provider: provider.id,
          service: provider.name,
          deliveryAddress,
        };
        const response = await dispatch(OrderAction.getCalculateFee(payload));
        return {
          ...provider,
          deliveryFee: getCurrency(response.deliveryFee),
          deliveryFeeFloat: response.deliveryFee,
        };
      })
    );
    dispatch({ type: "SET_DELIVERY_PROVIDERS", payload: newDeliveryProvider });
  };
  useEffect(() => {
    if (deliveryAddress) {
      refreshDeliveryProvider();
    }
  }, [deliveryAddress]);
  return (
    <div
      className="modal fade"
      id="provider-delivery-modal"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-product modal-dialog-centered modal-full"
        role="document"
        style={{ justifyContent: "center" }}
      >
        <div
          className="modal-content"
          style={{ width: "80%", marginTop: 100, marginBottom: 100 }}
        >
          <div
            className="modal-header"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h5
              className="modal-title"
              id="exampleModalLabel"
              style={{ fontSize: 20 }}
            >
              Provider
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              style={{
                position: "absolute",
                right: 10,
                top: 16,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 30 }}>
                ×
              </span>
            </button>
          </div>
          <div className="modal-body">
            {deliveryProviders.map((item, key) => (
              <button
                key={key}
                className={item.default && "border-theme"}
                style={{
                  boxShadow: "1px 1px 5px rgba(128, 128, 128, 0.3)",
                  padding: 10,
                  borderRadius: 5,
                  marginBottom: 5,
                  border: !item.default && "1px solid gray",
                  backgroundColor: "white",
                  width: "100%",
                }}
                disabled={!item.deliveryFee || item.deliveryFeeFloat < 0}
                data-dismiss="modal"
                onClick={() => handleProviderClick(item)}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <AssignmentIndIcon style={{ color: "gray" }} />
                      <div style={{ marginLeft: 10 }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: 14,
                            color: "gray",
                          }}
                        >
                          {item.name}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: 14,
                        color: "gray",
                      }}
                    >
                      {item.deliveryFee && item.deliveryFeeFloat > -1
                        ? item.deliveryFee
                        : "-"}
                    </div>
                  </div>
                  {item.deliveryFeeFloat && item.deliveryFeeFloat < 0 ? (
                    <div
                      className="text-left text-danger text-small"
                      style={{ fontSize: "1.1rem", fontWeight: "600" }}
                    >
                      <em>
                        This delivery provider is not available for your area.
                      </em>
                    </div>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    deliveryProviders: state.order.deliveryProviders,
    basket: state.order.basket,
    deliveryAddress: state.order.deliveryAddress,
    companyInfo: state.masterdata.companyInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalProviderDelivery);
