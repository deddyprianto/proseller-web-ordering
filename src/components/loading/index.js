import React, { Component } from "react";
import { LoopCircleLoading } from "react-loadingg";

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading1: false,
      loading2: false,
    };
  }

  componentDidMount = () => {
    try {
      document.getElementById("loading-load").showModal();
    } catch (error) {
      console.log("show loading");
    }
  };

  render() {
    return (
      // <div
      //   className="modal fade"
      //   id="loading-modal"
      //   tabIndex={-1}
      //   role="dialog"
      //   aria-labelledby="exampleModalCenterTitle"
      //   aria-hidden="true"
      // >
      //   <div className="modal-dialog modal-dialog-centered" role="document">
      //     <div
      //       className="animated fadeIn pt-3 text-center"
      //       id="loading-load"
      //       style={{ zIndex: 1500, backgroundColor: "#FFF" }}
      //     >
      //       <LoopCircleLoading />
      //     </div>
      //   </div>
      //   <span
      //     id="btn-loading"
      //     data-toggle="modal"
      //     data-target="#loading-modal"
      //   />
      // </div>

      <dialog
        className="animated fadeIn pt-3 text-center"
        id="loading-load"
        style={{
          zIndex: 200,
          position: "fixed",
          border: "1px solid #FFF",
          width: 80,
          height: 80,
          borderRadius: 80,
          backgroundColor: "#fff",
          boxShadow: "-1px 1px 5px rgba(128, 128, 128, 0.7)",
        }}
      >
        <LoopCircleLoading />
      </dialog>
    );
  }
}

export default Loading;
