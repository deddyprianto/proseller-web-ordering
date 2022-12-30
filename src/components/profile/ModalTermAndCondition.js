import React from 'react';
import { useSelector } from 'react-redux';

const ModalTermAndCondition = ({ enableTermAndCondition }) => {
  const split = enableTermAndCondition?.settingValue.split('\n');
  const { color } = useSelector((state) => state.theme);
  const style = {
    modalContent: { width: '100%', marginTop: 100, marginBottom: 100 },
    modalHeader: { display: 'flex', justifyContent: 'center' },
    modalTitle: { fontSize: 18 },
    containerContent: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerMain: {
      width: '90%',
      marginTop: '20px',
      border: '2px solid #eaeaea',
      borderRadius: '20px',
      padding: '20px',
    },
    fontSizeContent: { fontSize: '15px', textAlign: 'left' },
    containerButton: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonOK: {
      backgroundColor: color.primary,
      width: '90%',
      color: 'white',
      margin: '15px auto',
      padding: '15px',
    },
  };
  return (
    <div
      id='detail-termcondition-modal'
      className='modal fade'
      tabIndex={-1}
      role='dialog'
      aria-labelledby='exampleModalCenterTitle'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-dialog-centered' role='document'>
        <div className='modal-content' style={style.modalContent}>
          <div className='modal-header' style={style.modalHeader}>
            <h5
              className='modal-title'
              id='exampleModalLabel'
              style={style.modalTitle}
            >
              {enableTermAndCondition?.displayedText}
            </h5>
          </div>
          <div style={style.containerContent}>
            <div style={style.containerMain}>
              <p style={style.fontSizeContent}>{split[0]}</p>
              <ul
                style={{
                  listStyle: 'none',
                  textAlign: 'left',
                  padding: '0',
                  margin: '0',
                }}
              >
                {split.map((item, i) => {
                  if (i !== 0) {
                    return <li>{item}</li>;
                  }
                })}
              </ul>
            </div>
          </div>
          <div style={style.containerButton}>
            <button type='button' data-dismiss='modal' style={style.buttonOK}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTermAndCondition;
