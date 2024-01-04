import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import LoadingOverlayCustom from "components/loading/LoadingOverlay";
import screen from "hooks/useWindowSize";
import { PackageAction } from "redux/actions/PackageAction";
import { CONSTANT } from "helpers";
import emptyPackageImage from "../assets/images/emptyPackage.png";

const PackageInformation = () => {
  const responsiveDesign = screen();
  const gadgetScreen = responsiveDesign.width < 980;
  const [isLoading, setIsLoading] = useState(false);
  const [listPackage, setListPackage] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const loadData = async () => {
      let params = { skip: 0, take: 100 };
      try {
        setIsLoading(true);
        const response = await dispatch(
          PackageAction.getPackageCustomerList(params)
        );
        setListPackage(response?.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [dispatch]);

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

  const renderItem = (item) => {
    return (
      <div
        key={item?.packageId}
        onClick={() => {
          history.push("/packagedetail");
          dispatch({
            type: CONSTANT.PACKAGE_ID_CUSTOMER,
            payload: item?.packageId,
          });
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr",
          gridTemplateRows: "1fr",
          gap: "0px 0px",
          gridAutoFlow: "row",
          gridTemplateAreas: '". ."',
          borderRadius: "8px",
          boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.10)",
          backgroundColor: "var(--Button-color-Standby, #FFF)",
          padding: "12px",
          marginTop: "8px",
          marginBottom: "8px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <img
            alt=""
            loading="lazy"
            src={item?.imageUrl}
            style={{
              aspectRatio: "1",
              objectFit: "contain",
              objectPosition: "center",
              width: "48px",
              overflow: "hidden",
              maxWidth: "100%",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <table>
            <tr>
              <td
                style={{
                  width: "100%",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  padding: 0,
                  margin: 0,
                  font: "700 14px Poppins, sans-serif ",
                  lineHeight: "23px",
                }}
              >
                {item?.packageName}
              </td>
            </tr>
          </table>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "4px",
            }}
          >
            <div
              style={{
                justifyContent: "center",
                borderRadius: "4px",
                display: "flex",
                flexGrow: "1",
                flexBasis: "0%",
                paddingRight: "26px",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  color: "var(--Text-color-Tertiary, #B7B7B7)",
                  font: "500 12px Poppins, sans-serif ",
                }}
              >
                End Valid Period
              </div>
              <div
                style={{
                  color: "#009E4E",
                  whiteSpace: "nowrap",
                  font: "500 14px Poppins, sans-serif ",
                  marginTop: "5px",
                }}
              >
                {item?.endValidPeriod}
              </div>
            </div>
            <div
              style={{
                justifyContent: "center",
                borderRadius: "4px",
                display: "flex",
                flexGrow: "1",
                flexBasis: "0%",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  color: "var(--Text-color-Tertiary, #B7B7B7)",
                  whiteSpace: "nowrap",
                  font: "500 12px Poppins, sans-serif ",
                }}
              >
                Remaining Balance
              </div>
              <div
                style={{
                  color: "#009E4E",
                  font: "500 14px Poppins, sans-serif ",
                  marginTop: "5px",
                }}
              >
                {item?.remainingBalance}
              </div>
            </div>
          </div>
        </div>
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
        <div style={{ padding: "16px", fontSize: "16px" }}>
          <p
            style={{
              fontWeight: 700,
            }}
          >
            My Packages
          </p>

          {listPackage.length ? (
            listPackage.map((item) => {
              return renderItem(item);
            })
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                marginTop: '10vh'
              }}
            >
              <img
                src={emptyPackageImage}
                width={246}
                height={246}
                alt="is empty"
              />
              <p style={{ fontWeight: 700, margin: "15px 0 0" }}>Empty Package</p>
              <p style={{ fontSize: 14 }}>
                You have not purchased any package
              </p>
            </div>
          )}
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

export default PackageInformation;
