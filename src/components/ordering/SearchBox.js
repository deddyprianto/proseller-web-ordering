import React from "react";
import { Link } from "react-router-dom";
const SearchBox = ({}) => {
  return (
    <Link to={"/search"}>
      <div
        style={{
          backgroundColor: "#ecf0f1",
          borderRadius: 4,
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: 5,
            marginLeft: 7,
            marginRight: 7,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Find your product here ...</span>
          <i className="fa fa-search"></i>
        </div>
      </div>
    </Link>
  );
};

SearchBox.propTypes = {};

export default SearchBox;
