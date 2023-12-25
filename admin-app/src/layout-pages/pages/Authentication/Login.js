import profile from "assets/images/profile-img.png";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import MetaTags from "react-meta-tags";
import { Link, withRouter, Redirect } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Alert, Card, CardBody, Col, Container, Row } from "reactstrap";
import { connect } from "react-redux";
import { login } from "store/actions";
import InputErrorMessage from "../../common/InputErrorMessage";
import { emailPattern } from "utils/constants/regularExpressions";
import { showAlertMsg } from "utils/hoc/Alerts";
import CustomModal from "layout-pages/common/CustomModal";
import { Trans, useTranslation } from "react-i18next";
// import ReCAPTCHA from "react-google-recaptcha";

const Login = ({ isAuthenticated, isLoading, login, isError }) => {
  const { t } = useTranslation();
  let location = useLocation();
  const newUserRegistred = location.state?.registerData;
  let { from } = location.state || { from: { pathname: "/" } };

  const [loading, setLoading] = useState(false);
  // const [validCaptcha, setValidCaptcha] = useState(false);
  const [showRegisteredModal, setShowRegisteredModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: newUserRegistred
        ? newUserRegistred.email
        : "demba94diagana@gmail.com",
      password: newUserRegistred ? "" : "12345678",
    },
  });
  useEffect(() => {
    if (newUserRegistred) setShowRegisteredModal(true);
  }, []);

  const onSubmit = data => {
    let errorMsg = t("page.common.toaster.loginFailed");
    setLoading(true);
    login(data, setLoading, showAlertMsg, errorMsg);
  };

  return <></>;

  if (isAuthenticated) return <Redirect exact to={from} />;

  return (
    <>
      <CustomModal
        title={t("page.login.newAccount.title")}
        isOpen={showRegisteredModal}
        toggle={() => {
          setShowRegisteredModal(!showRegisteredModal);
        }}
        size="md"
        closeText={t("page.common.customModal.closeBtn")}
        closeBtnColor="primary"
        content={
          <>
            <div className="m-3">
              <p className="text-center">
                <Trans i18nKey="page.login.newAccount.content">
                  {{ newUserRegistred: newUserRegistred?.name }}
                </Trans>
              </p>
            </div>
          </>
        }
      />
      <MetaTags>
        <title>{t("page.login.login")}</title>
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
                        <p>{t("page.login.startNow")}</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>

                {location.state?.emailVerified && (
                  <Alert
                    color="success"
                    className="mx-4 mb-0 mt-3 d-flex align-items-center"
                  >
                    <i
                      className={`bx bx-check-circle h4 mb-0 text-success`}
                    ></i>
                    <span style={{ paddingLeft: "10px" }}>
                      {t("page.login.emailValidation.congrat")}
                    </span>
                  </Alert>
                )}

                <CardBody className="pt-0">
                  <div className="px-2 py-4">
                    <form
                      className="form-horizontal"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      {/* {isError ? (
                        <Alert color="danger">
                          Une erreur s&#39;est produite
                        </Alert>
                      ) : null} */}
                      <div className="mb-3">
                        <label>{t("forms.input.email.label")}</label>
                        <input
                          className="form-control"
                          placeholder={t("forms.input.email.placeholder")}
                          type="text"
                          {...register("email", {
                            required: t("forms.validation.email.required"),
                            pattern: {
                              value: emailPattern,
                              message: t("forms.validation.email.error"),
                            },
                          })}
                        />
                        <InputErrorMessage errors={errors} name="email" />
                      </div>
                      <div className="mb-3">
                        <label>{t("forms.input.password.label")}</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder={t("forms.input.password.placeholder")}
                          {...register("password", {
                            required: t("forms.validation.password.required"),
                          })}
                        />
                        <InputErrorMessage errors={errors} name="password" />
                      </div>

                      {/* <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="customControlInline"
                        >
                          Souviens moi
                        </label>
                      </div> */}

                      {/* <div className="d-flex justify-content-center">
                        <ReCAPTCHA
                          sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                          onChange={key => setValidCaptcha(true)}
                          onErrored={err => console.log(err)}
                        /> 
                      </div> */}

                      {/* {validCaptcha && ( */}
                      <div className="mt-3 d-grid">
                        <button
                          type="submit"
                          className="btn btn-warning btn-block"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                              {t("page.common.spinner.onLoadingLite")}
                            </>
                          ) : (
                            <>{t("page.login.login")}</>
                          )}
                        </button>
                      </div>
                      {/* )} */}
                      <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          {t("page.login.forgetPassword")}
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

const mapStateToProps = state => ({
  isAuthenticated: state.Login.isAuthenticated,
  isError: state.Login.isError,
});

Login.propTypes = {
  history: PropTypes.object,
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  login: PropTypes.func,
};

export default connect(mapStateToProps, { login })(withRouter(Login));
