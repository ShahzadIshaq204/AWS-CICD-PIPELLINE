import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import { asyncPost } from "utils/helpers/api_helper";
import ValidationMailStatus from "./components/ValidationMailStatus";

export default function MailVerify() {
  let { token } = useParams();
  const { t } = useTranslation();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [errorVerifyMail, setErrorVerifyMail] = useState(false);
  const user = useSelector(state => state.Login.user);

  useEffect(() => {
    if (user) history.push("/login");
  }, []);

  const verifyMail = useCallback(() => {
    setIsLoading(true);
    asyncPost("user/verify/" + token, {}, {}).then(res => {
      console.log(res?.data);
      if (res?.data && res?.data?.status != 400) {
        history.push({
          pathname: "/login",
          state: { emailVerified: true },
        });
      } else {
        setErrorVerifyMail(true);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading)
    return (
      <>
        <MetaTags>
          <title>{t("page.mailVerify.title")}</title>
        </MetaTags>
        <h5 className="text-primary d-flex justify-content-center my-5">
          {t("page.common.spinner.onLoading")}
        </h5>
      </>
    );

  return (
    <>
      {!errorVerifyMail && (
        <div className="account-pages my-5 pt-sm-5">
          <MetaTags>
            <title>{t("page.mailVerify.title")}</title>
          </MetaTags>
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={6}>
                <Card>
                  <CardBody className="text-center">
                    <div className="avatar-md mx-auto mb-3">
                      <div className="avatar-title rounded-circle bg-light">
                        <i
                          className={`bx bx-envelope h1 mb-0 text-primary`}
                        ></i>
                      </div>
                    </div>
                    <h6>{t("page.mailVerify.heading")}</h6>
                    <Button
                      className="mt-2"
                      color="primary"
                      onClick={() => {
                        verifyMail();
                      }}
                    >
                      {t("page.common.btn.IComfirm")}
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {/* {mailVerified && <ValidationMailStatus status="valid" email="" />} */}
      {errorVerifyMail && <ValidationMailStatus status="error" email="" />}
    </>
  );
}
