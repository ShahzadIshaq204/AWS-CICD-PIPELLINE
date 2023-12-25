import React from "react";
// import SweetAlert from "react-bootstrap-sweetalert";
import { MetaTags } from "react-meta-tags";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function ValidationMailStatus({ status = null, email = "" }) {
  const { t } = useTranslation();
  const mailStatus = {
    send: {
      color: "primary",
      icon: "bx-mail-send",
      title: t("page.validationMail.sendStatus.title"),
      resend: true,
      description: (
        <p>
          {t("page.validationMail.sendStatus.description")}{" "}
          <span className="font-weight-semibold">{email}</span>
        </p>
      ),
    },
    valid: {
      color: "success",
      icon: "bxs-envelope",
      title: t("page.validationMail.validStatus.title"),
    },
    error: {
      color: "danger",
      icon: "bx-error-alt",
      title: t("page.validationMail.errorStatus.title"),
      resend: true,
    },
  };

  if (!status || !["send", "valid", "error"].includes(status)) return <></>;
  return (
    <>
      <div className="account-pages my-5 pt-sm-5">
        <MetaTags>
          <title>{t("page.validationMail.title")}</title>
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
                            className={`bx ${mailStatus[status].icon} h1 mb-0 text-${mailStatus[status].color}`}
                          ></i>
                        </div>
                      </div>
                      <div className="p-2 mt-4">
                        <h4>{mailStatus[status].title}</h4>
                        {mailStatus[status]?.description}
                        {mailStatus[status]?.resend && (
                          <div>
                            {t("page.validationMail.resend.description")}
                            {"  "}
                            <Link to="/mail/resend">
                              {t("page.common.btn.retry")}
                            </Link>
                          </div>
                        )}
                        <div className="mt-4">
                          <Link
                            to="/login"
                            className={`btn btn-${mailStatus[status].color}`}
                          >
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
    </>
  );
}
ValidationMailStatus.propTypes = {
  status: PropTypes.string,
  email: PropTypes.string,
};
export default ValidationMailStatus;

/* ------------------------------------------------ */
// function CustomSweetAlert() {
//   const [description, setDescription] = useState("Hello world");
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [isError, setIsError] = useState(false);
//   return (
//     <>
//       {isSuccess ? (
//         <SweetAlert
//           success
//           title={"Success"}
//           onConfirm={() => setIsSuccess(false)}
//         >
//           {description}
//         </SweetAlert>
//       ) : null}

//       {isError ? (
//         <SweetAlert error title={"Error"} onConfirm={() => setIsError(false)}>
//           {description}
//         </SweetAlert>
//       ) : null}

//       {!isError && !isSuccess && (
//         <SweetAlert
//           title="Are you sure?"
//           warning
//           showCancel
//           confirmBtnBsStyle="success"
//           cancelBtnBsStyle="danger"
//           onConfirm={() => setIsSuccess(true)}
//           onCancel={() => setIsError(true)}
//         >
//           You won&apos;t be able to revert this!
//         </SweetAlert>
//       )}
//     </>
//   );
// }
