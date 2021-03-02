import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    height: "15rem",
  },
  imageContainer: {
    height: "6rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    "& img": {
      height: "100%",
      width: "auto",
    },
  },
});

export default useStyles;
