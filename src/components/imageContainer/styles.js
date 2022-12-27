import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'inherit',
    width: 'inherit',
  },
  image: ({ isLandscape }) => ({
    width: isLandscape ? '100%' : 'auto',
    height: !isLandscape ? '100%' : 'auto',
  }),
});

export default useStyles;
