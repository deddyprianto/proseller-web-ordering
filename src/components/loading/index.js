import React, { Component } from "react";
import { LoopCircleLoading } from "react-loadingg";

import styles from "./styles.module.css";

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

      <div className={styles.loaderContainer}>
        <LoopCircleLoading />
      </div>
    );
  }
}

export default Loading;
