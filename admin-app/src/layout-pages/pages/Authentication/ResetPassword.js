import React from "react";
import { useTranslation } from "react-i18next";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import profile from "../../../assets/images/profile-img.png";
import FormResetPswd from "./components/FormResetPswd";

const ResetPassword = () => {
  const { t } = useTranslation();
  return (
    <>
      <MetaTags>
        <title>{t("page.resetPassword.title")}</title>
      </MetaTags>
      <div className="home-btn d-none d-sm-block">
        <Link to="#" className="text-dark">
          <i className="fas fa-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={6}>
              <Card className="overflow-hidden">
                <div className="bg-warning bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-gray p-4">
                        <h5 className="text-gray">{t("page.login.welcome")}</h5>
                        <p>{t("page.resetPassword.heading")}</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <FormResetPswd />
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  {t("page.login.HaveNotAccount")}{" "}
                  <Link to="/register" className="fw-medium text-warning">
                    {t("page.login.register")}
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

export default ResetPassword;
