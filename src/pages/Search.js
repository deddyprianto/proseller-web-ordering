import React, { Component } from "react";
import { connect } from "react-redux";
import { Input } from "reactstrap";
import { ProductAction } from "../redux/actions/ProductAction";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
    };
  }

  search = async () => {
    const item = {
      isSearch: true,
      term: this.state.searchTerm
    }
    this.props.dispatch(ProductAction.setSelectedCategory(item));
    this.props.history.push(`category/${item.term}/products`);
  }

  render() {
    return (
      <div
        style={{
          zIndex: 999,
          position: "absolute",
          width: "100%",
          height: "100vh",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginLeft: 10,
            marginRight: 10,
            marginTop: "10%",
            alignItems: "center",
          }}
        >
          <i
            onClick={() => this.props.history.goBack()}
            className="fa fa-arrow-left"
            style={{ fontSize: 25, width: "10%", marginLeft: 10 }}
          ></i>
          <Input
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                this.search()
              }
            }}
            onChange={(e) => this.setState({ searchTerm: e.target.value })}
            autoFocus={true}
            type="text"
            style={{ width: "60%", borderRadius: 7 }}
          ></Input>
          <button
            onClick={this.search}
            className="background-theme"
            style={{
              width: "20%",
              backgroundColor: this.props.color.primary,
              padding: 3,
              color: "white",
            }}
          >
            Search
          </button>
        </div>

        <div style={{ marginTop: "70%" }}>
          <h4 className="customer-group-name text-center">
            Let's find a product that you want.
          </h4>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    color: state.theme.color,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
