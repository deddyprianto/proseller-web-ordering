import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const WebOrderingCategories = ({
  categories,
  finished,
  loadingSearching,
  searchProduct,
  selectedCategory,
  setSelectedCategory,
  setIsScrollingToCategory,
  expanded,
  itemToShow,
  handleShowMore
}) => {
  let [querySearch, setQuerySearch] = useState("");
  let [openSearch, setOpenSearch] = useState(false);
  let [showItem, setItemToShow] = useState(itemToShow);
  let [expand, setExpanded] = useState(expanded);
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
    } catch (e) { }
  };

  if (finished && openSearch && querySearch !== "") {
    isItemsFinishedToLoad(querySearch);
  }

  const handleScrollToCategory = (selectedCategory) => {
    try {
      const isMobile = window.screen.width <= 750;
      const banners = document.getElementById("promo-banner");
      const bannersHeight = banners && isMobile ? banners.offsetHeight - 40 : 0;
      const clientHeightHead = document.getElementById("masthead").clientHeight;
      const clientHeightCategory =
        document.getElementById("header-categories").clientHeight;
      let headerHeight = clientHeightHead + clientHeightCategory;

      const categoryHeader = document.getElementById(
        `catalog-${selectedCategory}`
      );
      window.scrollTo({
        top: bannersHeight + categoryHeader.offsetTop - headerHeight,
        behavior: "smooth",
      });
      setSelectedCategory(selectedCategory);
      setIsScrollingToCategory(false);
    } catch (error) { }
  };

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
          categories &&
          categories.slice(0, itemToShow).map((item, i) => (
            <div
              id={`cat-${i}`}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              key={i}
              onClick={() => {
                setIsScrollingToCategory(true);
                handleScrollToCategory(i);
              }}
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
            style={{
              marginTop: "auto",
              marginBottom: "auto",
              fontSize: 14,
              width: "100%",
            }}
            id="input-txt"
            type="text"
            autoFocus={true}
            placeholder="Search your product here..."
          />
        )}
        <a
          className="btn btn-primary"
          onClick={handleShowMore}
          style={{ alignSelf: 'center'}}
        >
          {
            expanded ? (
              <span>Show less</span>
            ) : (
              <span>Show more</span>
            )
          }
        </a>

        <div
          className="search-button-absolute"
          id="search-button-category"
          style={{
            height: 50,
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
              style={{
                fontSize: 25,
                cursor: "pointer",
                marginTop: "auto",
                marginBottom: "auto",
              }}
            ></i>
          ) : (
            <i
              onClick={() => {
                setOpenSearch(true);
                setTimeout(() => {
                  document.getElementById("input-txt").classList.add("active");
                }, 100);
              }}
              style={{
                fontSize: 25,
                cursor: "pointer",
                marginTop: "auto",
                marginBottom: "auto",
              }}
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
