import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InboxAction } from 'redux/actions/InboxAction';
import Shimmer from 'react-shimmer-effect';
import { Col, Row } from 'reactstrap';
import loadable from '@loadable/component';
import screen from 'hooks/useWindowSize';
import { isEmptyArray } from 'helpers/CheckEmpty';
import config from 'config';

const InboxCard = loadable(() => import('../components/inbox/InboxCard'));

const Inbox = () => {
  const responsiveDesign = screen();
  const gadgetScreen = responsiveDesign.width < 980;

  const broadcast = useSelector((state) => state.broadcast.broadcast);
  const [loadingShow, setLoadingShow] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      setLoadingShow(true);
      await dispatch(InboxAction.getBroadcast({ take: 14, skip: 0 }));
      setLoadingShow(false);
    };
    loadData();
  }, [dispatch]);

  const RenderShimmer = () => {
    return (
      <Shimmer>
        <div
          style={{
            width: '100%',
            height: 100,
            alignSelf: 'center',
            borderRadius: '8px',
            marginBottom: 10,
          }}
        />
      </Shimmer>
    );
  };

  const RenderBroadCastItem = () => {
    if (loadingShow) {
      return (
        <Row>
          <Col sm={6}>
            <RenderShimmer />
          </Col>
          <Col sm={6}>
            <RenderShimmer />
          </Col>
        </Row>
      );
    } else if (isEmptyArray(broadcast?.broadcast)) {
      return (
        <div>
          <img
            src={config.url_emptyImage}
            alt='is empty'
            style={{ marginTop: 30 }}
          />
          <div style={{ textAlign: 'center' }}>Inbox is empty</div>
        </div>
      );
    } else {
      return (
        <Row>
          {broadcast?.broadcast?.map((items) => (
            <Col
              key={items.broadcastID}
              sm={6}
              data-toggle='modal'
              data-target='#detail-inbox-modal'
            >
              <InboxCard items={items} />
            </Col>
          ))}
        </Row>
      );
    }
  };
  return (
    <div
      style={{
        marginTop: gadgetScreen ? 65 : 100,
        padding: '0px 16px',
        paddingBottom: 100,
      }}
    >
      <RenderBroadCastItem />
    </div>
  );
};

export default Inbox;
