import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { isEmptyArray } from 'helpers/CheckEmpty';

const ModalInfoTransferDialog = ({ open, onClose, data }) => {
  const color = useSelector((state) => state.theme.color);

  const style = {
    dialogTitle: {
      borderBottom: '1px solid #e5e5e5',
      marginBottom: 2,
    },
    imgStyle: {
      width: '100%',
      height: 'auto',
    },
    description: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#2F4F4F',
    },
  };

  const imageSource = () => {
    if (!isEmptyArray(data.configurations)) {
      const [image] = data?.configurations?.filter(
        (item) => item.name === 'manual_transfer_image'
      );

      return image.value;
    } else return '';
  };

  const renderDescription = () => {
    if (!isEmptyArray(data.configurations)) {
      const [description] = data?.configurations?.filter(
        (item) => item.name === 'payment_description'
      );
      return parse(description.value);
    } else {
      return;
    }
  };

  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={onClose}>
      <DialogTitle sx={style.dialogTitle}>
        <Typography
          fontSize={20}
          fontWeight={700}
          className='color'
          textAlign='center'
        >
          How To Transfer ?
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          '& .MuiDialogContent-root': {
            paddingBottom: 0,
          },
        }}
      >
        <Box
          component='img'
          alt='img-qr'
          src={imageSource()}
          sx={style.imgStyle}
        />

        <Box sx={style.description}>{renderDescription()}</Box>
      </DialogContent>
      <DialogActions>
        <Button
          fullWidth
          sx={{
            backgroundColor: color.primary,
            color: color.textButtonColor,
            fontSize: '1.5rem',
            fontWeight: '600',
          }}
          onClick={() => onClose()}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ModalInfoTransferDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

export default ModalInfoTransferDialog;
