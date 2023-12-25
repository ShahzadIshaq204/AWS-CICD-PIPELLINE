import React from "react";
import { withFormik, Form } from "formik";
import * as Yup from "yup";
import { Button, Row, Col } from "reactstrap";
import { CustomTextInput } from "../../../common/GenericInputForm";
import PropTypes from "prop-types";
import CustomDropzone from "layout-pages/common/CustomDropzone";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    nni: Yup.string()
      .required("NNI est obligatoire !")
      .min(10, "Minimun 10 caractères !")
      .max(10, "Nombre de caractères 10 limite dépassé !"),
  }),
  mapPropsToValues: props => ({
    nni: props.initialData?.nni || "",
    card_identity_recto: "", //props.initialData?.card_identity_recto || "",
    card_identity_verso: "", //props.initialData?.card_identity_verso || "",
    passport_photo: "", //props.initialData?.passport_photo || "",
  }),
  handleSubmit: (values, { props, setSubmitting, setFieldError }) => {
    setSubmitting(false);
    if (props.initialData?.country_id === 1) {
      // centralise this condition somewhere
      if (values.card_identity_recto === "") {
        setFieldError(
          "card_identity_recto",
          "La photo recto de la piece d'identité est obligatoire !"
        );
      } else if (values.card_identity_verso === "") {
        setFieldError(
          "card_identity_verso",
          "La photo verso de la piece d'identité est obligatoire !"
        );
      } else {
        props.goNextStep(values);
      }
    } else {
      if (values.passport_photo === "") {
        setFieldError(
          "passport_photo",
          "La photo du passeport est obligatoire !"
        );
      } else {
        props.goNextStep(values);
      }
    }
  },
  displayName: "MyForm",
});

const MyForm = props => {
  return (
    <Form onSubmit={props.handleSubmit} className="px-sm-4 py-sm-4 px-1 py-1">
      <Row>
        <Col lg={12} className="mb-3">
          <CustomTextInput
            type="text"
            className="form-control"
            name="nni"
            label={
              props.initialData?.country_id === 1 // centralise this condition somewhere
                ? "NNI *"
                : "Numéro de passeport *"
            }
          />
        </Col>

        {props.initialData?.country_id === 1 ? (
          <>
            <Col md={12} lg={6}>
              <div className="mb-3">
                <label htmlFor="card_identity_recto">
                  Piéce d&#39;identité recto *
                </label>
                <CustomDropzone
                  accept="image/*"
                  multiple={false}
                  maxSize={7000000}
                  maxFiles={20}
                  placeholder="Ajouter un image recto de la piece d'identité"
                  thumbSize={200}
                  //
                  valueName="card_identity_recto"
                  setFieldValue={props.setFieldValue}
                />
                {props.errors.card_identity_recto &&
                  props.touched.card_identity_recto && (
                    <div style={{ color: "red", marginTop: ".5rem" }}>
                      {props.errors.card_identity_recto}
                    </div>
                  )}
              </div>
            </Col>
            <Col md={12} lg={6}>
              <div className="mb-3">
                <label htmlFor="card_identity_verso">
                  Piéce d&#39;identité verso *
                </label>
                <CustomDropzone
                  accept="image/*"
                  multiple={false}
                  maxSize={7000000}
                  maxFiles={20}
                  placeholder="Ajouter un image verso de la piece d'identité"
                  thumbSize={200}
                  //
                  valueName="card_identity_verso"
                  setFieldValue={props.setFieldValue}
                />
                {props.errors.card_identity_verso &&
                  props.touched.card_identity_verso && (
                    <div style={{ color: "red", marginTop: ".5rem" }}>
                      {props.errors.card_identity_verso}
                    </div>
                  )}
              </div>
            </Col>
          </>
        ) : (
          <Col lg={12}>
            <div className="mb-3">
              <label htmlFor="passport_photo">Photo du passeport *</label>
              <CustomDropzone
                accept="image/*"
                multiple={false}
                maxSize={7000000}
                maxFiles={20}
                placeholder="Ajouter un image de votre passeport"
                thumbSize={200}
                //
                valueName="passport_photo"
                setFieldValue={props.setFieldValue}
              />
              {props.errors.passport_photo && props.touched.passport_photo && (
                <div style={{ color: "red", marginTop: ".5rem" }}>
                  {props.errors.passport_photo}
                </div>
              )}
            </div>
          </Col>
        )}
      </Row>

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

const FormRegisterIdentification = props => {
  return <MyEnhancedForm {...props} />;
};

export default FormRegisterIdentification;
