import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const WebOrderingCategories = ({
  categories,
  finished,
  loadingSearching,
  setLoading,
  searchProduct,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [openSearch, setOpenSearch] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const isItemsFinishedToLoad = (query) => {
    try {
      loadingSearching(true);

      if (!finished) {
        setLoading(true);
        clearTimeout(searchTimeout);
        const timeout = setTimeout(() => {
          return isItemsFinishedToLoad(query);
        }, 2000);
        setSearchTimeout(timeout);
      } else {
        searchProduct(query);
      }
    } catch (e) {}
  };

  useEffect(() => {
    const scrollEventListener = document.addEventListener("scroll", () => {
      categories.forEach((element, i) => {
        try {
          const target = document.getElementById(i);
          if (
            target.offsetTop <= window.pageYOffset + 200 &&
            target.offsetTop + 110 >= window.pageYOffset
          ) {
            setSelectedCategory(i);
            try {
              document
                .getElementById(`cat-${i}`)
                .scrollIntoView({ behavior: "smooth", inline: "center" });
            } catch (e) {}
          }
        } catch (e) {}
      });
    });
    return document.removeEventListener("scroll", scrollEventListener);
  }, []);

  useEffect(() => {
    try {
      window.scrollTo({
        top: document.getElementById(selectedCategory).offsetTop - 40,
        behavior: "smooth",
      });
    } catch (error) {
      console.log("fetching categories....");
    }
  }, [selectedCategory]);

  return (
    <ul
      id="header-categories"
      className="nav nav-tabs pizzaro-nav-tabs categories-product relative-position"
      style={{ marginBottom: 0 }}
    >
      {!openSearch ? (
        categories.map((item, i) => (
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
                i == selectedCategory ? "color-active" : "color-nonactive"
              }
              style={{ fontSize: 14, marginRight: 20, fontWeight: "bold" }}
            >
              {item.name}
            </div>
            {i == selectedCategory && (
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
        ))
      ) : (
        <input
          onKeyUp={(e) => {
            isItemsFinishedToLoad(e.target.value);
          }}
          style={{ height: 35, fontSize: 14 }}
          id="input-txt"
          type="text"
          autoFocus={true}
          placeholder="Search your product here..."
        />
      )}
      <div
        className="search-button-absolute"
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
