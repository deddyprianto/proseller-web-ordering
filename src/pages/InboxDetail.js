import React, { useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import moment from 'moment';
import rewards from 'assets/images/rewards.png';
import { useSelector, useDispatch } from 'react-redux';
import { isEmptyArray, isEmptyObject } from 'helpers/CheckEmpty';
import screen from 'hooks/useWindowSize';
import customStyleFont from '../components/inbox/css/style.module.css';
import { InboxAction } from 'redux/actions/InboxAction';
import customStyleCSS from 'components/inbox/css/style.module.css';
const RenderHeader = ({ props, color }) => {
  return (
    <div
      onClick={() => props.history.goBack()}
      style={{
        width: '100%',
        background: color?.background,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        display: 'grid',
        gridTemplateColumns: '50px 1fr',
        gridTemplateRows: '1fr',
        gap: '0px 0px',
        gridAutoFlow: 'row',
        gridTemplateAreas: '". ."',
        padding: '10px 0px',
        cursor: 'pointer',
      }}
    >
      <ArrowBackIosIcon
        fontSize='large'
        sx={{ justifySelf: 'center', alignSelf: 'center' }}
      />
      <div
        style={{
          color: 'rgba(52, 58, 74, 1)',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        Back
      </div>
    </div>
  );
};

const RenderContent = ({ broadcastItem, color }) => {
  return (
    <div
      style={{
        color: 'rgba(52, 58, 74, 1)',
        padding: '16px',
      }}
    >
      <div
        style={{
          fontWeight: 'bold',
          fontSize: '12px',
          color: 'black',
          marginBottom: '16px',
        }}
      >
        {moment(broadcastItem?.createdOn).format('DD/MM/YY HH:mm')}
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: broadcastItem?.message,
        }}
        className={customStyleCSS.htmlAPI}
      />

      {!isEmptyArray(broadcastItem?.rewards) && (
        <hr
          style={{
            backgroundColor: 'rgba(214, 214, 214, 1)',
            opacity: 0.5,
            margin: '8px 0px',
          }}
        />
      )}
      {!isEmptyArray(broadcastItem?.rewards) && (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Rewards</div>
          <div style={{ fontWeight: 500, fontSize: '14px' }}>
            All these rewards can be found on “Rewards” menu page
          </div>
          <div>
            {broadcastItem?.rewards?.map((item) => (
              <div
                key={item}
                style={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr',
                  gridTemplateRows: '1fr',
                  gap: '0px 0px',
                  gridAutoFlow: 'row',
                  gridTemplateAreas: '". ."',
                  height: '83px',
                  margin: '10px 0px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    backgroundColor: color.primary,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopLeftRadius: '5px',
                    borderBottomLeftRadius: '5px',
                  }}
                >
                  <img width={20} height={20} src={rewards} alt='rewards' />
                </div>
                <div
                  style={{
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    paddingLeft: '10px',
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const InboxDetail = (props) => {
  const dispatch = useDispatch();
  const responsiveDesign = screen();
  const gadgetScreen = responsiveDesign.width < 980;

  const color = useSelector((state) => state.theme.color);
  const [broadcastItem, setBroadcastItem] = useState({});

  useEffect(() => {
    const loadData = async () => {
      await dispatch(InboxAction.getBroadcastByID(broadcastItem?.id));
    };
    if (!isEmptyObject(broadcastItem)) {
      loadData();
    }
  }, [broadcastItem, dispatch]);

  useEffect(() => {
    const detailBroadcast = localStorage.getItem('KEY_GET_BROADCAST_DETAIL');
    setBroadcastItem(JSON.parse(detailBroadcast));
  }, []);

  return (
    <div
      style={{
        background: color?.background,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {gadgetScreen ? (
        <div
          className={customStyleFont.myFont}
          style={{
            marginTop: '50px',
          }}
        >
          <RenderHeader props={props} color={color} />
          <RenderContent broadcastItem={broadcastItem} color={color} />
        </div>
      ) : (
        <div
          className={customStyleFont.myFont}
          style={{
            marginTop: 60,
            width: '45%',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: '55px 1fr',
            gap: '0px 15px',
            gridTemplateAreas: '"."\n    "."',
            paddingLeft: '16px',
            paddingRight: '16px',
            height: '90vh',
            overflowY: 'auto',
          }}
        >
          <RenderHeader props={props} />
          <RenderContent broadcastItem={broadcastItem} color={color} />
        </div>
      )}
    </div>
  );
};

export default InboxDetail;
