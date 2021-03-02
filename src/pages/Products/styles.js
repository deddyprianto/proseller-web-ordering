import { createUseStyles } from "react-jss";

const hexToRGBA = (hex, a = 1) => {
  const removedHash = hex.replace("#", "");
  const r = "0x" + removedHash.substr(0, 2);
  const g = "0x" + removedHash.substr(2, 2);
  const b = "0x" + removedHash.substr(4, 2);
  return `${parseInt(r)}, ${parseInt(g)}, ${parseInt(b)}, ${a}`;
};

const useStyles = createUseStyles({
  container: {
    minHeight: "100vh",
    margin: "90px 0",
    position: "relative",
  },
  searchBox: {
    width: "100%",
  },
  "@media (min-width: 768px)": {
    container: {
      margin: "90px 5rem",
    },
    searchBox: {
      width: "30rem",
    },
  },
});

export default useStyles;
