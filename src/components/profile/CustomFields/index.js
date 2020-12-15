import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Col, Row } from "reactstrap";
import Field from "./Field";

const CustomFields = ({
  fields,
  handleChange,
  showSignUpFields,
  defaultValue,
  defaultError,
  roundedBorder,
  titleEditAccount,
  touched,
}) => {
  const fieldsToRender =
    fields &&
    fields.filter((field) => {
      return showSignUpFields ? field.signUpField === true : true;
    });

  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    handleChange(e.target.name, e.target.value);
  };

  useEffect(() => {
    handleChange("address", `${value.street}, ${value.unitNo}`);
  }, [value]);

  return (
    <Row>
      {fieldsToRender &&
        fieldsToRender.map((field, keys) => {
          if (field.type === "multipleField") {
            return (
              <Col key={keys} sm={6}>
                <Row>
                  {field.children.map((child, key) => (
                    <Col key={key} sm={6}>
                      <Field
                        handleValueChange={handleValueChange}
                        value={value}
                        field={{ ...child, mandatory: field.mandatory }}
                        roundedBorder={roundedBorder}
                        error={defaultError}
                        touched={touched}
                      ></Field>
                    </Col>
                  ))}
                </Row>
              </Col>
            );
          }
          return (
            <Col key={keys} sm={6}>
              <Field
                handleValueChange={handleValueChange}
                value={value}
                field={field}
                roundedBorder={roundedBorder}
                error={defaultError}
                titleEditAccount={titleEditAccount}
                touched={touched}
              ></Field>
            </Col>
          );
        })}
    </Row>
  );
};

CustomFields.propTypes = {
  fields: PropTypes.array,
  showSignUpFields: PropTypes.bool.isRequired,
  defaultValue: PropTypes.object.isRequired,
  roundedBorder: PropTypes.bool.isRequired,
};

CustomFields.defaultProps = {
  showSignUpFields: false,
  defaultValue: {},
  roundedBorder: true,
};

export default CustomFields;
