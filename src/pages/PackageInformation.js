import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReferralAction } from "redux/actions/ReferralAction";
import LoadingOverlayCustom from "components/loading/LoadingOverlay";
import screen from "hooks/useWindowSize";
import ImageItem from "assets/images/iconPro1.png";
const PackageInformation = () => {
  const responsiveDesign = screen();
  const gadgetScreen = responsiveDesign.width < 980;
  const [isLoading, setIsLoading] = useState(false);
  const [dataReferralInfo, setDataReferralInfo] = useState([]);
  const [referralList, setReferralList] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();

  const [copyRefNo, setCopyRefNo] = useState(false);

  const color = useSelector((state) => state.theme.color);
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(ReferralAction.getReferralInfo());
        setDataReferralInfo(response?.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadDataReferralList = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(ReferralAction.getReferralList());
        setReferralList(response?.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    loadDataReferralList();
  }, []);

  useEffect(() => {
    const clear = setTimeout(() => {
      setCopyRefNo(false);
    }, 1000);

    return () => {
      clearTimeout(clear);
    };
  }, [copyRefNo]);

  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    return date.toLocaleString("en-US", options);
  }

  const renderSnackBar = () => {
    return (
      <div
        style={{
          position: "fixed",
          top: "10%",
          left: "50%",
          width: "90%",
          margin: "auto",
          transform: "translate(-50%, -50%)",
          zIndex: 999999,
        }}
      >
        <div
          style={{
            alignSelf: "stretch",
            borderRadius: "4px",
            backgroundColor: color.primary,
            display: "flex",
            gap: "12px",
            padding: "17px 16px",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.9999 1.83334C5.93742 1.83334 1.83325 5.93751 1.83325 11C1.83325 16.0625 5.93742 20.1667 10.9999 20.1667C16.0624 20.1667 20.1666 16.0625 20.1666 11C20.1666 5.93751 16.0624 1.83334 10.9999 1.83334ZM14.9733 9.45001C15.0464 9.36638 15.1021 9.26896 15.1371 9.16348C15.172 9.05801 15.1855 8.9466 15.1768 8.83583C15.1681 8.72506 15.1373 8.61715 15.0862 8.51845C15.0352 8.41975 14.9649 8.33226 14.8795 8.26113C14.7942 8.18999 14.6955 8.13665 14.5892 8.10423C14.4829 8.07181 14.3712 8.06098 14.2607 8.07237C14.1501 8.08375 14.043 8.11713 13.9455 8.17054C13.8481 8.22394 13.7623 8.2963 13.6933 8.38334L10.1099 12.6825L8.25575 10.8275C8.09858 10.6757 7.88808 10.5917 7.66958 10.5936C7.45109 10.5955 7.24208 10.6832 7.08757 10.8377C6.93306 10.9922 6.84542 11.2012 6.84352 11.4197C6.84162 11.6382 6.92562 11.8487 7.07742 12.0058L9.57742 14.5058C9.6593 14.5877 9.75733 14.6515 9.86526 14.6934C9.9732 14.7352 10.0887 14.7541 10.2043 14.7489C10.32 14.7436 10.4332 14.7143 10.5369 14.6629C10.6406 14.6114 10.7325 14.5389 10.8066 14.45L14.9733 9.45001Z"
              fill="white"
            />
          </svg>

          <div
            style={{
              color: "var(--Brand-color-Secondary, #FFF)",
              alignSelf: "center",
              flexGrow: "1",
              whiteSpace: "nowrap",
              margin: "auto 0",
              font: "500 14px Plus Jakarta Sans, sans-serif ",
            }}
          >
            Referral code copied successfully!
          </div>
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

  const renderItem = () => {
    return (
      <div
        onClick={() => history.push('/packagedetail')}
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
            loading="lazy"
            src={ImageItem}
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
                Ultimate Serenity and Revitalization Extravaganza: A Harmonious
                Symphony of Personalized Wellness, Tranquil Indulgence, and
                Transformational Treatments for Mind, Body, and Soul Bliss
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
                19 December 2024
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
                10
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
          {/* LOL */}
          {renderItem()}
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
