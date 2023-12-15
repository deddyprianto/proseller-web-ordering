import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  IconCopyCode,
  IconInformation,
  IconIssuedPrice,
  IconNoReferredFriend,
  IconPendingPrice,
} from "./iconComponentReferral";
import { CopyToClipboard } from "react-copy-to-clipboard";
import IconCheckClipBoard from "assets/images/icon-check.png";
import { useHistory } from "react-router-dom";
import { ReferralAction } from "redux/actions/ReferralAction";
import LoadingOverlayCustom from "components/loading/LoadingOverlay";
import screen from "hooks/useWindowSize";
import { isEmptyArray } from "helpers/CheckEmpty";

const Referral = () => {
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

  console.log(referralList);

  useEffect(() => {
    const clear = setTimeout(() => {
      setCopyRefNo(false);
    }, 1000);

    return () => {
      clearTimeout(clear);
    };
  }, [copyRefNo]);

  // some function
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

  function maskName(fullName) {
    const parts = fullName.split(" ");
    let maskedName = parts
      .map((part) => {
        return part.charAt(0).toUpperCase() + "*".repeat(part.length - 1);
      })
      .join(" ");

    return maskedName;
  }

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

  const renderBoxReferral = () => {
    const senderBenefit = dataReferralInfo?.senderBenefit;
    const receiverBenefits = dataReferralInfo?.receiverBenefits;

    return (
      <div
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          alignSelf: "stretch",
          borderRadius: "8px",
          border: "1px dashed var(--grey-scale-color-grey-scale-3, #D6D6D6)",
          boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.10)",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          marginTop: "16px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#000",
            textAlign: "center",
            alignSelf: "start",
            whiteSpace: "nowrap",
            font: "500 14px Plus Jakarta Sans, sans-serif ",
          }}
        >
          As a sender you will get
        </div>
        {senderBenefit?.map((nameSender) => {
          return (
            <div
              key={nameSender}
              style={{
                color: color.primary,
                textAlign: "center",
                alignSelf: "start",
                marginTop: "4px",
                whiteSpace: "nowrap",
                font: "500 14px Plus Jakarta Sans, sans-serif ",
              }}
            >
              <ul style={{ margin: 0, padding: 0, marginLeft: "21px" }}>
                <li>{nameSender}</li>
              </ul>
            </div>
          );
        })}

        <div
          style={{
            backgroundColor: "#D6D6D6",
            alignSelf: "stretch",
            marginTop: "7px",
            height: "1px",
          }}
        />
        <div
          style={{
            color: "#000",
            alignSelf: "stretch",
            marginTop: "8px",
            font: "500 14px Plus Jakarta Sans, sans-serif ",
          }}
        >
          Your referred friend will get
        </div>

        {receiverBenefits?.map((rewardMe) => {
          return (
            <div
              key={rewardMe}
              style={{
                color: color.primary,
                alignSelf: "stretch",
                marginTop: "4px",
                font: "500 14px Plus Jakarta Sans, sans-serif ",
              }}
            >
              <ul style={{ margin: 0, padding: 0, marginLeft: "21px" }}>
                <li>{rewardMe}</li>
              </ul>
            </div>
          );
        })}

        <div
          style={{
            backgroundColor: "#D6D6D6",
            alignSelf: "stretch",
            marginTop: "7px",
            height: "1px",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "8px",
            gap: "8px",
          }}
        >
          <div>
            <IconInformation />
          </div>

          <div
            style={{
              color: "var(--text-color-tertiary, #9D9D9D)",
              alignSelf: "stretch",
              flexGrow: "1",
              flexBasis: "auto",
              font: "500 14px Plus Jakarta Sans, sans-serif ",
            }}
          >
            After you and your friend made [criteria total visit and/or total
            purchase] in [accumulate within day/week/month]
          </div>
        </div>
      </div>
    );
  };
  const renderTextRichEditor = () => {
    console.log(dataReferralInfo.howItWorks)
    return (
      <div
        style={{
          width: "100%",
          alignItems: "start",
          display: "flex",
          flexDirection: "column",
          marginTop: "16px",
        }}
      >
        <div
          style={{
            color: "var(--text-color-primary, #343A4A)",
            alignSelf: "stretch",
            whiteSpace: "nowrap",
            font: "700 16px Plus Jakarta Sans, sans-serif ",
            textAlign: "center",
          }}
        >
          How it works
        </div>

        <div
          style={{
            marginTop: "16px",
          }}
          dangerouslySetInnerHTML={{
            __html: dataReferralInfo?.howItWorks,
          }}
        />
      </div>
    );
  };

  const renderReferralCode = () => {
    return (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          marginTop: "16px",
        }}
      >
        <div
          style={{
            color: "var(--text-color-primary, #343A4A)",
            textAlign: "center",
            whiteSpace: "nowrap",
            font: "700 16px Plus Jakarta Sans, sans-serif ",
          }}
        >
          Your referral code
        </div>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
            display: "flex",
            marginTop: "4px",
            width: "100%",
            flexDirection: "column",
            padding: "0 80px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              whiteSpace: "nowrap",
              font: "600 36px Poppins, sans-serif ",
              color: color.primary,
              padding: "10px 0px",
            }}
          >
            {dataReferralInfo?.referral ? dataReferralInfo?.referral :'Loading...'}
          </div>
          <CopyToClipboard
            text={dataReferralInfo?.referral}
            onCopy={(text, result) => {
              setCopyRefNo(result);
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                border: `1px solid ${color.primary}`,
                marginTop: "4px",
                width: "145px",
                maxWidth: "100%",
                gap: "8px",
                padding: "7px 16px",
              }}
            >
              <IconCopyCode color={color.primary} />
              <div
                style={{
                  whiteSpace: "nowrap",
                  font: "500 14px Poppins, sans-serif ",
                  color: color.primary,
                }}
              >
                COPY CODE
              </div>
            </div>
          </CopyToClipboard>
          {copyRefNo && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <img
                width={20}
                height={20}
                src={IconCheckClipBoard}
                alt="icon check"
              />
              <div style={{ color: "green" }}>referral code copied</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderListPeopleInvited = () => {
    if (!isEmptyArray(referralList?.list)) {
      return referralList?.list?.map((itemStatus) => {
        return (
          <div
            key={itemStatus?.status}
            style={{
              justifyContent: "center",
              alignItems: "start",
              alignSelf: "stretch",
              borderRadius: "8px",
              boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.10)",
              backgroundColor: "var(--brand-color-tertiary, #F2F2F2)",
              display: "flex",
              width: "100%",
              flexDirection: "column",
              padding: "16px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                justifyContent: "space-between",
                alignSelf: "stretch",
                display: "flex",
                gap: "20px",
                padding: "2px 0",
              }}
            >
              <div
                style={{
                  color: "var(--text-color-primary, #343A4A)",
                  textAlign: "center",
                  font: "500 14px Plus Jakarta Sans, sans-serif ",
                }}
              >
                {itemStatus?.name}
              </div>
              <div
                style={{
                  color: "var(--text-color-tertiary, #9D9D9D)",
                  textAlign: "center",
                  font: "500 12px Plus Jakarta Sans, sans-serif ",
                }}
              >
                {formatDate(itemStatus.date)}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "8px",
                gap: "8px",
              }}
            >
              {itemStatus?.status === "PENDING_PRIZE" ? (
                <IconPendingPrice />
              ) : (
                <IconIssuedPrice />
              )}
              <div
                style={{
                  color:
                    itemStatus?.status === "PENDING_PRIZE"
                      ? "#F8B200"
                      : "#4EBE19",
                  textAlign: "center",
                  alignSelf: "center",
                  flexGrow: "1",
                  whiteSpace: "nowrap",
                  margin: "auto 0",
                  font: "500 14px Plus Jakarta Sans, sans-serif ",
                }}
              >
                {itemStatus?.status}
              </div>
            </div>
            <div
              style={{
                alignSelf: "stretch",
                color: "var(--text-color-tertiary, #9D9D9D)",
                marginTop: "4px",
                font: "500 14px Plus Jakarta Sans, sans-serif ",
              }}
            >
              {itemStatus?.description}
            </div>
          </div>
        );
      });
    } else {
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "16px",
          }}
        >
          <IconNoReferredFriend />
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: "16px", fontWeight: 700, color: "black" }}>
              No Referred Friend
            </div>
            <div
              style={{
                color: "var(--text-color-tertiary, #888787)",
                fontSize: "12px",
                lineHeight: "18px",
                textAlign: "center",
                fontWeight: 600,
              }}
            >
              Start share your referral link or code <br /> to your friend to
              get bonus
            </div>
          </div>
        </div>
      );
    }
  };

  const contentComponent = () => {
    return (
      <div style={{ marginTop: "66px", paddingBottom: 100 }}>
        {renderHeader()}
        <div style={{ padding: "16px" }}>
          <div
            style={{
              color: "var(--text-color-primary, #343A4A)",
              font: "700 24px Plus Jakarta Sans, sans-serif ",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            Refer a friend and get bonus!
          </div>

          {renderBoxReferral()}
          <div
            style={{
              backgroundColor: "#D6D6D6",
              alignSelf: "stretch",
              marginTop: "16px",
              height: "1px",
            }}
          />
          {renderTextRichEditor()}
          <div
            style={{
              backgroundColor: "#D6D6D6",
              alignSelf: "stretch",
              height: "1px",
              marginTop: "20px",
            }}
          />
          {renderReferralCode()}
          <div
            style={{
              backgroundColor: "#D6D6D6",
              alignSelf: "stretch",
              marginTop: "16px",
              height: "1px",
            }}
          />
          <div
            style={{
              color: "var(--text-color-primary, #343A4A)",
              width: "100%",
              justifyContent: "center",
              alignSelf: "stretch",
              font: "600 16px Plus Jakarta Sans, sans-serif ",
              marginTop: "16px",
            }}
          >
            {`${referralList?.list?.length}/${referralList?.dataLength} people invited`}
          </div>
          {renderListPeopleInvited()}
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

//   {
//     "phoneNumber": "+65123123098",
//     "email": "kenanganterindah@pahit.com",
//     "password": "I20HwtvY",
//     "username": "kenanganterindah@pahit.com",
//     "referralCode": "MARV62CMA",
//     "dataType": "text",
//     "defaultValue": "-",
//     "birthDate": "1997-12-31",
//     "name": "kenangan",
//     "smsNotification": true,
//     "emailNotification": true
// }

  return (
    <LoadingOverlayCustom active={isLoading} spinner text="Please wait...">
      {responsiveDesignComponent()}
    </LoadingOverlayCustom>
  );
};

export default Referral;
