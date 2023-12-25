import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import logo from "../../../assets/images/logo.png";
import ProfileMenu from "../../component/ProfileMenu";
import { toggleMobileSidebar } from "../../../utils/helpers/ui";
import LanguageDropdown from "../../component/LanguageDropdown";
// import NotificationDropdown from "../../component/NotificationDropdown";

const Header = () => {
  // const [search, setsearch] = useState(false);

  return (
    <header id="page-topbar">
      <div className="navbar-header">
        <div className="d-flex">
          <div className="navbar-brand-box d-lg-none d-md-block">
            {/* <Link to="/" className="logo logo-dark">
              <span className="logo-sm">
                <img src={logo} alt="" height="65" />
              </span>
            </Link> */}

            {/* <Link to="/" className="logo logo-light">
              <span className="logo-sm">
                <img src={logoLightSvg} alt="" height="22" />
              </span>
            </Link> */}
          </div>

          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="btn btn-sm px-3 font-size-16 header-item "
            id="vertical-menu-btn"
          >
            <i className="fa fa-fw fa-bars" />
          </button>

          {/* <form className="app-search d-none d-lg-block">
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder={"Rechercher" + "..."}
              />
              <span className="bx bx-search-alt" />
            </div>
          </form> */}
        </div>

        <div className="d-flex">
          {/* <div className="dropdown d-inline-block d-lg-none ms-2">
            <button
              onClick={() => {
                setsearch(!search);
              }}
              type="button"
              className="btn header-item noti-icon "
              id="page-header-search-dropdown"
            >
              <i className="mdi mdi-magnify" />
            </button>
            <div
              className={
                search
                  ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                  : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
              }
              aria-labelledby="page-header-search-dropdown"
            >
              <form className="p-3">
                <div className="form-group m-0">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher ..."
                      aria-label="Recipient's username"
                    />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="submit">
                        <i className="mdi mdi-magnify" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div> */}

          <LanguageDropdown />

          {/* <div className="dropdown d-none d-lg-inline-block ms-1">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="btn header-item noti-icon "
              data-toggle="fullscreen"
            >
              <i className="bx bx-fullscreen" />
            </button>
          </div> 
          <NotificationDropdown /> */}

          {/* <ProfileMenu /> */}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Header);
