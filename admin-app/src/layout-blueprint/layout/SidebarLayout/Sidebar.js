import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import SidebarContent from "./SidebarContent";

const Sidebar = () => {
  return (
    <div className="vertical-menu">
      <div className="navbar-brand-box">
        {/* <Link to="/" className="logo logo-dark">
          <span className="logo-sm">
            <img src={logo} alt="" height="45" />
          </span>
          <span className="logo-lg">
            <img src={logo} alt="" height="75" />
          </span>
        </Link> */}

        {/* <Link to="/" className="logo logo-light">
          <span className="logo-sm">
            <img src={logoLightSvg} alt="" height="22" />
          </span>
          <span className="logo-lg">
            <img src={logoLightPng} alt="" height="19" />
          </span>
        </Link> */}
      </div>
      <div data-simplebar className="h-100">
        <SidebarContent />
      </div>
      <div className="sidebar-background"></div>
    </div>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

export default withRouter(withTranslation()(Sidebar));
