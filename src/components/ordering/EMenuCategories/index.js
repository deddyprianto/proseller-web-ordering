import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const EMenuCategories = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
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
        top: document.getElementById(selectedCategory).offsetTop - 80,
        behavior: "smooth",
      });
    } catch (error) {
      console.log("fetching categories....");
    }
  }, [selectedCategory]);

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
              i == selectedCategory ? "color-active" : "color-nonactive"
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
                zIndex: 200,
                width: "100%",
              }}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

EMenuCategories.propTypes = {
  categories: PropTypes.array,
  selectedCategory: PropTypes.number,
  setSelectedCategory: PropTypes.func,
};

export default EMenuCategories;
