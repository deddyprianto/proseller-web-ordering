import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import moment from "moment";
import Field from "./Field";

const CustomFields = ({ fields, handleChange, showSignUpFields }) => {
  const fieldsToRender = fields.filter((field) => {
    return showSignUpFields ? field.signUpField === true : true;
  });

  const [value, setValue] = useState({});

  const handleValueChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    handleChange(e.target.name, e.target.value);
  };

  useEffect(() => {
    handleChange("address", `${value.street}, ${value.unitNo}`);
  }, [value]);

  return (
    <div>
      {fieldsToRender.map((field) => {
        if (field.type === "multipleField") {
          return field.children.map((child) => (
            <Field
              handleValueChange={handleValueChange}
              value={value}
              field={child}
            ></Field>
          ));
        }
        return (
          <Field
            handleValueChange={handleValueChange}
            value={value}
            field={field}
          ></Field>
        );
      })}
    </div>
  );
};

CustomFields.propTypes = {
  fields: PropTypes.array,
};

CustomFields.defaultProps = {
  showSignUpFields: false,
};

export default CustomFields;
