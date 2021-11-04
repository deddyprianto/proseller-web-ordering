import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import config from "../../config";

const WebOrderingCategories = ({
  categories,
  finished,
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
      className="nav nav-tabs pizzaro-nav-tabs categories-product relative-position background-theme"
      style={{
        marginTop: 100,
        marginBottom: 0,
        borderBottom: "0px solid #DCDCDC",
      }}
    >
      <React.Fragment>
        <li style={{ cursor: "pointer", marginRight: 15, width: 80, maxWidth: 80 }} className="nav-item category-item">
          <div className={"color-active"}>
            <Link to="/category">
              <div
                style={{ width: 80, maxWidth: 80, height: 70, borderRadius: 6 }}
              >
                <i className="fa fa-th-large font-color-theme" style={{ fontSize: '6rem', marginTop: 5 }} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  marginTop: 5,
                  display: 'block',
                  lineHeight: 1.8
                }}
              >
                All Category
              </span>
            </Link>
          </div>
        </li>
        {categories.map((item, i) => (
          <li
            id={`cat-${i}`}
            lassName="nav-item category-item"
            style={{ cursor: "pointer", marginRight: 15, width: 80, maxWidth: 80, }}
            key={i}
            onClick={() => {setSelectedCategory(item)}}
          >
            <div className={"color-active"}>
              <div
                style={{ width: 80, maxWidth: 80, height: 70, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img style={{ maxHeight: 75, }} src={item.defaultImageURL || config.image_placeholder} />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  marginTop: 5,
                  display: 'block',
                  lineHeight: 1.8
                }}
              >
                {item.name}
              </span>
            </div>
          </li>
        ))}
      </React.Fragment>
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

