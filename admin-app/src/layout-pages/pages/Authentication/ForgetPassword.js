import React from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import profile from "../../../assets/images/profile-img.png";
import { useState } from "react";
import { showAlertMsg } from "utils/hoc/Alerts";
import { asyncPost } from "utils/helpers/api_helper";
import { useTranslation } from "react-i18next";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { t } = useTranslation();

  const handleSubmit = e => {
    e.preventDefault();
    if (!email) {
      showAlertMsg("warning", t("page.common.toaster.fillMailAddress"));
      return;
    }

    setLoading(true);
    asyncPost("forgot", { email }).then(res => {
      console.log(res?.data, "response ...");
      const resKeys = Object.keys(res?.data || {});
      if (res?.data && !resKeys.includes("error")) {
        setLoading(false);
        showAlertMsg("success", res?.data?.message);
      } else {
        setLoading(false);
        showAlertMsg("danger", t("page.common.toaster.mailNotSend"));
      }
    });
  };

  return (
    <>
      <MetaTags>
        <title>{t("page.forgetPassword.title")}</title>
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
                        <p>{t("page.forgetPassword.heading")}</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>

                <CardBody className="pt-0">
                  <div className="px-2 py-4">
                    <form
                      className="form-horizontal"
                      onSubmit={e => handleSubmit(e)}
                    >
                      <div className="mb-3">
                        <label>{t("forms.input.email.label")}</label>
                        <input
                          className="form-control"
                          placeholder={t("forms.input.email.placeholder")}
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="mt-3 d-grid">
                        <button
                          type="submit"
                          className="btn btn-warning btn-block"
                          disabled={loading || !email}
                        >
                          {loading ? (
                            <>
                              <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                              {t("page.common.spinner.onLoadingLite")}
                            </>
                          ) : (
                            t("page.common.btn.sendMail")
                          )}
                        </button>
                      </div>

                      <div className="mt-4 text-center">
                        <Link to="/login" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          {t("page.common.btn.login")}
                        </Link>
                      </div>
                    </form>
                  </div>
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

export default ForgetPassword;
