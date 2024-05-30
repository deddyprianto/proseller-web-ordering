import { ProductService } from "Services/ProductService";
import { CONSTANT } from "helpers";
import { isEmptyArray } from "helpers/CheckEmpty";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

export function InputSearch() {
  const refInputSearch = useRef();
  const dispatch = useDispatch();
  const { color } = useSelector((state) => state.theme);
  const { defaultOutlet } = useSelector((state) => state.outlet);
  const { selectedCategory } = useSelector((state) => state.product);

  const handleSearch = async (valueSearch) => {
    const payload = {
      skip: 0,
      take: 20,
      outletID: `outlet::${defaultOutlet?.id}`,
      categoryID: `category::${selectedCategory?.id}`,
      filters: [
        {
          id: "search",
          value: valueSearch,
        },
      ],
    };
    dispatch({
      type: "KEYWORD_SEARCH",
      payload: valueSearch,
    });

    try {
      dispatch({
        type: "SEARCH_LOADING",
        payload: true,
      });
      const response = await ProductService.api(
        "POST",
        payload,
        "product/load",
        "Bearer"
      );
      dispatch({
        type: "SEARCH_LOADING",
        payload: false,
      });

      if (isEmptyArray(response.data)) {
        dispatch({
          type: "IS_SEARCH_ITEM_EMPTY",
          payload: true,
        });
      } else {
        dispatch({
          type: "IS_SEARCH_ITEM_EMPTY",
          payload: false,
        });
        dispatch({
          type: CONSTANT.SEARCH_RESULTS,
          payload: response.data,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        alignItems: "center",
        backgroundColor: "var(--Brand-color-Tertiary, #F2F2F2)",
        gap: "16px",
        padding: "16px",
        justifyContent: "space-evenly",
        display: "flex",
        position: "fixed",
        top: "0px",
        width: "100%",
        zIndex: "999",
        paddingTop: "8px",
        paddingBottom: "8px",
      }}
    >
      <div
        onClick={() => {
          dispatch({
            type: "KEYWORD_SEARCH",
            payload: "",
          });
          dispatch({
            type: CONSTANT.SEARCH_RESULTS,
            payload: [],
          });
          dispatch({
            type: CONSTANT.IS_SEARCH_ITEM,
            payload: false,
          });
        }}
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/468da623b71470c47ea7f7160a9a76cc0a3a1eff15fe8e7e72be98b782f4b8b8?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&"
          style={{
            aspectRatio: "1",
            objectFit: "auto",
            objectPosition: "center",
            width: "36px",
            alignSelf: "stretch",
            margin: "auto 0",
          }}
        />
      </div>

      <div
        style={{
          borderRadius: "8px",
          boxShadow: "0px 0px 0px 3px rgba(159, 135, 255, 0.20)",
          borderColor: "rgba(136, 135, 135, 1)",
          borderStyle: "solid",
          borderWidth: "1px",
          backgroundColor: "var(--Brand-color-Secondary, #FFF)",
          color: "var(--Text-color-Tertiary, #888787)",
          justifyContent: "center",
          padding: "7px 6px",
          width: "65%",
          font: "500 14px Plus Jakarta Sans, sans-serif ",
        }}
      >
        <input
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch(event.target.value);
            }
          }}
          style={{
            border: "none",
            outline: "none",
            width: "100%",
          }}
          autoFocus
          placeholder="Search anything..."
          type="text"
          ref={refInputSearch}
        />
      </div>
      <button
        onClick={() => {
          handleSearch(refInputSearch.current.value);
        }}
        style={{
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "100%",
          backgroundColor: color.primary,
          display: "flex",
          width: "40px",
          height: "40px",
          margin: "auto 0",
          padding: "0 8px",
        }}
      >
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/545263d704b4a749b37a19b61649502acb2490d4ea8381fab658a78348bda72c?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&"
          style={{
            aspectRatio: "1",
            objectFit: "auto",
            objectPosition: "center",
            width: "24px",
          }}
        />
      </button>
    </div>
  );
}
