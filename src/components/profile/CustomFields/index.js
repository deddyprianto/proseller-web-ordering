import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import Field from './Field';
import { useDispatch } from 'react-redux';

const CustomFields = ({
  fields,
  handleChange,
  showSignUpFields,
  defaultValue,
  defaultError,
  roundedBorder,
  titleEditAccount,
  touched,
  dataCustomer,
}) => {
  const dispatch = useDispatch();
  const fieldsToRender =
    fields &&
    fields.filter((field) => {
      return showSignUpFields ? field.signUpField === true : true;
    });

  useEffect(() => {
    dispatch({ type: 'IS_CUSTOM_FIELD_HAVE_VALUE', data: fieldsToRender });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
    handleChange(e.target.name, e.target.value);
  };

  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      handleChange('address', `${value.street}, ${value.unitNo}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Row>
      {fieldsToRender &&
        fieldsToRender.map((field, keys) => {
          if (field.type === 'multipleField') {
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
                        dataCustomer={dataCustomer}
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
                dataCustomer={dataCustomer}
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
