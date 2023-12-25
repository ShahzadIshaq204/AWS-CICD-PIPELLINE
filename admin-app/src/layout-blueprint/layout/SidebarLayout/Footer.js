import {
  ENV_PROJECT_AUTHOR,
  ENV_PROJECT_NAME,
} from "utils/helpers/environment";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

const Footer = props => {
  return (
    <footer className="footer">
      <Container fluid={true}>
        <Row>
          <Col md={6}>
            {new Date().getFullYear()} © {ENV_PROJECT_NAME}.
          </Col>
          <Col md={6}>
            <div className="text-sm-end d-none d-sm-block">
              {ENV_PROJECT_AUTHOR}
              {/* {props.t("layout.footer.copyright")} */}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

Footer.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Footer);
