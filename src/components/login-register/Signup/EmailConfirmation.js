import React from "react";
import { Button } from "reactstrap";

const EmailConfirmation = (props) => {
  return (
    <div className="modal-body">
      <p className="text-muted">{`Sign in to ${
        payloadResponse.email || "-"
        }`}</p>
      {this.viewUseEmailOTP()}
      <Button
        className="button"
        style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
        onClick={() => this.handleEmailLogin()}
      >
        Continue
      </Button>
    </div>
  );
};

EmailConfirmation.propTypes = {};

export default EmailConfirmation;
