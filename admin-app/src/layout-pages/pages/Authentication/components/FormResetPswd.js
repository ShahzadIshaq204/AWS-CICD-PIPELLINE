import React from "react";
import { withFormik, Form } from "formik";
import * as Yup from "yup";
import { Button, Col, Row } from "reactstrap";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { asyncPost } from "utils/helpers/api_helper";
import { CustomTextInput } from "layout-pages/common/GenericInputForm";
import { useHistory, useParams } from "react-router-dom";
import { showAlertMsg } from "utils/hoc/Alerts";
import { useTranslation } from "react-i18next";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    password: Yup.string()
      .required("Le mot de passe est obligatoire !")
      .min(8, "Votre mot de passe est trop court , minimum 8 caractères !")
      .max(30, "Nombre de caractères limite dépassé !"),
    password_confirm: Yup.string()
      .required("Le confirmation du mot de passe est obligatoire !")
      .min(8, "Votre mot de passe est trop court , minimum 8 caractères !")
      .oneOf(
        [Yup.ref("password"), null],
        "Le mot de passe doit etre identique !"
      )
      .max(30, "Nombre de caractères limite dépassé !"),
  }),
  mapPropsToValues: props => ({
    password: "",
    password_confirm: "",
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    const payload = { ...values };
    payload.token =
      props.token.split("token=").length == 2
        ? props.token.split("token=")[1]
        : null;

    if (!payload.token) {
      showAlertMsg("warning", props.t("page.common.toaster.invalidToken"));
      setSubmitting(false);
      return;
    }

    asyncPost("reset", payload).then(res => {
      const resKeys = Object.keys(res?.data);
      console.log(res?.data, "response ...");
      if (res?.data && !resKeys.includes("error")) {
        setSubmitting(false);
        showAlertMsg(
          "success",
          props.t("page.common.toaster.psswdUpdateSuccess")
        );
        props.history.push({ pathname: "/login" });
      } else {
        setSubmitting(false);
        showAlertMsg("danger", props.t("page.common.toaster.psswdUpdateError"));
      }
    });
  },
  displayName: "MyForm",
});

const MyForm = props => {
  return (
    <Form onSubmit={props.handleSubmit} className="px-sm-4 py-sm-4 px-1 py-1">
      <Row>
        <Col md={12} lg={12}>
          <CustomTextInput
            type="password"
            className="form-control"
            name="password"
            label={props.t("forms.input.password.label")}
            required
          />
        </Col>
        <Col md={12} lg={12}>
          <CustomTextInput
            type="password"
            className="form-control"
            name="password_confirm"
            label={props.t("forms.input.confirmPassword.label")}
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
          {props.t("page.common.spinner.onLoadingLite")}
        </Button>
      ) : (
        <Button
          color="primary"
          className="text-white px-3 py-2 mt-3"
          type="submit"
        >
          {props.t("page.common.btn.password")}
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

const FormResetPswd = props => {
  const dispatch = useDispatch();
  let { token } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <MyEnhancedForm
      t={t}
      {...props}
      token={token}
      history={history}
      dispatch={dispatch}
    />
  );
};

export default FormResetPswd;
