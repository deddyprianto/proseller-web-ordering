import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'inherit',
    width: 'inherit',
  },
  image: {
    width: ({ isLandscape }) => (isLandscape ? '100% !important' : 'auto'),
    height: ({ isLandscape }) => (!isLandscape ? '100% !important' : 'auto'),
  },
});

export default useStyles;
