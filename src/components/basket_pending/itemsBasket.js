import React, { Component } from "react";
import ModalProduct from "../ordering/ModalProduct";
import CardItemBasket from "./cardItemBasket";
import { connect } from "react-redux";

const Swal = require("sweetalert2");

class ItemsBasket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: {},
      isLoading: false,
      dataBasket: null,
      isNewUpdate: true,
    };
  }

  handleSelect = (key, items, isAll = null) => {
    let { dataBasket } = this.state;
    if (!isAll) {
      if (items.selected === false) items.selected = true;
      else items.selected = false;
      dataBasket.details[key] = items;
    } else {
      dataBasket.details.forEach((items) => {
        if (items.selected === false) items.selected = true;
        else items.selected = false;
      });
    }
    this.setState({ dataBasket });
  };

  componentDidMount = () => {
    console.log('databasket from itemBasket => ',this.props.dataBasket)
    this.setState({ dataBasket: this.props.dataBasket });
  };

  render() {
    let { data } = this.props;
    let { dataBasket } = this.state;
    console.log('databasket from itemBasket => ',this.props.dataBasket)
    return (
      <div style={{ marginBottom: 20, marginTop: 5 }}>
        <ModalProduct
          selectedItem={this.state.selectedItem}
          data={data}
          handleSetState={(field, value) =>
            this.props.handleSetState(field, value)
          }
        />
        {dataBasket && dataBasket.details && dataBasket.details.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
              }}
            >
              <div style={{ fontWeight: "bold", color: this.props.color.primary || "#c00a27"}}>
                {data.storeDetail.name}
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#DCDCDC",
                height: 3,
                marginBottom: 10,
                marginTop: 10,
              }}
            />
            {dataBasket.details.map((item, key) => (
              <div>
                <CardItemBasket
                  key={key}
                  data={item}
                  roleBtnClear={this.props.roleBtnClear}
                  dataBasket={dataBasket}
                  getCurrency={(price) => this.props.getCurrency(price)}
                />
                <div
                  style={{
                    backgroundColor: "#DCDCDC",
                    height: 1,
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                />
              </div>
            ))}
            <span
              data-toggle="modal"
              data-target="#detail-product-modal"
              id="detail-product-btn"
            />
          </div>
        )}
        {this.state.isLoading ? Swal.showLoading() : Swal.close()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
    basket: state.order.basket,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemsBasket);