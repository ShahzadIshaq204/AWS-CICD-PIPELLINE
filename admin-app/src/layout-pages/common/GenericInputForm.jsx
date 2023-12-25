import React from "react";
import { useField } from "formik";
import { FormGroup, Input, Label } from "reactstrap";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

export const CustomTextInput = ({ ...props }) => {
  const [field, meta] = useField(props);
  const { t } = useTranslation();
  return (
    <>
      <FormGroup className="mb-3">
        {props.label && (
          <Label htmlFor={props.id || props.name}>
            {t(props.label)} {props?.required && "*"}
          </Label>
        )}
        <Input {...field} {...props} className="form-control" />
        {meta.error && meta.touched && (
          <div style={{ color: "red", marginTop: ".5rem" }}>{meta.error}</div>
        )}
      </FormGroup>
    </>
  );
};

CustomTextInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.any, // optional
};

export const CustomTextArea = ({ ...props }) => {
  const [field, meta] = useField(props);
  const { t } = useTranslation();
  return (
    <>
      <FormGroup className="mb-3">
        {props.label && (
          <Label htmlFor={props.id || props.name}>
            {t(props.label)} {props?.required && "*"}
          </Label>
        )}
        <textarea {...field} {...props} className="form-control" />
        {meta.error && meta.touched && (
          <div style={{ color: "red", marginTop: ".5rem" }}>{meta.error}</div>
        )}
      </FormGroup>
    </>
  );
};

CustomTextArea.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.any, // optional
};

CustomTextArea.defaultProps = {
  rows: 5,
};
