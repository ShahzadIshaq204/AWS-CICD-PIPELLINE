import React, { useState } from "react";
import MetaTags from "react-meta-tags";
import { Link, useHistory } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Stepper from "react-stepper-horizontal/lib/Stepper";
import FormRegisterClientInfo from "./components/FormRegisterClientInfo";
import FormRegisterIdentification from "./components/FormRegisterIdentification";
import FormRegisterPswd from "./components/FormRegisterPswd";
import { asyncPost } from "utils/helpers/api_helper";
import { showAlertMsg } from "utils/hoc/Alerts";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [submitInLoading, setSubmitInLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    country: "",
    country_id: "",
    currency: "",
    //
    nni: "",
    card_identity_recto: "",
    card_identity_verso: "",
    passport_photo: "",
    //
    password: "",
    password_confirm: "",
  });
  const history = useHistory();

  const goNextStep = updatedData => {
    if (currentStepIdx + 1 < steps.length) {
      setCurrentStepIdx(currentStepIdx + 1);
      setFormValues({ ...formValues, ...updatedData });
    }

    // is Last step
    if (currentStepIdx + 1 === steps.length) {
      setSubmitInLoading(true);
      const payload = { ...formValues, ...updatedData };
      setFormValues({ ...formValues, ...payload });

      /* form data */
      const formData = new FormData();
      formData.append("first_name", payload.first_name);
      formData.append("last_name", payload.last_name);
      formData.append("username", payload.username);
      formData.append("email", payload.email);
      formData.append("phone_number", payload.phone_number);
      formData.append("country_id", payload.country_id);
      formData.append("currency", payload.currency);
      formData.append("nni", payload.nni);
      formData.append("card_identity_recto", payload.card_identity_recto);
      formData.append("card_identity_verso", payload.card_identity_verso);
      formData.append("passport_photo", payload.passport_photo);
      formData.append("password", payload.password);
      formData.append("password_confirm", payload.password_confirm);

      asyncPost("register", formData, {
        "Content-Type": "multipart/form-data",
      }).then(res => {
        console.log(res?.data);
        if (res?.data?.success) {
          setSubmitInLoading(false);
          showAlertMsg("success", t("page.common.toaster.success"));

          // history.push({
          //   pathname: "/login",
          //   state: {
          //     registerData: {
          //       email: payload.email,
          //       name: `${payload.first_name} ${payload.last_name}`,
          //     },
          //   },
          // });

          history.push({
            pathname: "/mail/send",
            state: {
              email: payload.email,
            },
          });
        } else {
          setSubmitInLoading(false);
          showAlertMsg("danger", t("page.common.toaster.error"));
        }
      });
    }
  };

  const goPrevStep = updatedData => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
      setFormValues({ ...formValues, ...updatedData });
    }
  };

  const steps = [
    <FormRegisterClientInfo
      key={0}
      initialData={formValues}
      goNextStep={goNextStep}
      submitInLoading={submitInLoading}
    />,
    <FormRegisterIdentification
      key={1}
      initialData={formValues}
      goNextStep={goNextStep}
      goPrevStep={goPrevStep}
      submitInLoading={submitInLoading}
    />,
    <FormRegisterPswd
      key={2}
      initialData={formValues}
      goNextStep={goNextStep}
      goPrevStep={goPrevStep}
      submitInLoading={submitInLoading}
    />,
  ];

  return (
    <>
      <MetaTags>
        <title>{t("page.register.pageTitle")}</title>
      </MetaTags>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={12} lg={10} xl={8}>
              <Card className="overflow-hidden">
                <div className="bg-warning bg-soft">
                  <Row>
                    <Col className="col-7">
                      <div className="text-gray p-4">
                        <h5 className="text-gray">
                          {t("page.register.freeAccount")}
                        </h5>
                        <p>{t("page.register.getYourAccount")}</p>
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div className="mb-4">
                    <Stepper
                      steps={[
                        { title: t("page.register.personalInfo") },
                        { title: t("page.register.identity") },
                        { title: t("page.register.password") },
                      ]}
                      activeStep={currentStepIdx}
                      activeColor="#F1B44C"
                      completeColor="#F1B44C"
                      activeTitleColor="#212529"
                      completeTitleColor="#212529"
                    />
                  </div>

                  <div className="py-2 px-4">{steps[currentStepIdx]}</div>

                  {/* <pre>{JSON.stringify(formValues, null, 2)}</pre> */}
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  {t("page.register.AlreadyHaveAccount")}{" "}
                  <Link to="/login" className="font-weight-medium text-warning">
                    {t("page.register.login")}
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Register;
