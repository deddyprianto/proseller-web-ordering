import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

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
  let [prevSelectedCategory, setPrevSelectedCategory] =
    useState(selectedCategory);

  const isItemsFinishedToLoad = (query) => {
    try {
      setQuerySearch(query);
      loadingSearching(true);
      if (finished) {
        searchProduct(query);
        setQuerySearch("");
      }
    } catch (e) {}
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
      let clientHeightCategory =
        document.getElementById("header-categories").clientHeight;
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
      className="menu-category relative-position"
      style={{
        marginBottom: 0,
        borderBottom: "0px solid #DCDCDC",
      }}
    >
      <div className="categories">
        {!openSearch ? (
          categories.map((item, i) => (
            <div
              id={`cat-${i}`}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              key={i}
              onClick={() => setSelectedCategory(i)}
              className={
                i === selectedCategory ? "menu-item active" : "menu-item"
              }
            >
              {item.name}
            </div>
          ))
        ) : (
          <input
            onKeyUp={(e) => isItemsFinishedToLoad(e.target.value)}
            style={{ height: 35, marginTop: 11, fontSize: 14 }}
            id="input-txt"
            type="text"
            autoFocus={true}
            placeholder="Search your product here..."
          />
        )}
        <div
          className="search-button-absolute"
          id="search-button-category"
          style={{
            height: 50,
            marginTop: 5,
            width: 40,
            backgroundColor: "#D0D0D0",
          }}
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
