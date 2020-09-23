import React, { Component } from "react";
import _ from "lodash";

export default class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: 0,
      openSearch: false,
      textSearch: "",
    };
  }

  componentDidMount() {
    this.handleScrollTo();
  }

  handleScrollTo = () => {
    document.addEventListener("scroll", () => {
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
                .scrollIntoView({ inline: "end" });
            } catch (e) {}
          }
        } catch (e) {}
      });
    });
  };

  // handleScroll = (e) => {
  //   var header = document.getElementById("header-categories");
  //   var headerCWO = document.getElementById("masthead");
  //   var headerOffset = document.getElementById("offset-header");
  //   var sticky = headerOffset.offsetTop;

  //   if (window.pageYOffset > sticky) {
  //     header.classList.add("sticky");
  //     header.style.top = `${headerCWO.offsetHeight - 5}px`;
  //   } else {
  //     header.classList.remove("sticky");
  //     header.style.top = 0;
  //   }
  // }

  goToCategory = (item, i) => {
    try {
      window.scrollTo({
        top: document.getElementById(i).offsetTop - 130,
        behavior: "smooth",
      });
      this.setState({ selectedCategory: i });
    } catch (error) {
      console.log("waiting get data");
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (_.isEqual(nextProps.categories, this.props.categories) == false) {
      this.setState({ selectedCategory: 0 });
    }

    if (nextProps.selectedCategory != this.state.selectedCategory) {
      this.setState({ selectedCategory: nextProps.selectedCategory });
    }
  };

  render() {
    const { selectedCategory, openSearch } = this.state;

    return (
      <ul
        id="header-categories"
        className="nav nav-tabs pizzaro-nav-tabs categories-product sticky"
        style={{
          marginTop: -20,
          zIndex: 200,
          boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
        }}
      >
        {this.props.categories.map((item, i) => (
          <li
            id={`cat-${i}`}
            style={{ cursor: "pointer" }}
            key={i}
            onClick={() => this.goToCategory(item, i)}
            className={
              i == selectedCategory
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
                  zIndex: 200,
                  width: "100%",
                }}
              />
            )}
          </li>
        ))}
      </ul>
    );
  }
}
