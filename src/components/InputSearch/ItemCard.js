import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
  handleCurrency,
  handleOpenUpdateModal,
  renderImageProduct,
} from "./fnHelper";

const ItemCard = ({
  item,
  totalQty,
  isLoadingUpdate,
  handleOpenAddModal,
  setIsLoadingUpdate,
  setIsOpenUpdateModal,
  setProductDetail,
}) => {
  const dispatch = useDispatch();

  const defaultOutlet = useSelector((state) => state.outlet.defaultOutlet);
  const companyInfo = useSelector((state) => state.masterdata);

  const originalString = item?.product?.name;
  const modifiedString = originalString.replace(/\(([^)]+)\)/g, (match, p1) => {
    const modifiedContent = p1.split(",").join(", ");
    return `(${modifiedContent})`;
  });

  return (
    <div
      key={item?.id}
      style={{
        borderRadius: "8px",
        boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.24)",
        backgroundColor: "var(--Grey-Scale-color-Grey-Scale-4, #F9F9F9)",
        display: "flex",
        marginTop: "16px",
        width: "100%",
        flexDirection: "column",
        padding: "12px",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 65px",
          gridTemplateRows: "1fr",
          gridAutoColumns: "1fr",
          gap: "0px 0px",
          gridAutoFlow: "row",
          gridTemplateAreas: '". ."',
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "14px",
            color: "var(--Text-color-Primary, #020202)",
            fontWeight: "700",
          }}
        >
          <div
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
            }}
          >
            {modifiedString}
          </div>
          <div
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              marginTop: "4px",
            }}
          >
            {item?.product?.categoryName}
          </div>
        </div>
        <div
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            aspectRatio: "1",
            width: "64px",
          }}
        >
          {renderImageProduct({ item: item?.product })}
        </div>
      </div>
      <div
        style={{
          justifyContent: "space-between",
          display: "flex",
          marginTop: "16px",
          width: "100%",
          gap: "16px",
          fontWeight: "700",
        }}
      >
        <div
          style={{
            color: "var(--Brand-color-Primary, #ED766B)",
            alignSelf: "start",
            marginTop: "14px",
            font: "16px Plus Jakarta Sans, sans-serif ",
            fontWeight: 700,
          }}
        >
          {handleCurrency({ companyInfo, price: item?.product?.retailPrice })}
        </div>
        <button
          id="buttonSearch"
          onClick={() => {
            if (totalQty) {
              handleOpenUpdateModal({
                defaultOutlet,
                dispatch,
                isLoadingUpdate,
                item,
                setIsLoadingUpdate,
                setIsOpenUpdateModal,
                setProductDetail,
              });
            } else {
              handleOpenAddModal();
            }
          }}
          style={{
            justifyContent: "center",
            borderRadius: "8px",
            backgroundColor: "var(--Brand-color-Primary, #ED766B)",
            display: "flex",
            gap: "8px",
            fontSize: "14px",
            color: "var(--Brand-color-Tertiary, #F2F2F2)",
            whiteSpace: "nowrap",
            padding: "8px 16px",
            alignItems: "center",
            width: "87px",
          }}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/435b9bf605a9325e6699407fc8af7aeb9fd3a576e919641835a162afacea0032?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&"
            style={{
              aspectRatio: "1",
              objectFit: "auto",
              objectPosition: "center",
              width: "18px",
            }}
          />

          {isLoadingUpdate[item.sequence] ? (
            <CircularProgress size={18} sx={{ color: "#ffffff" }} />
          ) : (
            <Typography
              sx={{
                color: "#FFFFFF",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "13px",
              }}
            >
              {totalQty ? "Update" : "Add"}
            </Typography>
          )}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
