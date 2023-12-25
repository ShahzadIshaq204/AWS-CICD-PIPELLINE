import React from "react";
import { withFormik, Form } from "formik";
import * as Yup from "yup";
import { Button, Row, Col } from "reactstrap";
import { CustomTextInput } from "../../../common/GenericInputForm";
import { useQueryClient } from "react-query";
import PropTypes from "prop-types";
import { asyncPost } from "utils/helpers/api_helper";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { showAlertMsg } from "../../../../utils/hoc/Alerts";
import { reactQueryCacheCleaner } from "utils/hooks/useCrudQuery";
import { useTranslation } from "react-i18next";
import Select from "react-select";

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    username: Yup.string().required("username is required !"),
    firstname: Yup.string().required("first name is required !"),
    lastname: Yup.string().required("last name is required !"),
    email: Yup.string().email().required("email is required !"),
    role: Yup.object().required("role is required !"),
    password: Yup.string()
      .required("password is required !")
      .min(8, "password too short, at least 8 characters!"),
    confirm_password: Yup.string()
      .required("confirm password is required !")
      .min(8, "confirm password too short, at least 8 characters !")
      .oneOf([Yup.ref("password"), null], "password must be the same !"),
  }),
  mapPropsToValues: props => ({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    password: "",
    confirm_password: "",
  }),
  handleSubmit: (values, { props, setSubmitting, resetForm }) => {
    const payload = { ...values };
    payload.group_id = payload.role?.value;

    asyncPost("bo/users", payload).then(res => {
      if (res) {
        setSubmitting(false);
        resetForm();
        showAlertMsg("success", "Account created !");

        reactQueryCacheCleaner({
          queryClient: props.queryClient,
          resetKeys: ["@query-users"],
          invalidateKeys: [],
        });
        // todo reset pagination

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
            name="firstname"
            label="First name *"
          />
          <CustomTextInput
            type="text"
            className="form-control"
            name="lastname"
            label="Last name *"
          />

          <CustomTextInput
            type="password"
            className="form-control"
            name="password"
            label="Password *"
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
          <CustomTextInput
            type="password"
            className="form-control"
            name="confirm_password"
            label="Confirm password *"
          />
        </Col>

        <Col lg={12}>
          <div className="mb-3">
            <label htmlFor={"role"}>Role *</label>
            <Select
              options={
                [
                  { id: 1, label: "Admin" },
                  { id: 3, label: "Project Manager" },
                ].map(item => {
                  return {
                    value: item.id,
                    label: item.label,
                  };
                }) || []
              }
              name="role"
              placeholder="Select user role"
              onBlur={() => props.setFieldTouched("role", true)}
              onChange={value => props.setFieldValue("role", value)}
            />
            {props.errors.role && props.touched.role && (
              <div
                style={{ color: "red", marginTop: ".5rem" }}
                className="mb-3"
              >
                {props.errors.role}
              </div>
            )}
          </div>
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
          type="submit"
          color="primary"
          className="text-white px-3 py-2 mt-3"
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
  fromShopPage: PropTypes.bool,
  closeModal: PropTypes.func,
};

const MyEnhancedForm = formikEnhancer(MyForm);

const FormAddUser = props => {
  const queryClient = useQueryClient();
  const user = useSelector(state => state.Login.user);
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <MyEnhancedForm
      t={t}
      {...props}
      queryClient={queryClient}
      history={history}
      user={user}
    />
  );
};

export default FormAddUser;
