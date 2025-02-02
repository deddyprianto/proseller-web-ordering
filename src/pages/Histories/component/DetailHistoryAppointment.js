import React, { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Swal from 'sweetalert2';

import fontStyles from '../style/styles.module.css';
import {
  convertTimeToStr,
  convertFormatDate,
  phonePrefixFormatter,
} from 'helpers/appointmentHelper';
import { OutletAction } from 'redux/actions/OutletAction';
import { isEmpty } from 'helpers/utils';
import fontStyleCustom from 'pages/GuestCheckout/style/styles.module.css';
import ModalDetailHistory from 'components/history/ModalDetailHistory';
import { HistoryAction } from 'redux/actions/HistoryAction';

const DetailHistoryAppointment = ({
  setIsOpenModalDetail,
  item,
  handleCurrency,
  tabName,
  settingAppoinment,
  isOpenModalDetail,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const color = useSelector((state) => state.theme.color);
  const setting = useSelector((state) => state.order.setting);
  const companyInfo = useSelector((state) => state.masterdata.companyInfo.data);

  const [detailData, setDetailData] = useState({});

  const additionInfoBookSummarySetting = setting.find((items) => {
    return items.settingKey === 'AdditionalInfoBookingSummaryText';
  });

  const styleSheet = {
    container: {
      width: '45%',
      marginLeft: 'auto',
      marginRight: 'auto',
      backgroundColor: 'white',
      height: '92vh',
      borderRadius: '8px',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: '1fr 85px',
      gap: '0px 15px',
      gridTemplateAreas: '"."\n    "."',
      overflowY: 'auto',
    },
    gridStyle: {
      display: 'grid',
      gridTemplateColumns: '50px 1fr 50px',
      gridTemplateRows: '1fr',
      gap: '0px 0px',
      gridAutoFlow: 'row',
      gridTemplateAreas: '". . ."',
      cursor: 'pointer',
    },
    modalModif: {
      '&.MuiTypography-root': {
        padding: 0,
        margin: 0,
        marginTop: '10px',
        marginBottom: '10px',
      },
      '&.MuiDialogContent-root': {
        padding: 0,
        margin: 0,
      },
    },
  };

  const handleContactUs = async () => {
    const currentOutlet = await dispatch(
      OutletAction.getOutletById(item?.outlet?.id)
    );

    let phoneNumber = currentOutlet?.phoneNo;

    if (isNaN(phoneNumber?.charAt(0))) {
      phoneNumber = phoneNumber?.slice(1);
    }

    if (
      phoneNumber?.charAt(0) === '0' &&
      ![62, 65, 60].some((code) => phoneNumber.startsWith(code.toString()))
    ) {
      const phonePrefix = phonePrefixFormatter(currentOutlet?.countryCode);
      phoneNumber = phonePrefix + phoneNumber.slice(1);
    }

    if (!isEmpty(phoneNumber)) {
      const url = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
      return window.open(url, '_blank');
    } else {
      Swal.fire({
        title: `<p style='padding-top: 10px'>Contact Number Not Available</p>`,
        html: `<h5 style='color:#B7B7B7; font-size:14px'>Sorry, the contact number is not available right now. Please, try again later.</h5>`,
        allowOutsideClick: false,
        confirmButtonColor: color?.primary,
        width: '40em',
        customClass: {
          confirmButton: fontStyleCustom.buttonSweetAlert,
          title: fontStyleCustom.fontTitleSweetAlert,
          container: fontStyles.swalContainer,
        },
      });
    }
  };

  const RenderHeader = () => {
    return (
      <div
        style={{
          ...styleSheet.gridStyle,
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <ArrowBackIosIcon
          sx={{ color: color.primary }}
          fontSize='large'
          onClick={() => setIsOpenModalDetail(false)}
        />
        <p
          className={fontStyles.myFont}
          style={{
            padding: 0,
            margin: 0,
            justifySelf: 'start',
            fontWeight: 700,
            fontSize: '20px',
            color: color.primary,
          }}
        >
          Booking Detail
        </p>
      </div>
    );
  };
  const RenderNotify = () => {
    const backgroundColorCustom =
      tabName === 'Submitted'
        ? 'rgba(255, 253, 217, 1)'
        : tabName === 'Upcoming'
        ? 'rgba(205, 241, 255, 1)'
        : tabName === 'Ongoing'
        ? 'rgba(255, 245, 245, 1)'
        : tabName === 'Completed'
        ? 'rgba(236, 255, 227, 1)'
        : 'rgba(255, 189, 189, 1)';
    const fontColor =
      tabName === 'Submitted'
        ? 'rgba(255, 153, 0, 1)'
        : tabName === 'Upcoming'
        ? 'rgba(31, 148, 255, 1)'
        : tabName === 'Ongoing'
        ? 'rgba(255, 85, 99, 1)'
        : tabName === 'Completed'
        ? 'rgba(56, 164, 5, 1)'
        : 'rgba(206, 17, 17, 1)';
    const title =
      tabName === 'Submitted'
        ? 'Booking Submitted'
        : tabName === 'Upcoming'
        ? 'Booking Confirmed'
        : tabName === 'Ongoing'
        ? 'Appointment Ongoing'
        : tabName === 'Completed'
        ? 'Booking Completed'
        : 'Booking Cancelled';
    const description =
      tabName === 'Submitted'
        ? ' Hang on! Your booking needs to be confirmed. Our staff will directly contact you within 24H.'
        : tabName === 'Upcoming'
        ? 'Yeay your booking is already confirmed, Hope you can make it in time. See you there.'
        : tabName === 'Ongoing'
        ? 'Have a pleasant experience!'
        : tabName === 'Completed'
        ? 'Thank you for choosing us. See you next time!'
        : `Your booking has been cancelled because [reason]`;
    return (
      <div
        className={fontStyles.myFont}
        style={{
          width: '92%',
          margin: 'auto',
          backgroundColor: backgroundColorCustom,
          color: fontColor,
          borderRadius: '10px',
          marginTop: '20px',
          padding: '9px',
          borderLeft: `5px solid ${fontColor}`,
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{title}</div>
        <div style={{ fontWeight: 500, fontSize: '13px', lineHeight: '20px' }}>
          {description}
        </div>
      </div>
    );
  };
  const RenderIDBooking = () => {
    return (
      <div
        className={fontStyles.myFont}
        style={{ width: '90%', margin: 'auto', marginTop: '20px' }}
      >
        <div
          style={{
            color: 'rgba(0, 0, 0, 1)',
            fontWeight: 500,
            fontSize: '14px',
          }}
        >
          Booking ID:
        </div>
        <div
          style={{
            color: color.primary,
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          {item.bookingId}
        </div>
      </div>
    );
  };

  const BookingDetail = () => {
    return (
      <div
        className={fontStyles.myFont}
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '10px',
          backgroundColor: `${color.primary}10`,
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '10px 0px',
        }}
      >
        <div style={{ width: '90%', margin: 'auto', marginTop: '15px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
            Booking Detail
          </div>
          <div
            style={{
              marginTop: '15px',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gridAutoColumns: '1fr',
              gap: '27px 0px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '". ."\n    ". ."\n ',
            }}
          >
            <div>
              <div
                style={{ fontWeight: 600, fontSize: '14px', color: 'black' }}
              >
                Date
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: color.primary,
                  fontSize: '14px',
                }}
              >
                {convertFormatDate(item.bookingDate)}
              </div>
            </div>
            <div>
              <div
                style={{ fontWeight: 600, fontSize: '14px', color: 'black' }}
              >
                Start Time
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: color.primary,
                  fontSize: '14px',
                }}
              >
                {item.serviceTime?.start}
              </div>
            </div>
            <div>
              <div
                style={{ fontWeight: 600, fontSize: '14px', color: 'black' }}
              >
                Stylist
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: color.primary,
                  fontSize: '14px',
                }}
              >
                {item.staff.name}
              </div>
            </div>
            <div>
              <div
                style={{ fontWeight: 600, fontSize: '14px', color: 'black' }}
              >
                Duration
              </div>
              <div
                style={{
                  fontWeight: 700,
                  color: color.primary,
                  fontSize: '14px',
                }}
              >
                {convertTimeToStr(item?.totalDuration)}
              </div>
            </div>
          </div>
          <div
            style={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}
          >
            <div
              style={{ fontWeight: 'bold', fontSize: '14px', color: 'black' }}
            >
              Outlet
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '14px',
                color: color.primary,
              }}
            >
              {item.outlet.name}
            </div>
            <div
              style={{
                fontWeight: 600,
                color: 'rgba(157, 157, 157, 1)',
                fontSize: '14px',
              }}
            >
              {item.outlet?.address}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BookingNotes = () => {
    return (
      <div
        className={fontStyles.myFont}
        style={{
          width: '93%',
          margin: 'auto',
          backgroundColor: `${color.primary}10`,
        }}
      >
        <div style={{ width: '90%', margin: 'auto' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
            Booking Notes
          </div>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'black',
            }}
          >
            {item.note ? item.note : '-'}
          </div>
        </div>
      </div>
    );
  };

  const ServiceDetail = () => {
    return (
      <div
        className={fontStyles.myFont}
        style={{
          width: '93%',
          margin: 'auto',
          backgroundColor: `${color.primary}10`,
          borderBottomLeftRadius: '20px',
          borderBottomRightRadius: '20px',
          paddingBottom: '20px',
        }}
      >
        <div style={{ width: '90%', margin: 'auto' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
            Service Detail
          </div>
          {item.details.map((item) => (
            <div
              key={item.id}
              style={{
                marginTop: '10px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 100px',
                gridTemplateRows: '1fr',
                gridAutoColumns: '1fr',
                gap: '0px 0px',
                gridAutoFlow: 'row',
                gridTemplateAreas: '". ."',
              }}
            >
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'black',
                }}
              >
                {item.product.name}
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  justifySelf: 'self-end',
                  color: color.primary,
                  fontSize: '14px',
                }}
              >
                {settingAppoinment
                  ? handleCurrency(item.product.retailPrice)
                  : convertTimeToStr(item.product.duration)}
              </div>
            </div>
          ))}
          <div
            style={{
              marginTop: '25px',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 100px',
              gridTemplateRows: '1fr',
              gridAutoColumns: '1fr',
              gap: '0px 0px',
              gridAutoFlow: 'row',
              gridTemplateAreas: '". ."',
            }}
          >
            <div
              style={{
                fontWeight: 600,
                color: 'black',
              }}
            >
              Estimated {settingAppoinment ? 'Price' : 'Duration'}
            </div>
            <div
              style={{
                fontWeight: 'bold',
                justifySelf: 'self-end',
                color: color.primary,
              }}
            >
              {settingAppoinment
                ? handleCurrency(item.totalNettAmount)
                : convertTimeToStr(item.totalDuration)}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const Information = () => {
    return (
      <div
        className={fontStyles.myFont}
        style={{
          width: '93%',
          margin: 'auto',
          marginTop: '10px',
          backgroundColor: `${color.primary}10`,
          borderRadius: '20px',
          padding: '15px 0px',
          marginBottom: tabName === 'Cancelled' ? '10px' : 0,
        }}
      >
        <div style={{ width: '90%', margin: 'auto' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'black' }}>
            Information
          </div>
          <div
            style={{
              color: 'black',
              fontWeight: 500,
              fontSize: '14px',
              marginTop: '10px',
            }}
            dangerouslySetInnerHTML={{
              __html: additionInfoBookSummarySetting?.settingValue,
            }}
          />
        </div>
      </div>
    );
  };

  const handleViewOrderDetail = async () => {
    const refId = item.transactionId;
    if (!isEmpty(refId)) {
      const data = await dispatch(HistoryAction.getTransactionById(refId));

      setDetailData(data);
    }
  };

  const ButtonPrice = () => {
    if (tabName === 'Cancelled') {
      return null;
    } else if (tabName === 'Completed') {
      return (
        <div
          style={{
            width: '93%',
            margin: '10px 0',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr',
            gridAutoColumns: '1fr',
            gap: '0px 10px',
            gridAutoFlow: 'row',
          }}
        >
          <div
            onClick={() => handleContactUs()}
            className={fontStyles.myFont}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              color: color.primary,
              borderRadius: '10px',
              padding: '5px',
              fontSize: '14px',
              fontWeight: 600,
              border: `1px solid ${color.primary}`,
            }}
          >
            Contact Us
          </div>
          <div
            className={fontStyles.myFont}
            data-toggle='modal'
            data-target='#detail-transaction-modal'
            onClick={() => handleViewOrderDetail()}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: color.primary,
              color: 'white',
              borderRadius: '10px',
              padding: '5px',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            View Order Detail
          </div>
        </div>
      );
    } else {
      return (
        <div
          onClick={() => handleContactUs()}
          className={fontStyles.myFont}
          style={{
            width: '93%',
            margin: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.primary,
            color: 'white',
            borderRadius: '10px',
            padding: '5px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Contact Us
        </div>
      );
    }
  };
  const RenderTextNotif = () => {
    if (tabName === 'Completed' || tabName === 'Cancelled') {
      return null;
    } else {
      return (
        <div
          className={fontStyles.myFont}
          style={{
            fontSize: '14px',
            width: '90%',
            margin: 'auto',
            fontWeight: 500,
            color: 'black',
            marginBottom: '10px',
            lineHeight: '20px',
          }}
        >
          Contact our staff for{' '}
          <span style={{ fontWeight: 'bold' }}>
            reschedule and other informations
          </span>
        </div>
      );
    }
  };
  const RenderHr = () => {
    return (
      <div
        style={{
          width: '93%',
          backgroundColor: `${color.primary}10`,
          padding: '10px 0px',
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: '50px 1fr 50px',
          gridTemplateRows: '1fr',
          gridAutoColumns: '1fr',
          gap: '0px 0px',
          gridAutoFlow: 'row',
          gridTemplateAreas: '". . ."',
        }}
      >
        <div
          style={{
            width: '30px',
            backgroundColor: 'white',
            height: '37px',
            borderRadius: '100%',
            marginLeft: '-10px',
            color: 'transparent',
          }}
        >
          p
        </div>
        <div style={{ width: '100%', color: 'transparent' }}>p</div>
        <div
          style={{
            justifySelf: 'end',
            width: '30px',
            backgroundColor: 'white',
            height: '37px',
            borderRadius: '100%',
            marginRight: '-10px',
            color: 'transparent',
          }}
        >
          p
        </div>
      </div>
    );
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth='md'
      open={isOpenModalDetail}
      onClose={() => setIsOpenModalDetail(false)}
      disableEnforceFocus
    >
      <DialogTitle sx={styleSheet.modalModif}>
        <RenderHeader />
      </DialogTitle>
      <DialogContent sx={styleSheet.modalModif}>
        <ModalDetailHistory
          detail={detailData}
          countryCode={companyInfo?.countryCode}
        />
        <RenderNotify />
        <RenderIDBooking />
        <BookingDetail />
        <BookingNotes />
        <RenderHr />
        <ServiceDetail />
        <Information />
      </DialogContent>

      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <RenderTextNotif />
        <ButtonPrice />
      </DialogActions>
    </Dialog>
  );
};

export default DetailHistoryAppointment;
