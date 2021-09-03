import React, { useEffect, useState, useLayoutEffect } from "react";
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
  theme,
  getProductPreset,
}) => {
  let [querySearch, setQuerySearch] = useState("");
  let [isChanged, setIsChanged] = useState(false);
  let [indexHighlight, setIndexHighlight] = useState([]);
  let [text, setText] = useState("More");
  let [startIndex, setStartIndex] = useState(0);
  let [highlightedCategories, setHighlightedCategories] = useState([]);
  let [openSearch, setOpenSearch] = useState(false);
  let [prevSelectedCategory, setPrevSelectedCategory] =
    useState(selectedCategory);
  const history = useHistory();
  const [size, setSize] = useState([0, 0]);

  try {
    if (!selectedCategory) {
      selectedCategory = categories[0].id;
    }
  } catch (e) {}

  const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

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

  const isSelectedCategory = (id) => {
    if (id == selectedCategory) return true;
    return false;
  };

  const search = (keyword) => {
    history.push(`/products?q=${encodeURIComponent(keyword)}`);
  };

  if (finished && openSearch && querySearch !== "") {
    isItemsFinishedToLoad(querySearch);
  }

  useEffect(() => {
    const scrollEventListener = document.addEventListener("scroll", () => {
      try {
        const target = document.getElementById('header-category');
        const masthead = document.getElementById('masthead');
        let sticky = target.offsetTop;
        let mastheadOffset = masthead.offsetHeight;
        if (window.pageYOffset >= sticky + mastheadOffset) {
          target.classList.add("sticky-header")
        } else {
          target.classList.remove("sticky-header");
        }
      } catch (e) {}
    });
    return document.removeEventListener("scroll", scrollEventListener);
  }, []);

  // useEffect(() => {
  //   try {
  //     let clientHeightHead = document.getElementById("masthead").clientHeight;
  //     let clientHeightCategory =
  //       document.getElementById("header-categories").clientHeight;
  //     let headerHeight = clientHeightHead + clientHeightCategory;
  //     if (prevSelectedCategory === 0)
  //       headerHeight = clientHeightHead + clientHeightCategory * 2;

  //     window.scrollTo({
  //       top: document.getElementById(selectedCategory).offsetTop - headerHeight,
  //       behavior: "smooth",
  //     });
  //   } catch (error) {
  //     console.log("fetching categories");
  //   }
  //   setPrevSelectedCategory(selectedCategory);
  // }, [selectedCategory]);

  let [width, height] = useWindowSize();

  width -= 30;

  let limit = 3;
  if (width > 600) {
    limit = 6;
  }
  if (width >= 1000) {
    limit = 10;
  }

  let backupCategories = JSON.stringify(categories);
  backupCategories = JSON.parse(backupCategories);

  let dataHighligh = categories.slice(startIndex, startIndex+limit);

  useEffect(() => {
    if (JSON.stringify(dataHighligh) !== JSON.stringify(highlightedCategories) && !isChanged) {
      setHighlightedCategories(dataHighligh);
      for (let i = startIndex; i < startIndex+limit; i++) {
        indexHighlight.push(i)
      }
    }
  },  [highlightedCategories, dataHighligh, isChanged, indexHighlight, limit, startIndex]);

  // console.log(indexHighlight, 'indexHighlight')
  let arrayMoreCategories =  backupCategories.filter((x, y) => !indexHighlight.includes(y));
  // console.log(arrayMoreCategories,'arrayMoreCategories')
  let moreCategories = []
  for (let i = 0; i < arrayMoreCategories.length; i++) {
    moreCategories.push(
      <li
        data-toggle="collapse"
        data-target=".multi-collapse"
        aria-controls="menu-dropdown overlay-dropdown"
        onClick={() => {
          setIsChanged(true)
          let newArray = []
          let newIndexHighligh = []
          if (i + limit > arrayMoreCategories.length) {
            let max = arrayMoreCategories.length - limit;
            if (max < 0) max = 0;
            for (let z = max; z < arrayMoreCategories.length; z++) {
              newArray.push(arrayMoreCategories[z]);
              let idx = backupCategories.findIndex(x => x.id === arrayMoreCategories[z].id);
              newIndexHighligh.push(idx);
            }
          } else {
            for (let z = i; z < i+limit; z++) {
              newArray.push(arrayMoreCategories[z]);
              let idx = backupCategories.findIndex(x => x.id === arrayMoreCategories[z].id);
              newIndexHighligh.push(idx);
            }
          }
          setHighlightedCategories(newArray);
          setIndexHighlight(newIndexHighligh);
          // setStartIndex(idx+limit)
          setText('More')
          setSelectedCategory(arrayMoreCategories[i].id)
          getProductPreset(arrayMoreCategories[i])
        }}
        style={{
          display: "flex",
          alignItems: "center",
          height: 50,
          lineHeight: 1.7,
          fontSize: 14,
          marginRight: 1,
          fontWeight: 800,
          padding: 7,
          color: !isSelectedCategory(arrayMoreCategories[i].id)
            ? "black"
            : theme.color.primary,
          margin: "2px 0",
        }}
      >
        {arrayMoreCategories[i].name.toUpperCase()}
      </li>
    )
  }

  return (
    <div id="header-category" style={{ width: '100%', maxWidth: '100%', zIndex: 999 }}>
      <div style={{ width: '100%', maxWidth: '100%', zIndex: 999 }}>
        <ul
          className="nav nav-tabs pizzaro-nav-tabs categories-product relative-position background-theme"
          style={{
            padding: '2px 0',
            marginBottom: 0,
            borderBottom: "0px solid #DCDCDC",
          }}
        >
          <React.Fragment>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', borderBottom: 7 }} className="all-menu">
                {highlightedCategories.map((item, i) => (
                  <li
                    id={`cat-${i}`}
                    style={{
                      cursor: "pointer",
                      width: (width/limit) - (91/limit),
                      overflow: "hidden",
                      height: 50,
                    }}
                    key={i}
                    onClick={() => {
                      setText('More')
                      setSelectedCategory(item.id)
                      getProductPreset(item)
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: 'center',
                        height: 50,
                        lineHeight: 1.7,
                        fontSize: isSelectedCategory(item.id) ? 11 : 11,
                        fontWeight: "bold",
                        backgroundColor: isSelectedCategory(item.id)
                          ? theme.color.primary
                          : 'rgb(208, 208, 208)',
                        padding: 7,
                        color: "black",
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ textAlign: 'center' }}>{item.name.toUpperCase().substr(0, 19)}</span>
                    </div>
                  </li>
                ))}
              </div>
              {
                moreCategories && moreCategories.length > 0 &&
                <li
                  onClick={() => {
                    if (text === 'More') {
                      // document.body.style.position = 'fixed';
                      // document.body.style.width = '100%';
                      // document.body.style.top = `-${window.scrollY}px`;
                      setText('Less')
                    } else {
                      // const scrollY = document.body.style.top;
                      // document.body.style.width = '100%';
                      // document.body.style.position = '';
                      // document.body.style.top = '';
                      // window.scrollTo(0, parseInt(scrollY || '0') * -1);
                      setText('More')
                    }
                  }}
                  className="more-menu"
                  style={{ position: "absolute", right: 0, cursor: "pointer" }}
                  data-toggle="collapse"
                  data-target=".multi-collapse"
                  aria-controls="menu-dropdown overlay-dropdown"
                >
                  <center>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: 50,
                        width: 90,
                        fontSize: 12,
                        fontWeight: 900,
                        padding: 7,
                        color: theme.color.primary,
                        backgroundColor: 'rgb(208, 208, 208)',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ marginLeft: 8 }}>{text}</span>
                      {
                        text === 'More' ?
                        <i style={{ marginLeft: 10, fontSize: 13, marginTop: -4 }} className="fa fa-chevron-down" />
                        :
                        <i style={{ marginLeft: 10, fontSize: 13, marginTop: -4 }} className="fa fa-chevron-up" />
                      }
                    </div>
                  </center>
                </li>
              }
            </div>
          </React.Fragment>
        </ul>
      </div>
      <div
        id="menu-dropdown"
        className="collapse multi-collapse"
        style={{
          zIndex: 9999,
          width: '100%',
          backgroundColor: 'rgb(208, 208, 208)',
          overflowY: 'scroll',
          // overscrollBehavior: 'contain',
          paddingBottom: 30
        }}
      >
        <div className="card" style={{ padding: 5, overflowY: "scroll", height: moreCategories.length > 5 ? '45vh' : '20vh' }}>
          {moreCategories}
        </div>
      </div>
    </div>
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
  theme: PropTypes.object,
  getProductPreset: PropTypes.func,
};

export default WebOrderingCategories;
