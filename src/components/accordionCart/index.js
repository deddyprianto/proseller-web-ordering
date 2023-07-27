import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

const AccordionCart = ({
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

export default AccordionCart;
