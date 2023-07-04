import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import screen from 'hooks/useWindowSize';

const AppointmentHeader = ({
  color,
  onSearch,
  isSearch = false,
  label = 'Appointment',
  onBack,
}) => {
  const responsiveDesign = screen();
  const gadgetScreen = responsiveDesign.width < 980;

  const IconSearch = () => {
    return (
      <svg
        width={25}
        height={25}
        viewBox='0 0 36 36'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M32.5651 30.4361L27.0001 24.9161C29.1603 22.2227 30.2064 18.804 29.9233 15.363C29.6403 11.922 28.0496 8.72025 25.4784 6.41604C22.9072 4.11184 19.5508 2.88034 16.0995 2.97478C12.6482 3.06922 9.36418 4.48242 6.92281 6.92379C4.48144 9.36516 3.06825 12.6491 2.97381 16.1005C2.87937 19.5518 4.11086 22.9081 6.41507 25.4794C8.71927 28.0506 11.9211 29.6413 15.3621 29.9243C18.803 30.2073 22.2217 29.1612 24.9151 27.0011L30.4351 32.5211C30.5745 32.6617 30.7404 32.7733 30.9232 32.8494C31.106 32.9256 31.3021 32.9648 31.5001 32.9648C31.6981 32.9648 31.8942 32.9256 32.077 32.8494C32.2598 32.7733 32.4257 32.6617 32.5651 32.5211C32.8355 32.2414 32.9866 31.8676 32.9866 31.4786C32.9866 31.0896 32.8355 30.7158 32.5651 30.4361V30.4361ZM16.5001 27.0011C14.4234 27.0011 12.3933 26.3853 10.6666 25.2315C8.9399 24.0778 7.59409 22.4379 6.79937 20.5193C6.00465 18.6006 5.79671 16.4894 6.20186 14.4526C6.607 12.4158 7.60703 10.5449 9.07548 9.07646C10.5439 7.608 12.4149 6.60798 14.4517 6.20283C16.4885 5.79769 18.5997 6.00562 20.5183 6.80034C22.4369 7.59506 24.0768 8.94087 25.2305 10.6676C26.3843 12.3943 27.0001 14.4244 27.0001 16.5011C27.0001 19.2858 25.8939 21.9566 23.9247 23.9257C21.9556 25.8948 19.2849 27.0011 16.5001 27.0011V27.0011Z'
          fill={color.primary}
        />
      </svg>
    );
  };

  const localStyle = {
    container: {
      display: 'grid',
      gridTemplateColumns: '50px 1fr 50px',
      gridTemplateRows: '1fr',
      gap: '0px 0px',
      gridAutoFlow: 'row',
      gridTemplateAreas: '". . ."',
      cursor: 'pointer',
      margin: '10px 0',
      alignItems: 'center',
      justifyItems: 'center',
    },
    label: {
      padding: 0,
      margin: 0,
      justifySelf: 'start',
      fontWeight: 700,
      fontSize: '20px',
      color: color.primary,
      marginLeft: gadgetScreen ? '16px' : '0px',
    },
  };
  return (
    <div style={localStyle.container}>
      <ArrowBackIosIcon
        sx={{ color: color.primary, marginLeft: gadgetScreen ? '30px' : '0px' }}
        fontSize='large'
        onClick={() => onBack()}
      />
      <div style={localStyle.label}>{label}</div>
      {isSearch && (
        <div
          onClick={() => onSearch()}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconSearch />
        </div>
      )}
    </div>
  );
};

export default AppointmentHeader;
