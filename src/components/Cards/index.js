import React from "react";
import useStyles from "./styles";

const Image = ({ src }) => {
  const classes = useStyles();
  return (
    <div className={classes.imageContainer}>
      <img src={src} alt="card"></img>
    </div>
  );
};

const Body = ({ children }) => {
  return <div>{children}</div>;
};

const Cards = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.container}>{children}</div>;
};

Cards.Body = Body;
Cards.Image = Image;

export default Cards;
