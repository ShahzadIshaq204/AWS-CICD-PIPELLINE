import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, Input, Card, CardBody, Col, Container, Row } from "reactstrap";
import { asyncPost } from "utils/helpers/api_helper";
import { showAlertMsg } from "utils/hoc/Alerts";

export default function MailResend() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(state => state.Login.user);
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) history.push("/login");
  }, []);

  const sendMailVerify = () => {
    setIsLoading(true);
    asyncPost("user/resend", { email }, {}).then(res => {
      console.log(res?.data);
      if (res?.data && res?.data?.status != 400) {
        setIsLoading(false);
        showAlertMsg(
          "success",
          res?.data?.message || t("page.common.toaster.success")
        );
        history.push({
          pathname: "/mail/send",
          state: { email },
        });
      } else {
        setIsLoading(false);
        showAlertMsg(
          "danger",
          res?.data?.message || t("page.common.toaster.error")
        );
      }
    });
  };

  return (
    <div>
      <div className="account-pages my-5 pt-sm-5">
        <MetaTags>
          <title>{t("page.resendMail.title")}</title>
        </MetaTags>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={6}>
              <Card>
                <CardBody>
                  <div className="p-2">
                    <div className="text-center">
                      <div className="avatar-md mx-auto">
                        <div className="avatar-title rounded-circle bg-light">
                          <i
                            className={`bx bx-mail-send h1 mb-0 text-warning`}
                          ></i>
                        </div>
                      </div>
                      <div className="p-2 mt-4">
                        <h4>{t("page.resendMail.heading")}</h4>

                        <div className="d-flex items-center justify-content-between my-3">
                          {/* todo add mail validation */}
                          <Input
                            className="form-control"
                            name="email"
                            type="email"
                            placeholder={t("forms.input.email.placeholder")}
                            disabled={isLoading}
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                          />

                          <Button
                            className="w-sm mx-3"
                            color="success"
                            type="submit"
                            disabled={email.trim() === "" || isLoading}
                            onClick={() => sendMailVerify()}
                          >
                            {isLoading
                              ? t("page.common.spinner.onLoadingLite")
                              : t("page.common.btn.send")}
                          </Button>
                        </div>
                        <div className="mt-4">
                          <Link to="/login" className={`btn btn-warning`}>
                            {t("page.common.btn.homePage")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
