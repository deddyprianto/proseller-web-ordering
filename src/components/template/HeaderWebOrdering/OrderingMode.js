import React from "react";
import { connect } from "react-redux";

function OrderingMode({ mode, alias, icon, dispatch }) {
  const showOrderingModeModal = () => {
    document.getElementById("open-modal-ordering-mode").click();
  };
  return (
    <div
      className="color"
      style={{ marginTop: "0.3rem", cursor: "pointer" }}
      onClick={showOrderingModeModal}
    >
      <i className={`fa ${icon}`}></i>
      {alias || mode}{" "}
      <i
        style={{ marginLeft: 6, fontSize: 10 }}
        className="fa fa-chevron-right"
      />
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};
export default connect(() => ({}), mapDispatchToProps)(OrderingMode);
