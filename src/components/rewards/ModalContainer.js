import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import useMobileSize from 'hooks/useMobileSize';
import './styles/modalContainer.css';

import TabPointDetails from './TabPointDetails';
import TabPendingPoints from './TabPendingPoints';

const Tab = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const color = useSelector((state) => state.theme.color);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className='tab-container'>
      <div className='tab-buttons'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${index === activeTab && 'active'}`}
            style={{
              color: index === activeTab ? color.primary : '#585858',
              borderBottomColor: index === activeTab && color.primary,
            }}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className='tab-content'>{tabs[activeTab].content}</div>
    </div>
  );
};

const Modal = ({
  closeModal,
  isModalOpen,
  detailPoint,
  campaignDescription,
}) => {
  const isMobile = useMobileSize();

  const styles = {
    modalStyle: {
      position: 'fixed',
      top: isMobile ? '10%' : 'auto',
      left: isMobile ? 0 : '50%',
      transform: isMobile ? 'none' : 'translateX(-50%)',
      width: isMobile ? '100%' : '80%',
      height: isMobile ? '100%' : '70%',
      maxHeight: isMobile ? '100%' : '90%',
      background: '#fff',
      zIndex: 999,
      overflow: 'auto',
      borderRadius: isMobile ? '16px 16px 0px 0px' : '16px',
      display: 'flex',
      flexDirection: 'column',
    },
    overlayStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
    },
  };

  if (!isModalOpen) {
    return null;
  }

  const tabs = [
    {
      label: 'Points Details',
      content: (
        <TabPointDetails
          campaignDescription={campaignDescription}
          detailPoint={detailPoint}
        />
      ),
    },
    {
      label: 'Pending Points',
      content: <TabPendingPoints />,
    },
  ];

  return (
    <div>
      <div style={styles.overlayStyle}></div>
      <div style={styles.modalStyle}>
        <div
          className='modal-header'
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <h5 style={{ fontSize: '16px' }}>Points</h5>
          <button
            onClick={closeModal}
            className='close'
            style={{
              position: 'absolute',
              right: 10,
              top: 16,
            }}
          >
            <span aria-hidden='true' style={{ fontSize: 30 }}>
              ×
            </span>
          </button>
        </div>
        <Tab tabs={tabs} />
      </div>
    </div>
  );
};

export default Modal;
