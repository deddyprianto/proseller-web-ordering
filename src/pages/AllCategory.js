import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Shimmer from "react-shimmer-effect";
import { ProductAction } from "../redux/actions/ProductAction";

export const AllCategory = ({ categories, dispatch, productPlaceholder }) => {
  const [filter, setFilter] = useState("");
  const [categoryList, setCategoryList] = useState(categories);

  useEffect(() => {
    dispatch(ProductAction.fetchCategoryList());
  }, []);

  useEffect(() => {
    const filteredCategories =
      categories && categories.length > 0
        ? categories.filter((category) =>
            category.name.toLowerCase().includes(filter.toLowerCase())
          )
        : [];
    setCategoryList(filteredCategories);
  }, [categories, filter]);
  return (
    <div style={{ margin: "100px 3rem" }}>
      <h2>Categories</h2>
      <input
        onChange={(e) => setFilter(e.target.value)}
        className="form-control"
        placeholder="Search"
        style={{ fontSize: "1.5rem" }}
      ></input>
      {categories ? (
        categoryList.length > 0 ? (
          categoryList.map((category) => {
            return (
              <div className="col-xs-4 col-md-2">
                <div class="card">
                  <img
                    class="card-img-top"
                    src={category.defaultImageURL || productPlaceholder || ""}
                    alt="Card cap"
                  ></img>
                  <div class="card-body">
                    <p class="card-text text-center">{category.name}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center mt-2">
            <strong>Category not found</strong>
          </div>
        )
      ) : (
        <Shimmer>
          <div
            style={{
              width: "100%",
              height: 100,
              alignSelf: "center",
              borderRadius: "8px",
              marginBottom: 10,
            }}
          />
        </Shimmer>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  categories: state.product.categoryList,
  productPlaceholder: state.theme.color.productPlaceholder,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    fetchCategoryList: dispatch(ProductAction.fetchCategoryList()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllCategory);
