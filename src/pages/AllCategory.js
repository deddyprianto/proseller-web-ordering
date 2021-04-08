import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Shimmer from "react-shimmer-effect";
import { ProductAction } from "../redux/actions/ProductAction";
import Cards from "../components/Cards";
import { useParams, useLocation } from "react-router-dom";

export const AllCategory = ({
  categories,
  dispatch,
  productPlaceholder,
  history,
}) => {
  let { childId } = useParams();
  const location = useLocation();

  const [filter, setFilter] = useState("");
  const [isSubCategory, setSubCategory] = useState(false);
  const [selectedCategory, setCategory] = useState(null);
  const [categoryList, setCategoryList] = useState(categories);
  const handleCategoryClick = async (category) => {
    const isParent = await dispatch(ProductAction.isParentCategory(category.sortKey));

    if (isParent === true) {
      dispatch(ProductAction.fetchCategoryList(null, category.sortKey));
      setCategory(category)
      setSubCategory(true)
    } else {
      dispatch(ProductAction.setSelectedCategory(category));
      history.push(`category/${category.id}/products`);
    }
  };

  const fetchAllCategory = () => {
    dispatch(ProductAction.fetchCategoryList());
    setSubCategory(false)
    setSubCategory(null)
  }

  useEffect(() => {
    if (childId) {
      if (location && location.state) {
        setCategory(location.state)
        setSubCategory(true)
      }
      dispatch(ProductAction.fetchCategoryList(null, `category::${childId}`));
    } else {
      dispatch(ProductAction.fetchCategoryList());
    }
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
      <div style={{ display: 'flex' }}>
        { isSubCategory && <i onClick={fetchAllCategory} style={{ marginRight: 10, fontSize: 23, marginRight: 15 }} className="fa fa-arrow-left" /> }
        {
           isSubCategory ? <h3>{selectedCategory.name}</h3> : <h3>Categories</h3>
        }
      </div>
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
