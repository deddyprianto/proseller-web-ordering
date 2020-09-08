import React from "react";

const PhoneForm = (props) => {
  return (
    <div className="modal-body">
      <p className="text-muted">{`Register for ${
        payloadResponse.phoneNumber || "-"
        }`}</p>
      <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
        <label for="name">
          Name <span className="required">*</span>
        </label>
        <input
          type="text"
          className="woocommerce-Input woocommerce-Input--text input-text"
          onChange={(e) => this.handleInput("name", e.target.value)}
        />
      </p>

      <p className="woocommerce-FormRow woocommerce-FormRow--wide form-row form-row-wide">
        <label for="email">
          Email <span className="required">*</span>
        </label>
        <input
          type="email"
          className="woocommerce-Input woocommerce-Input--text input-text"
          onChange={(e) => this.handleInput("email", e.target.value)}
        />
        {!this.state.errorEmail === "" && (
          <div style={{ marginTop: -10, marginBottom: 10, color: "red" }}>
            {this.state.errorEmail}
          </div>
        )}
      </p>

      <Button
        disabled={!this.state.btnSubmit}
        className="button"
        style={{ width: "100%", marginTop: 10, borderRadius: 5 }}
        onClick={() => this.handleMobileRegister()}
      >
        Create Account
      </Button>
    </div>
  );
};

PhoneForm.propTypes = {};

export default PhoneForm;
