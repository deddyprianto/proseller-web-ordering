import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Shimmer from "react-shimmer-effect";
import { ProductAction } from "../redux/actions/ProductAction";
import Cards from "../components/Cards";

export const AllCategory = ({
  categories,
  dispatch,
  productPlaceholder,
  history,
}) => {
  const [filter, setFilter] = useState("");
  const [categoryList, setCategoryList] = useState(categories);
  const handleCategoryClick = async (category) => {
    dispatch(ProductAction.setSelectedCategory(category));
    history.push(`category/${category.id}/products`);
  };

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
      <div style={{ marginTop: "2rem" }}>
        {categories ? (
          categoryList.length > 0 ? (
            <div className="row">
              {categoryList.map((category) => {
                return (
                  <div
                    className="col-xs-4 col-md-2"
                    onClick={() => handleCategoryClick(category)}
                    key={category.id}
                  >
                    <Cards>
                      <Cards.Image
                        src={
                          category.defaultImageURL || productPlaceholder || ""
                        }
                      ></Cards.Image>
                      <Cards.Body>
                        <p className="card-text text-center">
                          <small>{category.name}</small>
                        </p>
                      </Cards.Body>
                    </Cards>
                  </div>
                );
              })}
            </div>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllCategory);
