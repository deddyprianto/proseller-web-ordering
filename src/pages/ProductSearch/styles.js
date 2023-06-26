import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  container: {
    minHeight: '70vh',
    margin: '90px 0',
    position: 'relative',
  },
  searchBox: {
    width: '100%',
  },
  '@media (min-width: 768px)': {
    container: {
      margin: '90px 5rem',
    },
    searchBox: {
      width: '30rem',
    },
  },
});

export default useStyles;
