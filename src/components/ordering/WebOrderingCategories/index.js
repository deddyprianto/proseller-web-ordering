import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const WebOrderingCategories = ({
  categories,
  finished,
  loadingSearching,
  searchProduct,
  selectedCategory,
  setSelectedCategory,
}) => {
  let [querySearch, setQuerySearch] = useState("");
  let [openSearch, setOpenSearch] = useState(false);
  let [prevSelectedCategory, setPrevSelectedCategory] = useState(
    selectedCategory
  );
  const history = useHistory();

  const isItemsFinishedToLoad = (query) => {
    setQuerySearch(query);
    // try {
    //   setQuerySearch(query);
    //   loadingSearching(true);
    //   if (finished) {
    //     searchProduct(query);
    //     setQuerySearch("");
    //   }
    // } catch (e) {}
  };

  const search = (keyword) => {
    history.push(`/products?q=${encodeURIComponent(keyword)}`);
  };

  if (finished && openSearch && querySearch !== "") {
    isItemsFinishedToLoad(querySearch);
  }

  useEffect(() => {
    const scrollEventListener = document.addEventListener("scroll", () => {
      categories.forEach((i) => {
        try {
          const target = document.getElementById(i);
          if (
            target.offsetTop <= window.pageYOffset + 200 &&
            target.offsetTop + 110 >= window.pageYOffset
          ) {
            setSelectedCategory(i);
          }
        } catch (e) {}
      });
    });
    return document.removeEventListener("scroll", scrollEventListener);
  }, []);

  useEffect(() => {
    try {
      let clientHeightHead = document.getElementById("masthead").clientHeight;
      let clientHeightCategory = document.getElementById("header-categories")
        .clientHeight;
      let headerHeight = clientHeightHead + clientHeightCategory;
      if (prevSelectedCategory === 0)
        headerHeight = clientHeightHead + clientHeightCategory * 2;

      window.scrollTo({
        top: document.getElementById(selectedCategory).offsetTop - headerHeight,
        behavior: "smooth",
      });
    } catch (error) {
      console.log("fetching categories");
    }
    setPrevSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <ul
      id="header-categories"
      className="nav nav-tabs pizzaro-nav-tabs categories-product relative-position background-theme"
      style={{
        marginBottom: 0,
        borderBottom: "0px solid #DCDCDC",
      }}
    >
      {!openSearch ? (
        <React.Fragment>
          <li style={{ cursor: "pointer" }} className="nav-item category-item">
            <Link
              to="/category"
              style={{ fontSize: 14, marginRight: 20, fontWeight: "bold" }}
            >
              All Category
            </Link>
          </li>
          {categories.map((item, i) => (
            <li
              id={`cat-${i}`}
              style={{ cursor: "pointer" }}
              key={i}
              onClick={() => setSelectedCategory(i)}
              className={
                i === selectedCategory
                  ? "nav-item category-item active color"
                  : "nav-item category-item"
              }
            >
              <div
                className={
                  i === selectedCategory ? "color-active" : "color-nonactive"
                }
                style={{ fontSize: 14, marginRight: 20, fontWeight: "bold" }}
              >
                {item.name}
              </div>
              {i === selectedCategory && (
                <div
                  className="profile-dashboard"
                  style={{
                    height: 4,
                    marginLeft: -10,
                    position: "absolute",
                    bottom: -6,
                    zIndex: 10,
                    width: "100%",
                  }}
                />
              )}
            </li>
          ))}
        </React.Fragment>
      ) : (
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "5rem" }}
        >
          <input
            onKeyUp={(e) => isItemsFinishedToLoad(e.target.value)}
            style={{ height: 35, fontSize: 14, width: "100%" }}
            id="input-txt"
            type="text"
            autoFocus={true}
            placeholder="Search your product here..."
          />
          <i
            onClick={() => search(querySearch)}
            style={{ fontSize: 25, cursor: "pointer" }}
            className="fa fa-search color"
          ></i>
        </div>
      )}
      <div
        className="search-button-absolute background-theme"
        id="search-button-category"
        style={{ height: 40, marginTop: -11, width: 40 }}
      >
        {openSearch ? (
          <i
            className="search_icon fa fa-close color"
            onClick={() => {
              setOpenSearch(false);
              searchProduct("");
            }}
            style={{ fontSize: 25, cursor: "pointer", marginTop: 5 }}
          ></i>
        ) : (
          <i
            onClick={() => {
              setOpenSearch(true);
              setTimeout(() => {
                document.getElementById("input-txt").classList.add("active");
              }, 100);
            }}
            style={{ fontSize: 25, cursor: "pointer" }}
            className="fa fa-search color"
          ></i>
        )}
      </div>
    </ul>
  );
};

WebOrderingCategories.propTypes = {
  categories: PropTypes.array,
  selectedCategory: PropTypes.number,
  setSelectedCategory: PropTypes.func,
  loadingSearching: PropTypes.func,
  finished: PropTypes.bool,
  setLoading: PropTypes.func,
  searchProduct: PropTypes.func,
};

export default WebOrderingCategories;
