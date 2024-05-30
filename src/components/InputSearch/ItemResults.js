import React from "react";
import { useSelector } from "react-redux";
import MappingResult from "./MappingResult";
import SearchNotFound from "assets/icons/Search.png";
import "./loadingCustom.css";

export function ItemResults() {
  const { searchResults, keywordSearch, searchLoading, searchItemEmpty } =
    useSelector((state) => state.getSpaceLogo);

  if (searchLoading) {
    return (
      <div
        style={{
          padding: "0 16px",
          marginTop: "57px",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span className="loader"></span>
        <h1 style={{ fontSize: "16px", marginTop: "16px" }}>Please Wait...</h1>
        <p style={{ fontSize: "14px", textAlign: "center" }}>
          Sit tight, and we'll have everything ready in a moment.
        </p>
      </div>
    );
  } else if (searchItemEmpty) {
    return (
      <div
        style={{
          padding: "0 16px",
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img alt="icon" src={SearchNotFound} />
        <h1 style={{ fontSize: "16px", marginTop: "16px" }}>Item Not Found</h1>
        <p style={{ fontSize: "14px", textAlign: "center" }}>
          We couldn't find the item you searched for.Please double-check your
          keyword.
        </p>
      </div>
    );
  } else {
    return (
      <div
        style={{
          alignSelf: "stretch",
          display: "flex",
          maxWidth: "430px",
          flexDirection: "column",
          padding: "0 16px",
          marginTop: "57px",
          paddingBottom:100
        }}
      >
        {keywordSearch && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              fontSize: "14px",
              color: "#000",
            }}
          >
            <div
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: "500",
              }}
            >
              Search result for{" "}
              <span
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: "700",
                }}
              >
                {keywordSearch}
              </span>
            </div>
          </div>
        )}
        {searchResults.map((item) => {
          return <MappingResult key={item.id} item={item} />;
        })}
      </div>
    );
  }
}
