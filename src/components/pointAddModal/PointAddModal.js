import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import CloseIcon from '@mui/icons-material/Close';

import { PaymentAction } from 'redux/actions/PaymentAction';

const mapStateToProps = (state) => {
  return {
    color: state.theme.color,
    campaignPoint: state.campaign.data,
    companyInfo: state.masterdata.companyInfo.data,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const PointAddModal = ({ open, handleClose, price, ...props }) => {
  const styles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      justifyItems: 'center',
      alignItems: 'center',
      position: 'relative',
      top: 0,
      right: 0,
    },
    rootBody: {
      backgroundColor: props.color.primary,
      paddingTop: 20,
      paddingBottom: 30,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    rootFooter: {
      backgroundColor: props.color.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: -20,
      paddingTop: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
    },
    buttonSubmit: {
      margin: 10,
      backgroundColor: props.color.primary,
      height: 50,
      fontSize: 14,
      fontWeight: 'bold',
      color: 'white',
      textTransform: 'none',
    },
    displayFlexAndJustifyCenter: {
      display: 'flex',
      justifyContent: 'center',
    },
    iconButton: {
      position: 'absolute',
      right: 1,
      top: 1,
      marginTop: 10,
    },
    iconClose: {
      height: 25,
      width: 25,
    },
    input: {
      margin: 10,
    },
    typography: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    typographyPoint: {
      color: props.color.primary,
      fontSize: 16,
      fontWeight: 'bold',
    },
    typographyPointTo: {
      fontSize: 16,
      fontWeight: 'bold',
      marginRight: 5,
      marginLeft: 5,
    },
    typographyPointToUse: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      marginLeft: 10,
    },
    typographyPickPoints: {
      margin: 20,
      fontSize: 20,
      color: props.color.primary,
      fontWeight: 'bold',
    },
    typographyRatioPoints: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    },
    typographyTotalPoints: {
      color: 'white',
      fontSize: 40,
      fontWeight: 'bold',
    },
  };
  const [ratioPoint, setRatioPoint] = useState(0);
  const [ratioCurrency, setRatioCurrency] = useState(0);
  const [pointToUse, setPointToUse] = useState(0);
  const [selectedPointValue, setSelectedPointValue] = useState(0);
  const [campaignPoint, setCampaignPoint] = useState(0);

  const handlePointRatio = () => {
    const ratio = props.campaignPoint.pointsToRebateRatio.split(':');
    setRatioPoint(ratio[0]);
    setRatioCurrency(Number(ratio[1]));
  };

  useEffect(() => {
    handlePointRatio();
    setCampaignPoint(props.campaignPoint.totalPoint);
  }, [props.campaignPoint]);

  const handleSubmit = async () => {
    const result = {
      paymentType: 'point',
      redeemValue: pointToUse,
      paymentAmount: selectedPointValue,
      isPoint: true,
    };

    props.dispatch(PaymentAction.setData(result, 'SELECT_POINT'));
    handleClose();
  };

  const handleCurrency = (price) => {
    if (props.companyInfo) {
      const result = price.toLocaleString(props.companyInfo.currency.locale, {
        style: 'currency',
        currency: props.companyInfo.currency.code,
      });

      return result;
    }
  };

  const handlePointValue = (point) => {
    const result = (point * ratioCurrency) / ratioPoint;
    setSelectedPointValue(result);
    setPointToUse(point);
  };

  const handleInput = (value) => {
    const maxPoint = (price / ratioCurrency) * ratioPoint;

    if (value >= maxPoint || value >= campaignPoint) {
      const point = maxPoint > campaignPoint ? campaignPoint : maxPoint;
      return handlePointValue(point);
    }

    if (value < 0) {
      return handlePointValue(0);
    }

    return handlePointValue(value);
  };

  const renderHeader = () => {
    return (
      <>
        <Typography style={styles.typographyPickPoints}>Pick Points</Typography>
        <div>
          <IconButton
            style={styles.iconButton}
            onClick={() => {
              handleClose();
            }}
          >
            <CloseIcon style={styles.iconClose} />
          </IconButton>
        </div>
      </>
    );
  };

  const renderBody = () => {
    return (
      <div style={styles.rootBody}>
        <Typography style={styles.typography}>My Points</Typography>
        <Typography style={styles.typographyTotalPoints}>
          {props.campaignPoint.totalPoint}
        </Typography>
        <Typography style={styles.typographyRatioPoints}>
          Redeem {ratioPoint} point to {handleCurrency(ratioCurrency)}
        </Typography>
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <div style={styles.rootFooter}>
        <div style={styles.displayFlexAndJustifyCenter}>
          <Typography style={styles.typographyPoint}>
            {pointToUse || 0}
          </Typography>
          <Typography style={styles.typographyPointTo}>points to</Typography>
          <Typography style={styles.typographyPoint}>
            {handleCurrency(selectedPointValue)}
          </Typography>
        </div>
        <Typography style={styles.typographyPointToUse}>
          Point to use :
        </Typography>
        <input
          style={styles.input}
          value={pointToUse}
          min='0'
          max='1000'
          type='number'
          onChange={(e) => {
            handleInput(e.target.value);
          }}
        />
        <Button style={styles.buttonSubmit} onClick={handleSubmit}>
          Set Point - {handleCurrency(selectedPointValue)}
        </Button>
      </div>
    );
  };
  return (
    <Dialog open={open} fullWidth maxWidth='md'>
      <div style={styles.root}>
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </div>
    </Dialog>
  );
};

PointAddModal.defaultProps = {
  open: false,
  color: {},
  dispatch: null,
  handleClose: null,
  companyInfo: {},
  campaignPoint: {},
  price: 0,
};

PointAddModal.propTypes = {
  campaignPoint: PropTypes.object,
  color: PropTypes.object,
  companyInfo: PropTypes.object,
  dispatch: PropTypes.func,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  price: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(PointAddModal);
