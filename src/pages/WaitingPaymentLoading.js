import React from "react";
import LoadingOverlayCustom from "components/loading/LoadingOverlay";

function WaitingPaymentLoading() {
  return (
    <LoadingOverlayCustom
      active={true}
      spinner
      text="Please wait, your payment is being processed..."
    ></LoadingOverlayCustom>
  );
}

export default WaitingPaymentLoading;
