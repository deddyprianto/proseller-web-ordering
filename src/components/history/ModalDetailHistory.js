import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';

import { isEmptyArray } from '../../helpers/CheckEmpty';

class ModalDetailHistory extends Component {
  getCurrency = (price) => {
    if (this.props.companyInfo) {
      if (price !== undefined) {
        const { currency } = this.props.companyInfo;
        if (!price || price === '-') price = 0;
        let result = price.toLocaleString(currency.locale, {
          style: 'currency',
          currency: currency.code,
        });
        return result;
      }
    }
  };

  renderOtherPaymentMethod = () => {
    try {
      let data = [];
      const { detail } = this.props;
      if (detail.payments.length > 0) {
        for (let i = 0; i < detail.payments.length; i++) {
          if (
            detail.payments[i].isVoucher !== true &&
            detail.payments[i].isPoint !== true &&
            detail.payments[i].isAppPayment !== true
          ) {
            data.push(
              <div
                style={{
                  marginLeft: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {detail.payments[i].paymentType}
                </div>
                <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                  {this.getCurrency(detail.payments[i].paymentAmount)}
                </div>
              </div>
            );
          }
        }
        return data;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  render() {
    const { detail, companyInfo } = this.props;
    let discount = 0;
    const handleNaming =
      (companyInfo?.companyName === 'Muji' ||
        companyInfo?.companyName === 'newmujicafe') &&
      detail?.orderingMode === 'TAKEAWAY'
        ? 'TAKEAWAY SURCHARGE'
        : 'SERVICE CHARGE';

    if (detail?.payments) {
      detail.payments.forEach((items) => {
        if (
          items.paymentType === 'voucher' ||
          items.paymentType === 'point' ||
          items.paymentType === 'Store Value Card'
        ) {
          discount += items.paymentAmount;
        }
      });
    }
    return (
      <div>
        <div
          className='modal fade'
          id='detail-transaction-modal'
          tabIndex={-1}
          role='dialog'
          aria-labelledby='exampleModalCenterTitle'
          aria-hidden='true'
          style={{ zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className='modal-dialog modal-dialog-centered' role='document'>
            <div
              className='modal-content'
              style={{ width: '100%', marginTop: 100, marginBottom: 100 }}
            >
              <div
                className='modal-header'
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <h5
                  className='modal-title'
                  id='exampleModalLabel'
                  style={{ fontSize: 18 }}
                >
                  Detail Transaction
                </h5>
                <button
                  type='button'
                  className='close'
                  data-dismiss='modal'
                  aria-label='Close'
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 13,
                  }}
                >
                  <span aria-hidden='true' style={{ fontSize: 30 }}>
                    ×
                  </span>
                </button>
              </div>
              {detail && Object.keys(detail).length > 0 ? (
                <div className='modal-body'>
                  {detail.status && (
                    <div>
                      <div
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            textAlign: 'left',
                            lineHeight: '17px',
                          }}
                        >
                          STATUS.
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            textAlign: 'right',
                            lineHeight: '17px',
                          }}
                        >
                          {detail.status}
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: '#CDCDCD',
                          height: 1,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                    </div>
                  )}
                  {(detail.transactionRefNo || detail.referenceNo) && (
                    <div>
                      <div
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            textAlign: 'left',
                            lineHeight: '17px',
                          }}
                        >
                          REF NO.
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            textAlign: 'right',
                            lineHeight: '17px',
                          }}
                        >
                          {detail.transactionRefNo || detail.referenceNo}
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: '#CDCDCD',
                          height: 1,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                    </div>
                  )}
                  {detail.orderingMode === 'DINEIN' && detail.tableNo ? (
                    <div>
                      <div
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            textAlign: 'left',
                            lineHeight: '17px',
                          }}
                        >
                          TABLE NO.
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            textAlign: 'right',
                            lineHeight: '17px',
                          }}
                        >
                          {detail.tableNo}
                        </div>
                      </div>

                      <div
                        style={{
                          backgroundColor: '#CDCDCD',
                          height: 1,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                    </div>
                  ) : (
                    detail.queueNo && (
                      <div>
                        <div
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div
                            style={{
                              fontSize: 14,
                              textAlign: 'left',
                              lineHeight: '17px',
                            }}
                          >
                            QUEUE NO.
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 'bold',
                              textAlign: 'right',
                              lineHeight: '17px',
                            }}
                          >
                            {detail.queueNo}
                          </div>
                        </div>

                        <div
                          style={{
                            backgroundColor: '#CDCDCD',
                            height: 1,
                            marginTop: 10,
                            marginBottom: 10,
                          }}
                        />
                      </div>
                    )
                  )}
                  <div
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ fontSize: 14 }}>DATE</div>
                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                      {moment(detail.createdAt).format('ll') +
                        ' • ' +
                        moment(detail.createdAt).format('LT')}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#CDCDCD',
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  {detail.outletName && (
                    <div
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          textAlign: 'left',
                          lineHeight: '17px',
                        }}
                      >
                        OUTLET NAME
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          textAlign: 'right',
                          lineHeight: '17px',
                        }}
                      >
                        {detail.outletName}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      backgroundColor: '#CDCDCD',
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ fontSize: 14 }}>EARNED POINTS</div>
                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                      {detail.point}
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#CDCDCD',
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  <div style={{ fontSize: 14, textAlign: 'left' }}>
                    DETAIL ORDER :
                  </div>
                  {!isEmptyArray(detail.dataPay) &&
                    detail.dataPay.map((item, key) => (
                      <div
                        key={key}
                        style={{
                          // marginLeft: 10,
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 5,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            textAlign: 'left',
                          }}
                        >{`${item.qty}x ${item.itemName}`}</div>
                        <div style={{ fontSize: 12, fontWeight: 'bold' }}>
                          {this.getCurrency(item.price)}
                        </div>
                      </div>
                    ))}

                  {isEmptyArray(detail.dataPay) &&
                    !isEmptyArray(detail.details) &&
                    detail.details.map((item, key) => (
                      <div
                        key={key}
                        style={{
                          marginLeft: 10,
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 5,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            textAlign: 'left',
                          }}
                        >
                          {item.name
                            ? detail.dataPay?.storeValueCard
                              ? `${item.name}`
                              : `${
                                  item.period
                                } ${item.periodUnit?.toLowerCase()} Membership ${
                                  item.name
                                }`
                            : `${item.quantity}x ${item.product.name}`}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 'bold' }}>
                          {item.price
                            ? this.getCurrency(item.price)
                            : this.getCurrency(item.unitPrice)}
                        </div>
                      </div>
                    ))}

                  <div
                    style={{
                      backgroundColor: '#CDCDCD',
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ fontSize: 14 }}>SUBTOTAL</div>
                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                      {this.getCurrency(
                        detail.totalGrossAmount || detail.price
                      )}
                    </div>
                  </div>

                  {detail?.totalSurchargeAmount !== 0 && (
                    <>
                      <div
                        style={{
                          backgroundColor: '#CDCDCD',
                          height: 1,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                      <div
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ fontSize: 14 }}>{handleNaming}</div>
                        <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                          {`+ ${this.getCurrency(detail.totalSurchargeAmount)}`}
                        </div>
                      </div>
                    </>
                  )}

                  {detail.deliveryFee ? (
                    <div>
                      <div
                        style={{
                          backgroundColor: '#CDCDCD',
                          height: 1,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                      <div
                        style={{
                          marginLeft: 5,
                          marginRight: 5,
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ fontSize: 14 }}>DELIVERY FEE</div>
                        <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                          {`+ ${this.getCurrency(detail.deliveryFee)}`}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div
                    style={{
                      backgroundColor: '#CDCDCD',
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />

                  {detail.totalTaxAmount && (
                    <div
                      style={{
                        marginLeft: 5,
                        marginRight: 5,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ fontSize: 14 }}>TAX AMOUNT</div>
                      <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                        {`+ ${this.getCurrency(detail.totalTaxAmount)}`}
                      </div>
                    </div>
                  )}

                  {detail.payments && (
                    <div>
                      <div
                        style={{
                          backgroundColor: '#CDCDCD',
                          height: 1,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                      {detail.payments.map(
                        (items, key) =>
                          (items.paymentType === 'voucher' ||
                            items.paymentType === 'point') && (
                            <div
                              key={key}
                              style={{
                                marginLeft: 5,
                                marginRight: 5,
                                display: 'flex',
                                justifyContent: 'flex-end',
                                color: '#03AC0E',
                              }}
                            >
                              <div style={{ fontSize: 14, marginRight: 10 }}>
                                {items.paymentName}
                              </div>
                              <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                                {`- ${this.getCurrency(items.paymentAmount)}`}
                              </div>
                            </div>
                          )
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      backgroundColor: '#CDCDCD',
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                  <div
                    style={{
                      marginLeft: 5,
                      marginRight: 5,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ fontSize: 14 }}>TOTAL</div>
                    <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                      {detail.totalNettAmount === undefined
                        ? this.getCurrency(detail.subTotal)
                        : this.getCurrency(
                            detail.totalNettAmount - discount < 0
                              ? 0
                              : detail.totalNettAmount - discount
                          )}
                    </div>
                  </div>

                  {detail.paymentType && detail.status === 'COMPLETED' && (
                    <div>
                      <div
                        style={{
                          backgroundColor: '#CDCDCD',
                          height: 1,
                          marginTop: 10,
                          marginBottom: 10,
                        }}
                      />
                      <div style={{ fontSize: 14, textAlign: 'left' }}>
                        PAYMENT TYPE
                      </div>
                      {detail.paymentType && (
                        <div
                          style={{
                            marginLeft: 10,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                            {detail.paymentCard.paymentName}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                            {this.getCurrency(
                              (detail.totalNettAmount || detail.price) -
                                discount
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {this.renderOtherPaymentMethod()}

                  <div
                    style={{
                      backgroundColor: '#CDCDCD',
                      height: 1,
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                  />
                </div>
              ) : (
                <div className='modal-body'>
                  <div
                    style={{
                      height: '10vh',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {detail !== undefined ? (
                      <CircularProgress
                        sx={{ color: this.props.color?.primary }}
                      />
                    ) : (
                      <div>
                        Error, please contact the customer service. Thank you
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    companyInfo: state.masterdata.companyInfo.data,
    color: state.theme.color,
  };
};

export default connect(mapStateToProps, {})(ModalDetailHistory);
