import loadable from '@loadable/component';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import Lottie from 'lottie-react-web';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import processingCollection from '../../assets/gif/cooking.json';
import onTheWay from '../../assets/gif/delivery.json';
import readyCollection from '../../assets/gif/food-ready.json';
import processingCollectionResto from '../../assets/gif/shopping-lady.json';
const ModalQRCode = loadable(() => import('../profile/ModalQRCode'));

export default function ViewProsessBasket({
  setting,
  data,
  setViewCart,
  handleCompletedOrdering,
}) {
  const [processingCustomGiftRetail, setProcessingCustomGiftRetail] =
    useState(processingCollection);
  const [processingCustomGiftNonRetail, setProcessingCustomGiftNonRetail] =
    useState(processingCollectionResto);
  const [GIFreadyForCollection, setGIFreadyForCollection] =
    useState(readyCollection);
  const [text, setText] = useState(
    'Please wait, We are preparing your food in the kitchen.'
  );

  useEffect(() => {
    if (setting) {
      try {
        const processingCustomGifUnparsed = setting.find(
          (it) => it.settingKey === 'CustomGIFProcessing'
        );
        if (
          processingCustomGifUnparsed &&
          processingCustomGifUnparsed.settingValue
        ) {
          const GIF = JSON.parse(processingCustomGifUnparsed.settingValue);
          setProcessingCustomGiftRetail(GIF);
          setProcessingCustomGiftNonRetail(GIF);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [setting]);

  useEffect(() => {
    if (setting) {
      try {
        const findGif = setting.find(
          (it) => it.settingKey === 'CustomGIFReadyForCollection'
        );
        if (findGif && findGif.settingValue) {
          const GIF = JSON.parse(findGif.settingValue);
          setGIFreadyForCollection(GIF);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [setting]);

  useEffect(() => {
    if (
      data.dataBasket &&
      data.dataBasket.outlet &&
      data.dataBasket.outlet.outletType === 'RETAIL'
    ) {
      setText('Please wait, We are preparing your order.');
    }
  }, [data.dataBasket]);

  return (
    <div>
      <ModalQRCode
        qrcode={data.dataBasket.cartID}
        field={'cartID'}
        title='Order QRCode'
      />
      <Row style={{ display: 'flex', justifyContent: 'center' }}>
        <Col xs='12' sm='6'>
          <div>
            <Lottie
              height={300}
              options={{
                animationData:
                  (data.dataBasket.status === 'PROCESSING' &&
                    data.dataBasket.outlet.outletType !== 'RETAIL' &&
                    processingCustomGiftRetail) ||
                  (data.dataBasket.status === 'PROCESSING' &&
                    data.dataBasket.outlet.outletType === 'RETAIL' &&
                    processingCustomGiftNonRetail) ||
                  (data.dataBasket.status === 'READY_FOR_COLLECTION' &&
                    GIFreadyForCollection) ||
                  (data.dataBasket.status === 'READY_FOR_DELIVERY' &&
                    readyCollection) ||
                  (data.dataBasket.status === 'ON_THE_WAY' && onTheWay),
              }}
            />

            {data.dataBasket.status === 'PROCESSING' && (
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{ marginTop: 40, fontSize: 18, textAlign: 'center' }}
                >
                  {text}
                </div>
                <div
                  className='color-active'
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {data.dataBasket.queueNo &&
                    (data.dataBasket.orderingMode === 'TAKEAWAY' ||
                      data.dataBasket.orderingMode === 'STOREPICKUP' ||
                      data.dataBasket.orderingMode === 'STORECHECKOUT') &&
                    'Queue No : ' + data.dataBasket.queueNo}
                  {data.storeDetail.enableTableScan === false &&
                    data.dataBasket.orderingMode === 'DINEIN' &&
                    data.dataBasket.outlet.outletType === 'QUICKSERVICE' &&
                    'Queue No : ' + data.dataBasket.queueNo}
                  {data.dataBasket.orderingMode === 'DINEIN' &&
                    data.dataBasket.outlet.outletType === 'RESTO' &&
                    'Table No : ' + data.scanTable.tableNo}
                </div>
              </div>
            )}
            {data.dataBasket.status === 'READY_FOR_COLLECTION' && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 18, textAlign: 'center' }}>
                  Yeay, your order is ready.
                </div>
                <div style={{ fontSize: 18, textAlign: 'center' }}>
                  Please come to the cashier and tap the QR Code botton below.
                </div>
                <div
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {!data.dataBasket.transactionRefNo
                    ? data.dataBasket.queueNo ||
                      (data.storeDetail.enableTableScan === false &&
                        data.dataBasket.orderingMode === 'DINEIN')
                      ? 'Queue No : ' + data.dataBasket.queueNo
                      : 'Table No : ' + data.scanTable.tableNo
                    : 'Ref No : ' + data.dataBasket.transactionRefNo}
                </div>
              </div>
            )}
            {data.dataBasket.status === 'READY_FOR_DELIVERY' && (
              <div style={{ marginBottom: 20 }}>
                <div
                  className='color-active'
                  style={{ fontSize: 18, textAlign: 'center' }}
                >
                  Yeay, your order is ready.
                </div>
                <div style={{ fontSize: 18, textAlign: 'center' }}>
                  Your order will be sent to your destination address.
                </div>
              </div>
            )}
            {data.dataBasket.status === 'ON_THE_WAY' && (
              <div>
                <div
                  className='color-active'
                  style={{ fontSize: 18, textAlign: 'center' }}
                >
                  Your order is on the way.
                </div>
                {data.deliveryAddress && (
                  <div style={{ fontSize: 18, textAlign: 'center' }}>
                    {`Go to ${data.deliveryAddress.address}, ${data.deliveryAddress.city}, ${data.deliveryAddress.postalCode}`}
                  </div>
                )}
                <div
                  className='color-active'
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {`${
                    data.dataBasket.transactionRefNo
                      ? `Ref No : ${data.dataBasket.transactionRefNo}`
                      : `Queue No : ${data.dataBasket.queueNo}`
                  }`}
                </div>
                {data.dataBasket.trackingNo && (
                  <div
                    className='profile-dashboard'
                    style={{
                      marginTop: 10,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 10,
                    }}
                  >
                    {'Tracking No : ' + data.dataBasket.trackingNo}
                  </div>
                )}
                {data.dataBasket.deliveryProvider && (
                  <div
                    className='border-theme'
                    style={{
                      marginBottom: 10,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 10,
                    }}
                  >
                    {'Provider : ' + data.dataBasket.deliveryProvider}
                  </div>
                )}
              </div>
            )}
          </div>
        </Col>
      </Row>

      <div
        className='background-theme'
        style={{
          padding: 10,
          width: '101%',
          marginLeft: data.widthSelected >= 750 ? -55 : -15,
          marginBottom: 55,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          position: 'fixed',
          bottom: 0,
          boxShadow: '1px -2px 2px rgba(128, 128, 128, 0.5)',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={() => setViewCart(true)}
            style={{
              width: '45%',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
            }}
          >
            <i
              className='fa fa-shopping-cart'
              aria-hidden='true'
              style={{ fontSize: 20, marginRight: 10 }}
            />
            Detail Order
          </Button>
          {data.dataBasket.orderingMode !== 'DELIVERY' && (
            <Button
              disabled={
                data.dataBasket.status === 'CONFIRMED' ||
                data.dataBasket.status === 'PROCESSING'
                  ? true
                  : false
              }
              data-toggle='modal'
              data-target='#qrcode-modal'
              style={{
                width: '45%',
                backgroundColor: '#20a8d8',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
              }}
            >
              <i
                className='fa fa-qrcode'
                style={{ fontSize: 20, marginRight: 10 }}
              ></i>{' '}
              Order Code
            </Button>
          )}
          {data.dataBasket.orderingMode === 'DELIVERY' && (
            <Button
              disabled={data.dataBasket.status === 'ON_THE_WAY' ? false : true}
              onClick={() => handleCompletedOrdering('COMPLETED')}
              style={{
                width: '45%',
                backgroundColor: '#20a8d8',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
              }}
            >
              <CheckCircleOutlineIcon
                style={{ fontSize: 20, marginRight: 10 }}
              />{' '}
              Received
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
