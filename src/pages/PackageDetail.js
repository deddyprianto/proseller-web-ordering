import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";

import screen from "hooks/useWindowSize";
import { PackageAction } from "redux/actions/PackageAction";
import LoadingOverlayCustom from "components/loading/LoadingOverlay";

const PackageDetail = () => {
  const responsiveDesign = screen();
  const gadgetScreen = responsiveDesign.width < 980;
  const history = useHistory();
  const dispatch = useDispatch();

  const color = useSelector((state) => state.theme.color);
  const packageId = useSelector((state) => state.packageReducer.packageId);

  const [isLoading, setIsLoading] = useState(false);
  const [packageData, setPackageData] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(
          PackageAction.getPackageById(packageId)
        );
        setPackageData(response?.data?.[0]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [dispatch, packageId]);

  const dateFormatter = (date, type) => {
    const dateFormat = type === "date" ? "DD MMM YYYY" : "HH:mm";
    return date && moment(date).format(dateFormat);
  };

  const priceFormatter = (price) => {
    return price && `$ ${parseFloat(price.toFixed(2))}`;
  };

  const renderItem = (item, index) => {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 81px",
          gridTemplateRows: "1fr",
          gap: "0px 0px",
          gridAutoFlow: "row",
          gridTemplateAreas: '". ."',
        }}
      >
        <div
          style={{
            alignItems: "start",
            backgroundColor: index % 2 === 0 ? "#FFF" : "#F9F9F9",
            display: "flex",
            flexGrow: "1",
            flexBasis: "0%",
            flexDirection: "column",
            padding: "8px 80px 8px 16px",
          }}
        >
          <div
            style={{
              color: "#009E4E",
              textAlign: "center",
              font: "500 12px Poppins, sans-serif ",
            }}
          >
            {item?.transactionRefNo}
          </div>
          <div
            style={{
              color: "var(--Text-color-Tertiary, #B7B7B7)",
              display: "flex",
              alignItems: "center",
              font: "500 12px Poppins, sans-serif ",
            }}
          >
            {dateFormatter(item?.allocationDate, "date")}
            <div
              style={{
                borderRadius: "50%",
                width: "4px",
                height: "4px",
                backgroundColor: "var(--Text-color-Tertiary, #B7B7B7)",
                margin: "10px 5px"
              }}
            />
            {dateFormatter(item?.allocationDate, "time")}
          </div>
        </div>
        <div
          style={{
            color: item?.amount < 0 ? "#CE1111" : "#009E4E",
            backgroundColor: index % 2 === 0 ? "#FFF" : "#F9F9F9",
            font: "500 12px Poppins, sans-serif ",
            display: "flex",
            alignItems: "center",
            paddingLeft: "20px",
          }}
        >
          <div>{item?.amount}</div>
        </div>
      </div>
    );
  };
  const renderHeader = () => {
    return (
      <div
        onClick={() => history.goBack()}
        style={{
          alignSelf: "stretch",
          backgroundColor: "var(--brand-color-tertiary, #F2F2F2)",
          display: "flex",
          gap: "5px",
          padding: "8px 80px 8px 16px",
          boxShadow: "1px 2px 5px rgba(128, 128, 128, 0.5)",
        }}
      >
        <img
          alt=""
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7de4038b825f5fb1a0f49d52025ab2b9f3049a4a1915f7533987a48257cc1626?apiKey=7ef2d401d2464e0bb0e4708e7eee43f9&"
          style={{
            aspectRatio: "1",
            objectFit: "contain",
            objectPosition: "center",
            width: "24px",
            overflow: "hidden",
            maxWidth: "100%",
          }}
        />
        <div
          style={{
            justifyContent: "center",
            color: "var(--text-color-primary, #343A4A)",
            alignSelf: "center",
            flexGrow: "1",
            whiteSpace: "nowrap",
            margin: "auto 0",
            font: "500 16px Plus Jakarta Sans, sans-serif ",
          }}
        >
          Back
        </div>
      </div>
    );
  };

  const renderGridDetail = () => {
    return (
      <div
        style={{
          marginTop: "15px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr",
          gridAutoColumns: "1fr",
          gap: "10px 0px",
          gridAutoFlow: "row",
          gridTemplateAreas: '". ."\n    ". ."\n ',
          font: "500 14px/24px Poppins, sans-serif ",
        }}
      >
        <div>
          <div style={{ color: "#B7B7B7", fontWeight: 500 }}>
            Remaining Balance
          </div>
          <div style={{ color: color.primary, fontWeight: 500 }}>
            {packageData?.remainingBalance}
          </div>
        </div>
        <div>
          <div style={{ color: "#B7B7B7", fontWeight: 500 }}>Expired</div>
          <div style={{ color: color.primary, fontWeight: 500 }}>
            {packageData?.expiredBalance}
          </div>
        </div>
        <div>
          <div style={{ color: "#B7B7B7", fontWeight: 500 }}>
            Start Valid Period
          </div>
          <div style={{ color: color.primary, fontWeight: 500 }}>
            {packageData?.startValidPeriod}
          </div>
        </div>
        <div>
          <div style={{ color: "#B7B7B7", fontWeight: 500 }}>
            End Valid Period
          </div>
          <div style={{ color: color.primary, fontWeight: 500 }}>
            {packageData?.endValidPeriod}
          </div>
        </div>
        <div>
          <div style={{ color: "#B7B7B7", fontWeight: 500 }}>Value</div>
          <div style={{ color: color.primary, fontWeight: 500 }}>
            {priceFormatter(packageData?.value)}
          </div>
        </div>
        <div>
          <div style={{ color: "#B7B7B7", fontWeight: 500 }}>Breakdown</div>
          <div style={{ color: color.primary, fontWeight: 500 }}>
            {priceFormatter(packageData?.valueBreakdown)}
          </div>
        </div>
      </div>
    );
  };
  const renderLabelBottom = () => {
    const isHistoryExist = !!packageData?.history?.length;
    const data = packageData?.history;
    return (
      <div
        style={{
          alignSelf: "stretch",
          borderRadius: "8px",
          backgroundColor: `${color.primary}10`,
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          marginTop: "16px",
        }}
      >
        <div
          style={{
            color: "var(--Text-color-Primary, #000)",
            font: "700 16px Poppins, sans-serif ",
          }}
        >
          History
        </div>
        {isHistoryExist ? (
          <div
            style={{
              borderRadius: "8px",
              display: "flex",
              width: "100%",
              flexDirection: "column",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 115px",
                gridTemplateRows: "1fr",
                gap: "0px 0px",
                gridAutoFlow: "row",
                gridTemplateAreas: '". ."',
              }}
            >
              <div
                style={{
                  backgroundColor: color.primary,
                  display: "flex",
                  gap: "10px",
                  padding: "8px 16px",
                  borderTopLeftRadius: "8px",
                }}
              >
                <div
                  style={{
                    color: "var(--Text-color-Secondary, #FFF)",
                    textAlign: "left",
                    flexGrow: "1",
                    whiteSpace: "nowrap",
                    font: "700 12px Poppins, sans-serif ",
                  }}
                >
                  Ref. No. & Allocation Date
                </div>
              </div>

              <div
                style={{
                  color: "var(--Text-color-Secondary, #FFF)",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                  backgroundColor: color.primary,
                  flexGrow: "1",
                  justifyContent: "center",
                  padding: "8px 16px",
                  font: "700 12px Poppins, sans-serif ",
                  borderTopRightRadius: "8px",
                }}
              >
                Added / Used
              </div>
            </div>

            {data.map((item, index) => {
              return <div key={item}>{renderItem(item, index)}</div>;
            })}
          </div>
        ) : (
          <div
            style={{
              color: "var(--Text-color-Primary, #000)",
              textAlign: "center",
              whiteSpace: "nowrap",
              borderRadius: "8px",
              backgroundColor: "var(--Brand-color-Secondary, #FFF)",
              marginTop: "16px",
              justifyContent: "center",
              padding: "24px 0",
              font: "500 14px Poppins, sans-serif ",
            }}
          >
            The package has not been utilized yet.
          </div>
        )}
      </div>
    );
  };
  const contentComponent = () => {
    return (
      <div
        style={{
          marginTop: "66px",
          paddingBottom: 100,
        }}
      >
        {renderHeader()}
        <div
          style={{
            padding: "16px",
            color: "black",
            font: "700 14px/24px Poppins, sans-serif ",
          }}
        >
          <p
            style={{
              fontWeight: 700,
            }}
          >
            Package Details
          </p>
          <div
            style={{
              backgroundColor: "#D6D6D6",
              alignSelf: "stretch",
              margin: "16px 0px",
              height: "1px",
            }}
          />
          <div>{packageData?.packageName}</div>
          {renderGridDetail()}
          {renderLabelBottom()}
        </div>
      </div>
    );
  };

  const responsiveDesignComponent = () => {
    if (gadgetScreen) {
      return contentComponent();
    } else {
      return (
        <div
          style={{
            width: "100vw",
          }}
        >
          <div
            style={{
              width: "45%",
              marginLeft: "auto",
              marginRight: "auto",
              backgroundColor: "white",
              height: "98vh",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "1fr 55px",
              gap: "0px 15px",
              gridTemplateAreas: '"."\n    "."',
              overflowY: "auto",
              marginTop: "10px",
              paddingLeft: "16px",
              paddingRight: "16px",
              position: "relative",
            }}
          >
            {contentComponent()}
          </div>
        </div>
      );
    }
  };

  return (
    <LoadingOverlayCustom active={isLoading} spinner text="Please wait...">
      {responsiveDesignComponent()}
    </LoadingOverlayCustom>
  );
};

export default PackageDetail;
