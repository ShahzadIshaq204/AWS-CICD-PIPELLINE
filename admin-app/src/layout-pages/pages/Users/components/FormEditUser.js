import React from "react";
import { withFormik, Form } from "formik";
import * as Yup from "yup";
import { Button, Row, Col } from "reactstrap";
import { CustomTextInput } from "../../../common/GenericInputForm";
import { useQueryClient } from "react-query";
import PropTypes from "prop-types";
import { asyncPost } from "utils/helpers/api_helper";
import { useHistory } from "react-router-dom";
import { showAlertMsg } from "../../../../utils/hoc/Alerts";
import { reactQueryCacheCleaner } from "utils/hooks/useCrudQuery";
import { useTranslation } from "react-i18next";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    username: Yup.string().required("username is required !"),
    first_name: Yup.string().required("first name is required !"),
    last_name: Yup.string().required("last name is required !"),
    email: Yup.string().email().required("email is required !"),
    // role: Yup.object().required("role is required !"),
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
      if (res) {
        setSubmitting(false);
        resetForm();
        showAlertMsg("success", "Account updated !");

        reactQueryCacheCleaner({
          queryClient: props.queryClient,
          resetKeys: ["@query-users"],
          invalidateKeys: [],
        });
        props.closeModal();
      } else {
        showAlertMsg("danger", "Something went wrong!");
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
            label="First name *"
          />
          <CustomTextInput
            type="text"
            className="form-control"
            name="last_name"
            label="Last name *"
          />
        </Col>
        <Col md={12} lg={6}>
          <CustomTextInput
            type="email"
            className="form-control"
            name="email"
            label="Email *"
          />
          <CustomTextInput
            type="text"
            className="form-control"
            name="username"
            label="Username *"
          />
        </Col>
      </Row>
      {props.isSubmitting ? (
        <Button
          type="submit"
          color="primary"
          disabled={props.isSubmitting}
          className="text-white px-3 py-2 mt-3"
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
};

const MyEnhancedForm = formikEnhancer(MyForm);

const FormEditUser = props => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <MyEnhancedForm
      t={t}
      {...props}
      queryClient={queryClient}
      history={history}
    />
  );
};

export default FormEditUser;
