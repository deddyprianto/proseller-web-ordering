export function ItemResults() {
  return (
    <div
      style={{
        alignSelf: "stretch",
        display: "flex",
        maxWidth: "430px",
        flexDirection: "column",
        padding: "0 16px",
      }}
    >
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
            fontFamily:
              "Plus Jakarta Sans, sans-serif",
            fontWeight: "500",
          }}
        >
          Search result for
        </div>
        <div
          style={{
            fontFamily:
              "Plus Jakarta Sans, sans-serif",
            fontWeight: "700",
          }}
        >
          watermelon
        </div>
      </div>
      {/* LOOP ON THIS */}
      <div
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
            justifyContent: "space-between",
            display: "flex",
            gap: "16px",
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
                fontFamily:
                  "Plus Jakarta Sans, sans-serif",
              }}
            >
              4711 ACQUA COLONIA BAMBOO & WATERMELON EDC 50ML UNISEX
            </div>
            <div
              style={{
                fontFamily:
                  "Plus Jakarta Sans, sans-serif",
                marginTop: "4px",
              }}
            >
              Rerum molestiae et sit consequatur eius enim.{" "}
            </div>
          </div>
          <div
            style={{
              disply: "flex",
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
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&"
              style={{
                position: "absolute",
                inset: "0",
                height: "100%",
                width: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/f47095b1c7d7f90ce3e6f596427269d7c7b206e582eee4c858c1625379ea5d61?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&"
              style={{
                aspectRatio: "1",
                objectFit: "auto",
                objectPosition: "center",
                width: "100%",
              }}
            />
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
            }}
          >
            SGD 34.00
          </div>
          <div
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
            <div
              style={{
                fontFamily:
                  "Plus Jakarta Sans, sans-serif",
              }}
            >
              Add
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


