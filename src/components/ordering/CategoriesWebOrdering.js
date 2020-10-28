import React, { Component } from "react";
import _ from "lodash";

export default class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: 0,
      openSearch: false,
      textSearch: "",
      scrollEventListener: null,
    };
  }

  componentDidMount() {
    this.handleScrollTo();
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.state.scrollEventListener);
  }

  handleScrollTo = () => {
    const scrollEventListener = document.addEventListener("scroll", () => {
      this.props.categories.forEach((element, i) => {
        try {
          var target = document.getElementById(i);
          if (
            target.offsetTop <= window.pageYOffset + 200 &&
            target.offsetTop + 110 >= window.pageYOffset
          ) {
            this.setState({ selectedCategory: i });
            try {
              document
                .getElementById(`cat-${i}`)
                .scrollIntoView({ behavior: "smooth", inline: "center" });
            } catch (e) {}
          }
        } catch (e) {}
      });
    });
    this.setState({ scrollEventListener });
  };

  goToCategory = (item, i) => {
    try {
      window.scrollTo({
        top: document.getElementById(i).offsetTop - 40,
        behavior: "smooth",
      });
      this.setState({ selectedCategory: i });
    } catch (error) {
      console.log("waiting get data");
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (_.isEqual(nextProps.categories, this.props.categories) === false) {
      this.setState({ selectedCategory: 0 });
    }

    if (nextProps.selectedCategory !== this.state.selectedCategory) {
      this.setState({ selectedCategory: nextProps.selectedCategory });
    }
  };

  isItemsFinishedToLoad = (query) => {
    const { finished } = this.props;

    try {
      this.props.loadingSearching(true);

      if (!finished) {
        this.props.setLoading(true);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          return this.isItemsFinishedToLoad(query);
        }, 2000);
      } else {
        this.props.searchProduct(query);
      }
    } catch (e) {}
  };

  render() {
    const { selectedCategory, openSearch } = this.state;

    return (
      <ul
        id="header-categories"
        className="nav nav-tabs pizzaro-nav-tabs categories-product relative-position"
        style={{ marginBottom: 0 }}
      >
        {!openSearch ? (
          this.props.categories.map((item, i) => (
            <li
              id={`cat-${i}`}
              style={{ cursor: "pointer" }}
              key={i}
              onClick={() => this.goToCategory(item, i)}
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
          ))
        ) : (
          <input
            onKeyUp={(e) => {
              this.isItemsFinishedToLoad(e.target.value);
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
              className="search_icon"
              onClick={() => {
                this.setState({ openSearch: false });
                this.props.searchProduct("");
              }}
              style={{ fontSize: 25, cursor: "pointer", marginTop: 5 }}
              className="fa fa-close color"
            ></i>
          ) : (
            <i
              onClick={() => {
                this.setState({ openSearch: true });
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
  }
}
