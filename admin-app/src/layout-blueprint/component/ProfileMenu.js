import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect, useDispatch, useSelector } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// users
import img_404 from "../../assets/images/placeholder.png";
import { logout } from "../../store/auth/login/actions";
import { CDN } from "utils/constants/global";
const ProfileMenu = props => {
  const dispatch = useDispatch();

  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const user = useSelector(state => state.Login.user);

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={CDN + user?.avatar}
            onError={e => {
              e.target.onerror = null;
              e.target.src = img_404;
            }}
            alt={props.t("layout.profileMenu.profile")}
          />
          <span className="d-none d-xl-inline-block ms-2 me-1">
            {user?.first_name + " " + user?.last_name}
          </span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/profile">
            <i className="bx bx-user font-size-16 align-middle me-1" />
            {props.t("layout.profileMenu.profile")}
          </DropdownItem>
          <div className="dropdown-divider" />
          <Link
            to="/"
            onClick={e => {
              e.preventDefault();
              dispatch(logout());
            }}
            className="dropdown-item"
          >
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            {props.t("layout.profileMenu.logout")}
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

export default withRouter(connect(null, {})(withTranslation()(ProfileMenu)));
