import React, { Component } from 'react';
import TransactionRefNo from './transactionRefNo';
import TableNo from './tableNo';
import StatusOrder from './statusOrder';
import OrderingMode from './orderingMode';
import TaxAmount from './taxAmount';
import TotalSurchargeAmount from './TotalSurchargeAmount';
import DeliveryAddressBasket from './deliveryAddressBasket';
import PickupDateTime from './pickupDateTime';
import ProviderDeliveryBasket from './providerDeliveryBasket';

export default class MenuBasket extends Component {
  render() {
    let props = this.props.data;
    let discount = 0;
    if (props.dataBasket.payments) {
      props.dataBasket.payments.forEach((items) => {
        if (items.paymentType === 'voucher' || items.paymentType === 'point') {
          discount += items.paymentAmount;
        }
      });
    }

    return (
      <div style={{ marginTop: -8 }}>
        <div
          style={{
            border: '1px solid #DCDCDC',
            borderRadius: 5,
            marginTop: 10,
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {props.dataBasket && props.dataBasket.transactionRefNo && (
            <div style={{ textAlign: 'left' }}>
              {' '}
              <TransactionRefNo data={props} />{' '}
            </div>
          )}
          {props.dataBasket &&
            (props.dataBasket.tableNo || props.scanTable) &&
            props.dataBasket.orderingMode !== 'DELIVERY' &&
            props.dataBasket.outlet && (
              <div style={{ textAlign: 'left' }}>
                {' '}
                <TableNo data={props} />{' '}
              </div>
            )}
        </div>

        <div
          style={{
            border: '1px solid #DCDCDC',
            borderRadius: 5,
            marginTop: 10,
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {props.dataBasket && (
            <div style={{ textAlign: 'left' }}>
              {' '}
              <StatusOrder data={props} />{' '}
            </div>
          )}
          <div style={{ textAlign: 'left' }}>
            <OrderingMode
              data={props}
              roleDisableNotPending={this.props.roleDisableNotPending}
              setOrderingMode={(mode) => this.props.setOrderingMode(mode)}
              getCurrency={(price) => this.props.getCurrency(price)}
              isLoggedIn={this.props.isLoggedIn}
            />
          </div>

          {props.dataBasket.orderingMode &&
            props.dataBasket.orderingMode === 'DELIVERY' && (
              <div>
                {
                  <DeliveryAddressBasket
                    data={props}
                    roleBtnClear={this.props.roleBtnClear}
                  />
                }
                {
                  <ProviderDeliveryBasket
                    data={props}
                    roleBtnClear={this.props.roleBtnClear}
                    handleSetProvaider={(item) =>
                      this.props.handleSetProvaider(item)
                    }
                  />
                }
              </div>
            )}
        </div>

        <div
          style={{
            border: '1px solid #DCDCDC',
            borderRadius: 5,
            marginTop: 10,
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {props.dataBasket.orderingMode &&
            (props.dataBasket.orderingMode === 'TAKEAWAY' ||
              props.dataBasket.orderingMode === 'STOREPICKUP' ||
              props.dataBasket.orderingMode === 'DELIVERY') && (
              <div>
                {
                  <PickupDateTime
                    data={props}
                    roleBtnClear={this.props.roleBtnClear}
                    handleOpenLogin={() => this.props.handleOpenLogin()}
                    isLoggedIn={this.props.isLoggedIn}
                    handleSetState={(field, value) =>
                      this.props.handleSetState(field, value)
                    }
                  />
                }
              </div>
            )}
        </div>

        <div
          style={{
            border: '1px solid #DCDCDC',
            borderRadius: 5,
            marginTop: 10,
            paddingTop: 5,
            paddingBottom: 5,
          }}
        >
          <div style={{ marginLeft: 10, marginRight: 10, fontSize: 14 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <div>Sub Total</div>
              <div style={{ fontWeight: 'bold' }}>
                {this.props.getCurrency(props.dataBasket.totalGrossAmount)}
              </div>
            </div>
          </div>

          {props.dataBasket.totalSurchargeAmount > 0 && (
            <TotalSurchargeAmount
              data={props}
              getCurrency={(price) => this.props.getCurrency(price)}
            />
          )}

          {props.dataBasket.provider &&
            props.dataBasket.orderingMode &&
            props.dataBasket.orderingMode === 'DELIVERY' && (
              <div style={{ marginLeft: 10, marginRight: 10, fontSize: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>Delivery Fee</div>
                  <div
                    style={{ fontWeight: 'bold' }}
                  >{`+ ${this.props.getCurrency(
                    props.dataBasket.provider.deliveryFee
                  )}`}</div>
                </div>
              </div>
            )}

          {props.dataBasket.totalTaxAmount > 0 && (
            <TaxAmount
              data={props}
              getCurrency={(price) => this.props.getCurrency(price)}
            />
          )}

          {/* {
            props.dataBasket.payments && 
            props.dataBasket.payments.map((items, key) => (
              (items.paymentType === "voucher" || items.paymentType === "point") &&
              <div key={key} style={{ marginLeft: 10, marginRight: 10, fontSize: 14 }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "#03AC0E" }}>
                  <div style={{marginRight: 10}}>
                    {items.paymentName}
                  </div>
                  <div style={{}}>
                    {`- ${this.props.getCurrency(items.paymentAmount)}`}
                  </div>
                </div>
              </div>
            ))
          } */}
        </div>

        <div
          style={{
            border: '1px solid #DCDCDC',
            borderRadius: 5,
            marginTop: 10,
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <div
            className='customer-group-name'
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>TOTAL</div>
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>
              {this.props.getCurrency(
                props.dataBasket.totalNettAmount - discount < 0
                  ? 0
                  : props.dataBasket.totalNettAmount - discount
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
