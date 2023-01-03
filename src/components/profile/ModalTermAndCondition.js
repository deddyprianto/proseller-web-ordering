import React from 'react';
import { useSelector } from 'react-redux';

const ModalTermAndCondition = ({ enableTermAndCondition }) => {
  const split = enableTermAndCondition?.settingValue?.split('\n');
  const { color } = useSelector((state) => state.theme);
  const style = {
    modalContent: {
      width: '100%',
      marginTop: 100,
      marginBottom: 100,
      height: '100%',
    },
    modalHeader: { display: 'flex', justifyContent: 'center' },
    modalTitle: { fontSize: 18 },
    containerContent: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80%',
    },
    containerMain: {
      height: '100%',
      width: '90%',
      border: '2px solid #eaeaea',
      borderRadius: '20px',
      padding: '20px',
      overflowY: 'auto',
      marginTop: '15px',
    },
    fontSizeContent: { fontSize: '15px', textAlign: 'left' },
    containerButton: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '70px',
    },
    buttonOK: {
      backgroundColor: color.primary,
      width: '90%',
      color: 'white',
      margin: '20px auto',
      height: '40px',
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
      <div
        className='modal-dialog modal-dialog-centered'
        role='document'
        style={{ height: '90vh' }}
      >
        <div className='modal-content' style={style.modalContent}>
          <div className='modal-header' style={style.modalHeader}>
            <h5
              className='modal-title'
              id='exampleModalLabel'
              style={style.modalTitle}
            >
              Terms & Conditions
            </h5>
          </div>
          <div style={style.containerContent}>
            <div style={style.containerMain}>
              <p style={style.fontSizeContent}>{split && split[0]}</p>
              <ul
                style={{
                  listStyle: 'none',
                  textAlign: 'left',
                  padding: '0',
                  margin: '0',
                }}
              >
                {split?.map((item, i) => {
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
