import React from "react";
import { withFormik, Form } from "formik";
import * as Yup from "yup";
import { CustomTextInput } from "../../../../common/GenericInputForm";
import { Button, Row, Col } from "reactstrap";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import { showAlertMsg } from "../../../../../utils/hoc/Alerts";
import { UPDATE_PROFIL } from "store/auth/login/actionTypes";
import { asyncPost } from "utils/helpers/api_helper";
import { useTranslation } from "react-i18next";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    first_name: Yup.string().required("first name is required !"),
    last_name: Yup.string().required("last name is required !"),
    username: Yup.string().required("username name is required !"),
    email: Yup.string().email().required("email is required ! !"),
  }),
  mapPropsToValues: props => ({
    first_name: props.editData?.first_name || "",
    last_name: props.editData?.last_name || "",
    username: props.editData?.username || "",
    email: props.editData?.email || "",
  }),
  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const payload = {
      ...values,
      user_id: props.editData.id,
    };

    asyncPost("bo/users/edit", payload).then(res => {
      if (res?.data) {
        props.dispatch({
          type: UPDATE_PROFIL,
          payload: res?.data,
        });

        showAlertMsg("success", "Profile updated");
        setSubmitting(false);
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
            type="text"
            className="form-control"
            name="first_name"
            label={"First name"}
            required
          />
          <CustomTextInput
            type="text"
            className="form-control"
            name="last_name"
            label={"Last name"}
            required
          />
        </Col>
        <Col md={12} lg={6}>
          <CustomTextInput
            type="text"
            className="form-control"
            name="username"
            label={"Username"}
            required
          />
          <CustomTextInput
            type="text"
            className="form-control"
            name="email"
            label={"Email"}
            disabled
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
          ...
        </Button>
      ) : (
        <Button
          color="primary"
          className="text-white px-3 py-2 mt-3"
          type="submit"
        >
          Save updates
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
  dispatch: PropTypes.any,
  t: PropTypes.any,
};

const MyEnhancedForm = formikEnhancer(MyForm);

const FormEditProfile = props => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return <MyEnhancedForm t={t} {...props} dispatch={dispatch} />;
};

export default FormEditProfile;
