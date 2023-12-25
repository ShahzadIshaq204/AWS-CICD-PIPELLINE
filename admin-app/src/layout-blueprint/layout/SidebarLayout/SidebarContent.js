import { activateParentDropdown } from "utils/helpers/ui";
import MetisMenu from "metismenujs";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { withTranslation } from "react-i18next";
import { Link, withRouter } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { ROLE_DEFAULT, ROLE_SUPER_ADMIN } from "utils/constants/global";
import { useSelector } from "react-redux";

const SidebarContent = props => {
  const ref = useRef();

  useEffect(() => {
    const pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname]);

  useEffect(() => {
    ref.current.recalculate();
  });

  const user = useSelector(state => state.Login.user);

  const sidebarMenu = [
    {
      label: "Users",
      icon: "bx bxs-user",
      path: "/users",
      roles: [ROLE_SUPER_ADMIN],
    },
    {
      label: "Sessions",
      icon: "bx bx-transfer",
      path: "/sessions",
      roles: [ROLE_DEFAULT, ROLE_SUPER_ADMIN],
    },
    {
      label: "My Profile",
      path: "/profile",
      icon: "bx bxs-user-detail",
      roles: [ROLE_DEFAULT, ROLE_SUPER_ADMIN],
    },
  ];

  return (
    <SimpleBar className="h-100" ref={ref}>
      <div id="sidebar-menu">
        <ul className="metismenu list-unstyled" id="side-menu">
          <li className="menu-title">{props.t("layout.sidebar.Menu")}</li>
          {sidebarMenu
            .filter(
              item => item.roles.includes(user?.role?.name) //&& !item?.hide
            )
            .map((menu, index1) => {
              if (menu?.children) {
                return (
                  <li key={index1}>
                    <Link to="/#" className="">
                      <i className={menu.icon}></i>
                      <span>{menu.label}</span>
                    </Link>
                    <ul className="sub-menu" aria-expanded="false">
                      {menu?.children.map((link, index2) => {
                        return (
                          <li key={index2}>
                            <Link to={link.path}>
                              <i className={link.icon}></i>
                              <span>{link.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              } else {
                return (
                  <li key={index1}>
                    <Link to={menu?.path}>
                      <i className={menu.icon}></i>
                      <span>{menu.label}</span>
                    </Link>
                  </li>
                );
              }
            })}
        </ul>
      </div>
    </SimpleBar>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
