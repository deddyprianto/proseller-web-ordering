import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export const RenderHeaderLabelHistory = ({ color, history, mobileSize }) => {
  const localStyle = {
    container: {
      width: mobileSize ? '100%' : '96.5%',
      margin: 'auto',
      display: 'flex',
      marginTop: mobileSize ? '75px' : '85px',
      alignItems: 'center',
      justifyItems: 'center',
      height: '49px',
    },
    label: {
      padding: 0,
      margin: 0,
      fontWeight: 700,
      fontSize: '20px',
      color: color.primary,
      marginLeft: '18px',
    },
  };
  return (
    <div style={localStyle.container}>
      <div
        style={{
          width: '20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <ArrowBackIosIcon
          sx={{
            color: color.primary,
            fontSize: '25px',
            marginLeft: '10px',
          }}
          onClick={() => {
            history.push('/');
          }}
        />
      </div>
      <div style={localStyle.label}>History</div>
    </div>
  );
};
