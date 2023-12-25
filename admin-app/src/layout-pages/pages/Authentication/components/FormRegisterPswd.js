import React, { useState } from "react";
import { withFormik, Form } from "formik";
import * as Yup from "yup";
import { Button, Row, Col } from "reactstrap";
import { CustomTextInput } from "../../../common/GenericInputForm";
import PropTypes from "prop-types";
import ReCAPTCHA from "react-google-recaptcha";

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
  handleSubmit: (values, { props, setSubmitting, setFieldError }) => {
    setSubmitting(false);
    props.goNextStep(values);
  },
  displayName: "MyForm",
});

const MyForm = props => {
  const [validCaptcha, setValidCaptcha] = useState(false);

  return (
    <Form onSubmit={props.handleSubmit} className="px-sm-4 py-sm-4 px-1 py-1">
      <Row>
        <Col md={12} lg={12}>
          <CustomTextInput
            type="password"
            className="form-control"
            name="password"
            label="Mot de passe *"
          />
        </Col>
        <Col md={12} lg={12}>
          <CustomTextInput
            type="password"
            className="form-control"
            name="password_confirm"
            label="Confirmation du mot de passe *"
          />
        </Col>
      </Row>

      <div className="d-flex justify-content-center">
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_CAPTCHA_KEY}
          onChange={key => setValidCaptcha(true)}
          onErrored={err => console.log(err)}
        />
      </div>

      <div className="d-flex justify-content-between">
        <div>
          <Button
            color="secondary"
            className="text-white px-3 py-2 mt-3"
            disabled={props.submitInLoading}
            onClick={e => {
              e.preventDefault();
              props.goPrevStep(props.values);
            }}
          >
            Précédent
          </Button>
        </div>

        {validCaptcha && (
          <div className="ml-auto">
            <Button
              color="warning"
              className="text-white px-3 py-2 mt-3"
              type="submit"
              disabled={props.submitInLoading}
            >
              {props.submitInLoading ? "En cours ..." : "Suivant"}
            </Button>
          </div>
        )}
      </div>
    </Form>
  );
};

MyForm.propTypes = {
  handleSubmit: PropTypes.any,
  setFieldValue: PropTypes.any,
  setFieldTouched: PropTypes.any,
  setFieldError: PropTypes.any,
  errors: PropTypes.any,
  touched: PropTypes.any,
  errors: PropTypes.any,
  isSubmitting: PropTypes.any,
  //
  goNextStep: PropTypes.func,
  goPrevStep: PropTypes.func,
  submitInLoading: PropTypes.bool,
  values: PropTypes.any,
  initialData: PropTypes.any,
};

const MyEnhancedForm = formikEnhancer(MyForm);

const FormRegisterPswd = props => {
  return <MyEnhancedForm {...props} />;
};

export default FormRegisterPswd;
