import React, { useState } from "react";
import { connect } from "react-redux";

export const Variant = ({ options, variants }) => {
  const [selectedVariant, setSelectedVariant] = useState({});

  const setVariant = (name, value) => {
    setSelectedVariant({
      ...selectedVariant,
      [name]: value,
    });
  };
  return (
    <div>
      {options.map((option) => {
        return (
          <div className="card card-modifier">
            <div
              onClick={() => {}}
              className="card-header header-modifier"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <p className="color" style={{ margin: 0 }}>
                <b>{option.optionName} </b>
              </p>
              <i
                className="fa fa-chevron-up color"
                style={{ fontSize: 16 }}
              ></i>
            </div>
            {true ? (
              <div style={{ marginLeft: 5, marginRight: 10 }}>
                {option.options.map((item) => (
                  <div
                    className="item-modifier"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingBottom: 15,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      className="title-modifier"
                      onClick={() => {
                        setVariant(option.optionName, item);
                      }}
                    >
                      <div>
                        {selectedVariant[option.optionName] === item ? (
                          <div
                            style={{
                              border: "1px solid gray",
                              width: 20,
                              height: 20,
                              borderRadius: 50,
                              marginLeft: 3,
                              padding: 2,
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                            }}
                          >
                            <div
                              style={{
                                backgroundColor: "#3498db",
                                width: 10,
                                height: 10,
                                borderRadius: 50,
                              }}
                            ></div>
                          </div>
                        ) : (
                          <div
                            style={{
                              border: "1px solid gray",
                              width: 20,
                              height: 20,
                              borderRadius: 50,
                              marginLeft: 3,
                            }}
                          ></div>
                        )}
                      </div>

                      <div
                        className="subtitle-modifier"
                        style={{ lineHeight: "20px", marginRight: 10 }}
                      >
                        {item}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Variant);
