import React, { useEffect } from "react";
import { withFormik, Form } from "formik";
import * as Yup from "yup";
import { Button, Row, Col } from "reactstrap";
import { CustomTextInput } from "../../../common/GenericInputForm";
import PropTypes from "prop-types";
import Select from "react-select";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    first_name: Yup.string()
      .required("Nom est obligatoire !")
      .min(5, "Minimun 5 de caractères !")
      .max(50, "Nombre de caractères 50 limite dépassé !"),
    last_name: Yup.string()
      .required("Prénom est obligatoire !")
      .min(5, "Minimun 5 de caractères !")
      .max(50, "Nombre de caractères 50 limite dépassé !"),
    username: Yup.string()
      .required("Nom utilisateur est obligatoire !")
      .min(5, "Minimun 5 de caractères !")
      .max(50, "Nombre de caractères 50 limite dépassé !"),
    email: Yup.string()
      .email("Adresse email invalide !")
      .required("Adresse email obligatoire !")
      .max(50, "Nombre de caractères 50 limite dépassé !"),
    phone_number: Yup.number("Format du numero de telephone invalid")
      .required("Le numero de telephone est obligatoire !")
      .min(20000000, "Le numero de telephone invalid  !")
      .max(99999999, "Le numero de telephone invalid  !"),
    currency: Yup.string()
      .required("La devise utilisé est obligatoire !")
      .max(50, "Nombre de caractères 50 limite dépassé !"),
    country: Yup.object().required("Le pays d'origine est obligatoire !"),
  }),
  mapPropsToValues: props => ({
    first_name: props.initialData?.first_name || "",
    last_name: props.initialData?.last_name || "",
    username: props.initialData?.username || "",
    email: props.initialData?.email || "",
    phone_number: props.initialData?.phone_number || "",
    country: props.initialData?.country || "",
    country_id: props.initialData?.country_id || "",
    currency: props.initialData?.currency || "MRU",
  }),
  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    setSubmitting(false);

    values.country_id = values.country?.value || "";
    props.goNextStep(values);
  },
  displayName: "MyForm",
});

const MyForm = props => {
  const countries = [
    {
      value: 1,
      label: "Mauritanie",
    },
    // {
    //   value: 2,
    //   label: "Senegal",
    // },
    // {
    //   value: 3,
    //   label: "France",
    // },
  ];

  useEffect(() => {
    const currentCountrie = countries?.find(
      item => item.id === props.initialData?.country_id
    );

    if (currentCountrie) {
      props.setFieldValue("country", {
        value: currentCountrie.id,
        label: currentCountrie.name_fr,
      });
    }
  }, []);

  return (
    <Form onSubmit={props.handleSubmit} className="px-sm-4 py-sm-4 px-1 py-1">
      <Row>
        <Col md={12} lg={6}>
          <CustomTextInput
            type="text"
            className="form-control"
            name="first_name"
            label="Nom *"
          />
        </Col>
        <Col md={12} lg={6}>
          <CustomTextInput
            type="text"
            className="form-control"
            name="last_name"
            label="Prénom *"
          />
        </Col>
        <Col md={12} lg={6}>
          <CustomTextInput
            type="text"
            className="form-control"
            name="username"
            label="Nom utilsateur *"
          />
        </Col>
        <Col md={12} lg={6}>
          <CustomTextInput
            type="text"
            className="form-control"
            name="email"
            label="Email *"
          />
        </Col>
        <Col md={12} lg={6}>
          <CustomTextInput
            type="number"
            className="form-control"
            name="phone_number"
            label="Téléphone *"
          />
        </Col>

        <Col md={12} lg={6}>
          <CustomTextInput
            type="text"
            className="form-control"
            name="currency"
            label="Devise *"
          />
        </Col>

        <Col lg={12}>
          <div className="mb-2">
            <label htmlFor={"country"}>Pays d&#39;origine *</label>
            <Select
              options={countries}
              placeholder="Sélectionner votre pays d'origine ..."
              name="country"
              onChange={value => props.setFieldValue("country", value)}
              onBlur={() => props.setFieldTouched("country", true)}
              value={props.values.country}
            />
            {props.errors.country && props.touched.country && (
              <div
                style={{ color: "red", marginTop: ".5rem" }}
                className="mb-3"
              >
                {props.errors.country}
              </div>
            )}
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-between">
        <div>
          <Button
            color="secondary"
            className="text-white px-3 py-2 mt-3 d-none"
            disabled={true}
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
  errors: PropTypes.any,
  touched: PropTypes.any,
  errors: PropTypes.any,
  isSubmitting: PropTypes.any,
  //
  goNextStep: PropTypes.func,
  initialData: PropTypes.any,
  submitInLoading: PropTypes.bool,
  values: PropTypes.any,
};

const MyEnhancedForm = formikEnhancer(MyForm);

const FormRegisterClientInfo = props => {
  return <MyEnhancedForm {...props} />;
};

export default FormRegisterClientInfo;
