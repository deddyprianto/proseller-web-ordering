import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { IconDineIn } from 'assets/iconsSvg/Icons';
import iconRight from 'assets/images/iconRight.png';

export const AccordionCart = ({
  openAccordion,
  setOpenAccordion,
  gadgetScreen,
  fontStyleCustom,
  name,
  renderButtonProvider,
}) => {
  return (
    <Accordion
      sx={{
        boxShadow: 'none',
        padding: 0,
        margin: 0,
        width: '100%',
      }}
      expanded={openAccordion}
      onChange={() => setOpenAccordion(!openAccordion)}
    >
      <AccordionSummary
        sx={{ padding: '0', margin: '0' }}
        expandIcon={
          <ExpandMoreIcon
            sx={{ width: '20px', height: '20px', marginRight: '10px' }}
          />
        }
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <div
          style={{
            width: gadgetScreen ? '80vw' : '35vw',
          }}
        >
          <Typography
            style={{
              fontSize: '14px',
              color: 'black',
              fontWeight: 700,
              paddingLeft: '5px',
              paddingRight: '0px'
            }}
            className={fontStyleCustom.myFont}
          >
            {name}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails style={{ padding: '0 5px', margin: 0 }}>
        {renderButtonProvider()}
      </AccordionDetails>
    </Accordion>
  );
};

export const ContainerStorePickUP = ({ defaultOutlet }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <hr
        style={{
          backgroundColor: '#8A8D8E',
          opacity: 0.5,
        }}
      />
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#B7B7B7' }}>
        Outlet Address
      </div>
      <div style={{ color: '#B7B7B7', fontSize: '14px', fontWeight: 500 }}>
        {defaultOutlet?.address}, {defaultOutlet?.city} -{' '}
        {defaultOutlet?.postalCode}
      </div>
    </div>
  );
};

export const RenderTableMode = ({
  setOpenOrderingTable,
  noTable,
  color,
  orderingMode,
  defaultOutlet,
  fontStyleCustom,
}) => {
  return (
    <div
      onClick={() => {
        setOpenOrderingTable(true);
      }}
      style={{
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        marginTop: '10px',
        marginBottom: '10px',
        padding: '20px 5px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Typography
          style={{ fontSize: '14px', color: 'black', fontWeight: 700 }}
          className={fontStyleCustom.myFont}
        >
          Table Number
        </Typography>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '10px',
          }}
        >
          {noTable ? (
            <IconDineIn color={color.primary} />
          ) : (
            <div
              style={{ fontSize: '13px', color: '#8A8D8E', fontWeight: 600 }}
            >
              Choose Table
            </div>
          )}
          <Typography
            style={{
              fontSize: '13px',
              color: '#8A8D8E',
              fontWeight: 500,
              marginLeft: '5px',
              textTransform: 'uppercase',
            }}
            className={fontStyleCustom.myFont}
          >
            {noTable}
          </Typography>
          <img src={iconRight} alt='myIcon' style={{ marginLeft: '5px' }} />
        </div>
      </div>

      {orderingMode === 'STOREPICKUP' && (
        <div style={{ marginTop: '20px' }}>
          <hr
            style={{
              backgroundColor: '#8A8D8E',
              opacity: 0.5,
            }}
          />
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#B7B7B7' }}>
            Outlet Address
          </div>
          <div style={{ color: '#B7B7B7', fontSize: '14px', fontWeight: 500 }}>
            {defaultOutlet?.address}, {defaultOutlet?.city} -{' '}
            {defaultOutlet?.postalCode}
          </div>
        </div>
      )}
    </div>
  );
};
