import React from "react";

function OrderingMode({ mode, alias, icon }) {
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

export default OrderingMode;
