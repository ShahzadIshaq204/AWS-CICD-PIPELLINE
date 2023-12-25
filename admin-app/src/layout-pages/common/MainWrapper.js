import PropTypes from "prop-types";
import { Container } from "reactstrap";
import Heading from "layout-pages/common/PageHeading";
import MetaTags from "react-meta-tags";
import { ENV_PROJECT_NAME } from "utils/helpers/environment";

function MainWrapper({ title, heading = null, children }) {
  return (
    <div className="page-content">
      <MetaTags>
        <title>
          {title ? `${title} | ${ENV_PROJECT_NAME}` : ENV_PROJECT_NAME}
        </title>
      </MetaTags>

      <Container fluid>
        {heading && <Heading>{heading}</Heading>}
        {children}
      </Container>
    </div>
  );
}

MainWrapper.propTypes = {
  title: PropTypes.string,
  heading: PropTypes.string,
  children: PropTypes.node,
};

export default MainWrapper;
