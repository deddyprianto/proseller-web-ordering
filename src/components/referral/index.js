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
import { useHistory } from "react-router-dom";
import { ReferralAction } from "redux/actions/ReferralAction";
import LoadingOverlayCustom from "components/loading/LoadingOverlay";
import screen from "hooks/useWindowSize";
import { isEmptyArray } from "helpers/CheckEmpty";

    const Referral = () => {
      const responsiveDesign = screen();
      const gadgetScreen = responsiveDesign.width < 980;
      const [isLoading, setIsLoading] = useState(false);
      const [expandAccordionSender, setExpandAccordionSender] = useState(false);
      const [expandAccordionReceiver, setExpandAccordionReceiver] =
        useState(false);
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

      const senderBenefit = dataReferralInfo?.senderBenefit;
      const receiverBenefits = dataReferralInfo?.receiverBenefits;

      const handleHTMLStringCustomization = (descriptionHTML) => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(descriptionHTML, "text/html");
        const customStyleForLink = dom.getElementsByTagName("a");
        for (const link of customStyleForLink) {
          link.style.color = "blue";
        }
        const updatedHtmlString = dom.documentElement.innerHTML;
        return updatedHtmlString;
      };

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

      const renderIconDropDown = (arrowTop) => {
        if (arrowTop) {
          return (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.2929 8.29289C11.6834 7.90237 12.3166 7.90237 12.7071 8.29289L18.7071 14.2929C19.0976 14.6834 19.0976 15.3166 18.7071 15.7071C18.3166 16.0976 17.6834 16.0976 17.2929 15.7071L12 10.4142L6.70711 15.7071C6.31658 16.0976 5.68342 16.0976 5.29289 15.7071C4.90237 15.3166 4.90237 14.6834 5.29289 14.2929L11.2929 8.29289Z"
                fill="black"
              />
            </svg>
          );
        } else {
          return (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill="black"
              />
            </svg>
          );
        }
      };

      const accordionDetails = (isAccordion, data) => {
        return (
          <div
            style={{
              maxHeight: isAccordion ? "120px" : "75px",
              overflow: "hidden",
              transition: "max-height 0.3s ease-out",
              overflowY: "auto",
              width: "100%",
            }}
          >
            {data
              ?.slice(0, isAccordion ? data.length : 3)
              ?.map((rewardMe, index) => (
                <div
                  key={index}
                  style={{
                    color: color.primary,
                    alignSelf: "stretch",
                    font: "500 14px Plus Jakarta Sans, sans-serif ",
                  }}
                >
                  <ul style={{ margin: 0, padding: 0, marginLeft: "21px" }}>
                    <li style={{ marginTop: "6px" }}>{rewardMe}</li>
                  </ul>
                </div>
              ))}
          </div>
        );
      };

      const renderBoxReferral = () => {
        if (
          dataReferralInfo?.criteria ||
          !isEmptyArray(senderBenefit) ||
          !isEmptyArray(receiverBenefits)
        ) {
          return (
            <div
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                alignSelf: "stretch",
                borderRadius: "8px",
                border:
                  "1px dashed var(--grey-scale-color-grey-scale-3, #D6D6D6)",
                boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.10)",
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                marginTop: "16px",
                width: "100%",
              }}
            >
              {!isEmptyArray(senderBenefit) && (
                <React.Fragment>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        color: "#000",
                        font: "500 14px Plus Jakarta Sans, sans-serif ",
                      }}
                    >
                      As a sender you will get
                    </div>
                    {senderBenefit.length > 3 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={() =>
                          setExpandAccordionSender(!expandAccordionSender)
                        }
                      >
                        {renderIconDropDown(expandAccordionSender)}
                      </div>
                    )}
                  </div>

                  {senderBenefit.length > 3 && (
                    <React.Fragment>
                      {accordionDetails(expandAccordionSender, senderBenefit)}
                      {dataReferralInfo?.criteria ||
                      !isEmptyArray(receiverBenefits) ? (
                        <div
                          style={{
                            backgroundColor: "#D6D6D6",
                            alignSelf: "stretch",
                            marginTop: "7px",
                            height: "1px",
                          }}
                        />
                      ) : null}
                    </React.Fragment>
                  )}

                  {senderBenefit.length <= 3 && (
                    <>
                      {senderBenefit?.map((nameSender, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              color: color.primary,
                              textAlign: "center",
                              alignSelf: "start",
                              marginTop: "4px",
                              whiteSpace: "nowrap",
                              font: "500 14px Plus Jakarta Sans, sans-serif ",
                            }}
                          >
                            <ul
                              style={{
                                margin: 0,
                                padding: 0,
                                marginLeft: "21px",
                              }}
                            >
                              <li>{nameSender}</li>
                            </ul>
                          </div>
                        );
                      })}
                      {dataReferralInfo?.criteria ||
                      !isEmptyArray(receiverBenefits) ? (
                        <div
                          style={{
                            backgroundColor: "#D6D6D6",
                            alignSelf: "stretch",
                            marginTop: "7px",
                            height: "1px",
                          }}
                        />
                      ) : null}
                    </>
                  )}
                </React.Fragment>
              )}

              {!isEmptyArray(receiverBenefits) && (
                <>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: !isEmptyArray(senderBenefit) && "8px",
                    }}
                  >
                    <div
                      style={{
                        color: "#000",
                        font: "500 14px Plus Jakarta Sans, sans-serif ",
                      }}
                    >
                      Your referred friend will get
                    </div>
                    {receiverBenefits.length > 3 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          setExpandAccordionReceiver(!expandAccordionReceiver);
                        }}
                      >
                        {renderIconDropDown(expandAccordionReceiver)}
                      </div>
                    )}
                  </div>

                  {receiverBenefits.length > 3 && (
                    <React.Fragment>
                      {accordionDetails(
                        expandAccordionReceiver,
                        receiverBenefits
                      )}
                      {dataReferralInfo?.criteria ||
                      (isEmptyArray(senderBenefit) &&
                      isEmptyArray(receiverBenefits)) ? (
                        <div
                          style={{
                            backgroundColor: "#D6D6D6",
                            alignSelf: "stretch",
                            marginTop: "7px",
                            height: "1px",
                          }}
                        />
                      ) : null}
                    </React.Fragment>
                  )}

                  {receiverBenefits.length <= 3 && (
                    <React.Fragment>
                      {receiverBenefits?.map((rewardMe, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              color: color.primary,
                              alignSelf: "stretch",
                              font: "500 14px Plus Jakarta Sans, sans-serif ",
                            }}
                          >
                            <ul
                              style={{
                                margin: 0,
                                padding: 0,
                                marginLeft: "21px",
                              }}
                            >
                              <li style={{ marginTop: "6px" }}>{rewardMe}</li>
                            </ul>
                          </div>
                        );
                      })}
                      {/* LOL */}
                      {dataReferralInfo?.criteria ||
                      (isEmptyArray(senderBenefit) &&
                        isEmptyArray(receiverBenefits)) ? (
                        <div
                          style={{
                            backgroundColor: "#D6D6D6",
                            alignSelf: "stretch",
                            marginTop: "7px",
                            height: "1px",
                          }}
                        />
                      ) : null}
                    </React.Fragment>
                  )}
                </>
              )}

              {dataReferralInfo?.criteria && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop:
                      (!isEmptyArray(senderBenefit) ||
                        !isEmptyArray(receiverBenefits)) &&
                      "8px",
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
                      lineHeight: "20px",
                    }}
                  >
                    {dataReferralInfo?.criteria}
                  </div>
                </div>
              )}
            </div>
          );
        } else {
          return null;
        }
      };

      const renderTextRichEditor = () => {
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
                fontFamily: "Plus Jakarta Sans, sans-serif",
              }}
              dangerouslySetInnerHTML={{
                __html: handleHTMLStringCustomization(
                  dataReferralInfo?.howItWorks
                ),
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
              position: "relative",
            }}
          >
            {copyRefNo && renderSnackBar()}
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
                {dataReferralInfo?.referral
                  ? dataReferralInfo?.referral
                  : "Loading..."}
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
            </div>
          </div>
        );
      };

      const renderListPeopleInvited = () => {
        if (!isEmptyArray(referralList?.list)) {
          return referralList?.list?.map((itemStatus) => {
            return (
              <div
                key={itemStatus?.id}
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
                    {itemStatus?.status &&
                      itemStatus?.status.split("_").join(" ")}
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
                <div
                  style={{ fontSize: "16px", fontWeight: 700, color: "black" }}
                >
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
                  Start share your referral link or code <br /> to your friend
                  to get bonus
                </div>
              </div>
            </div>
          );
        }
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
              {referralList?.capacity > 0 ? (
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
                  {`${referralList?.dataLength}/${referralList?.capacity} People Invited`}
                </div>
              ) : (
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
                  People Invited
                </div>
              )}

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

      return (
        <LoadingOverlayCustom active={isLoading} spinner text="Please wait...">
          {responsiveDesignComponent()}
        </LoadingOverlayCustom>
      );
    };

export default Referral;
