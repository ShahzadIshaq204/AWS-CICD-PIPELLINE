import React from "react";
import { withFormik, Form } from "formik";
import * as Yup from "yup";
import { Button, Col, Row } from "reactstrap";
import { CustomTextInput } from "../../../../common/GenericInputForm";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { asyncPost } from "utils/helpers/api_helper";
import { showAlertMsg } from "../../../../../utils/hoc/Alerts";
import { useTranslation } from "react-i18next";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    password: Yup.string()
      .required("password is required !")
      .min(8, "password too short, at least 8 characters!"),
    confirm_password: Yup.string()
      .required("confirm password is required !")
      .min(8, "confirm password too short, at least 8 characters !")
      .oneOf([Yup.ref("password"), null], "password must be the same !"),
  }),
  mapPropsToValues: props => ({
    password: "",
    confirm_password: "",
  }),
  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const payload = {
      ...values,
      user_id: props.editData.id,
    };

    asyncPost("bo/password/update", payload).then(res => {
      if (res) {
        showAlertMsg("success", "Password updated !");
        setSubmitting(false);
        resetForm();
      } else {
        showAlertMsg("danger", " Something went wrong!");
        setSubmitting(false);
      }
    });
  },
  displayName: "MyForm",
});

const MyForm = props => {
  return (
    <Form onSubmit={props.handleSubmit} className="px-sm-4 py-sm-4 px-1 py-1">
      <Row>
        <Col md={12} lg={6}>
          <CustomTextInput
            type="password"
            className="form-control"
            name="password"
            label={"Password"}
            required
          />
        </Col>
        <Col md={12} lg={6}>
          <CustomTextInput
            type="password"
            className="form-control"
            name="confirm_password"
            label={"Confirm Password"}
            required
          />
        </Col>
      </Row>

      {props.isSubmitting ? (
        <Button
          color="primary"
          disabled={props.isSubmitting}
          className="text-white px-3 py-2 mt-3"
          type="submit"
        >
          {/* {props.t("page.common.spinner.onLoadingLite")} */}
          ...
        </Button>
      ) : (
        <Button
          color="danger"
          className="text-white px-3 py-2 mt-3"
          type="submit"
        >
          Update password
        </Button>
      )}
    </Form>
  );
};

MyForm.propTypes = {
  handleSubmit: PropTypes.any,
  setFieldValue: PropTypes.any,
  setFieldTouched: PropTypes.any,
  errors: PropTypes.any,
  touched: PropTypes.any,
  errors: PropTypes.any,
  isSubmitting: PropTypes.any,
  t: PropTypes.any,
};

const MyEnhancedForm = formikEnhancer(MyForm);

const FormEditPswd = props => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return <MyEnhancedForm t={t} {...props} dispatch={dispatch} />;
};

export default FormEditPswd;
