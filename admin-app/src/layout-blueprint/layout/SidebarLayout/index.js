import PropTypes from "prop-types";
import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const SidebarLayout = props => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div id="layout-wrapper">
      <Header />
      <Sidebar />
      <div className="main-content">{props.children}</div>
      <Footer />
    </div>
  );
};

SidebarLayout.propTypes = {
  children: PropTypes.object,
};

export default withRouter(SidebarLayout);
