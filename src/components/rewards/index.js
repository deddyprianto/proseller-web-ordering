import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Button } from 'reactstrap';
import Shimmer from 'react-shimmer-effect';
import { Link } from 'react-router-dom';

import { CampaignAction } from 'redux/actions/CampaignAction';
import ModalEditProfile from 'components/profile/ModalEditProfile';
import DefaultStampsImage from 'components/profile/DefaultStampsImage';
import ModalContainer from './ModalContainer';
import './styles/index.css';

const RewardsDetail = () => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.auth.account.idToken.payload);
  const setting = useSelector((state) => state.order.setting);
  const campaign = useSelector((state) => state.campaign.data);
  const stamps = useSelector((state) => state.customer.stamps);

  const [loadingShow, setLoadingShow] = useState(true);
  const [totalPoint, setTotalPoint] = useState(0);
  const [campaignPointActive, setCampaignPointActive] = useState({});
  const [campaignPointAnnouncement, setCampaignPointAnnouncement] =
    useState(false);
  const [detailPoint, setDetailPoint] = useState(null);
  const [pointIcon, setPointIcon] = useState('');
  const [pendingPoints, setPendingPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('point');

  const isEmenu = window.location.hostname.includes('emenu');

  useEffect(() => {
    dispatch(CampaignAction.getCampaignStamps());

    const fetchData = async () => {
      let response = await dispatch(
        CampaignAction.getCampaignPoints({ history: 'true' }, account.companyId)
      );
      if (response.ResultCode === 200) {
        const data = response.Data;
        setDetailPoint(data.detailPoint);
        setTotalPoint(data.totalPoint);
        setPendingPoints(data.totalPendingPoints);
        setCampaignPointActive(data.campaignPointActive);
        setCampaignPointAnnouncement(data.campaignPointAnnouncement);
      }

      let pointIconValue = setting.find(
        (items) => items.settingKey === 'PointIcon'
      );
      if (pointIconValue) {
        setPointIcon(pointIconValue.settingValue);
      }

      setLoadingShow(false);
    };

    fetchData();
  }, [account.companyId, dispatch, setting]);

  const MyStamps = ({ items, image }) => {
    return (
      <div>
        <div style={{ color: '#FFF', fontWeight: 'bold', paddingTop: 10 }}>
          My Stamps
        </div>
        <div className='container-stamp'>
          {image ? (
            <div style={{ marginBottom: '20px' }}>
              <img src={image} alt='Stamps' />
            </div>
          ) : (
            <DefaultStampsImage stampsItem={items} />
          )}

          <button className='btn-see-detail' onClick={() => openModal('stamp')}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>
              See Details
            </span>
          </button>
        </div>
      </div>
    );
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const viewShimmer = (isHeight = 100) => {
    return (
      <Shimmer>
        <div className='shimmer-content' style={{ height: isHeight }} />
      </Shimmer>
    );
  };

  const viewLeftPage = (loadingShow) => {
    return (
      <div style={{ marginBottom: 10 }}>
        {loadingShow && (
          <div>
            {viewShimmer()}
            {viewShimmer(50)}
          </div>
        )}
        {!loadingShow &&
          stamps &&
          stamps.stampsItem &&
          stamps.stampsItem.length > 0 && (
            <div
              className='profile-dashboard'
              style={{
                boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
                borderRadius: '0 0 20px 20px',
                border: '0px solid rgba(128, 128, 128, 0.5)',
              }}
            >
              {stamps.campaignStampsAnnouncement ? (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div
                    style={{
                      marginBottom: 10,
                      color: '#FFF',
                      padding: '10px 10px 0 10px',
                    }}
                  >
                    Please complete your profile information to collect stamps
                  </div>
                  <Button
                    color='warning'
                    style={{
                      color: '#FFF',
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}
                    data-toggle='modal'
                    data-target='#edit-profile-modal'
                  >
                    Complete Now
                  </Button>
                </div>
              ) : (
                <MyStamps
                  items={stamps.stampsItem}
                  image={stamps.stampsImage}
                ></MyStamps>
              )}
            </div>
          )}
      </div>
    );
  };

  const viewRightPage = (loadingShow) => {
    return (
      <div>
        {isEmenu && (
          <Link to='/profile'>
            <div
              className='background-theme'
              style={{ marginLeft: 10, fontSize: 16, textAlign: 'left' }}
            >
              <i className='fa fa-chevron-left'></i> Back
            </div>
          </Link>
        )}
        {loadingShow && (
          <div>
            {viewShimmer()}
            {viewShimmer(50)}
          </div>
        )}
        {!loadingShow && campaignPointActive && totalPoint !== 0 && (
          <div
            style={{
              boxShadow: '0px 0px 5px rgba(128, 128, 128, 0.5)',
              border: '1px solid #CDCDCD',
            }}
          >
            {campaignPointAnnouncement ? (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginTop: 20,
                  paddingBottom: 10,
                }}
              >
                <div
                  style={{
                    marginBottom: 10,
                    color: '#c00a27',
                    padding: '10px 10px 0 10px',
                  }}
                >
                  Please complete your profile information to start earning
                  points
                </div>
                <Button
                  color='warning'
                  style={{ color: '#FFF', fontWeight: 'bold' }}
                  data-toggle='modal'
                  data-target='#edit-profile-modal'
                >
                  Complete Now
                </Button>
              </div>
            ) : (
              <div className='container-point'>
                {pointIcon && pointIcon !== '' && (
                  <img
                    src={pointIcon}
                    alt='my point'
                    style={{ height: 100, objectFit: 'contain', marginTop: 10 }}
                  />
                )}
                <div
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    paddingTop: 10,
                  }}
                >
                  My Points
                </div>

                {pendingPoints && pendingPoints > 0 && (
                  <div className='text text-warning-theme text-pending-points'>
                    You have {pendingPoints} outstanding points!
                    <br />
                    Complete your order to collect.
                  </div>
                )}

                <div className='text-value text-total-points'>
                  {totalPoint.toFixed(2)}
                </div>

                <button
                  className='btn-see-detail'
                  onClick={() => openModal('point')}
                >
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    See Details
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {!loadingShow && (
          <div>
            <Link to='/voucher'>
              <div className='background-theme container-reward'>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 'bold' }}>
                    <i className='fa fa-gift' aria-hidden='true' /> My Rewards
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <ModalContainer
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        detailPoint={detailPoint}
        pendingPoints={pendingPoints}
        campaignDescription={campaign.campaignDescription}
        type={modalType}
      />

      <ModalEditProfile />
      <Row>
        <Col sm={6}>{viewLeftPage(loadingShow)}</Col>
        <Col sm={6}>{viewRightPage(loadingShow)}</Col>
      </Row>
    </div>
  );
};

export default RewardsDetail;
