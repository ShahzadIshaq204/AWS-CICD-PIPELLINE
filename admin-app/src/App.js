import PropTypes from "prop-types";
//import "./assets/scss/theme.scss";
import { useEffect, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { printEnvMode } from "utils/helpers/environment";
import Layout from "./layout-blueprint/layout/SidebarLayout";
import NonAuthLayout from "./layout-blueprint/layout/NonAuthLayout";
import {
  publicRoutes,
  adminProtectedRoutes,
  defaultUserProtectedRoutes,
} from "./layout-pages/routes";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Authmiddleware from "./layout-pages/routes/route";
import MainWrapper from "./layout-pages/common/MainWrapper";
import { ROLE_DEFAULT, ROLE_SUPER_ADMIN } from "utils/constants/global";

const App = () => {
  const user = useSelector(state => state.Login.user);
  const isAuthenticated = useSelector(state => state.Login.isAuthenticated);
  const { t } = useTranslation();

  useEffect(() => {
    printEnvMode();
  }, []);

  return (
    <>
      <Suspense fallback={t("page.common.spinner.onLoading")}>
        <Switch>
          {/* <Redirect exact from="/" to="/balance" /> */}

          {/* Public routes */}
          {publicRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
              isAuthProtected={false}
              exact
            />
          ))}

          {user?.role?.name === ROLE_DEFAULT &&
            defaultUserProtectedRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                isAuthProtected={true}
                key={idx}
                exact
              />
            ))}

          {user?.role?.name === ROLE_SUPER_ADMIN &&
            adminProtectedRoutes.map((route, idx) => (
              <Authmiddleware
                path={route.path}
                layout={Layout}
                component={route.component}
                isAuthProtected={true}
                key={idx}
                exact
              />
            ))}

          {/* Handle role of user before render components or redirect it to login page  */}
          {isAuthenticated ? (
            <>
              <Route
                render={() => (
                  <Layout>
                    <MainWrapper title={t("page.common.403.msg")}>
                      <h3 className="text-danger m-2">
                        Page unauthorized 403 !
                      </h3>
                    </MainWrapper>
                  </Layout>
                )}
              />
            </>
          ) : (
            <Route
              render={() => (
                <h6 className="text-danger m-2">User not logged in 401 !</h6>
              )}
            />
          )}

          {/*  !! fixme this route never reatched */}
          <Route
            render={() => (
              <div className="d-flex align-items-center justify-content-center m-5">
                <h1 className="text-danger">Page not found 404</h1>
              </div>
            )}
          />
        </Switch>
      </Suspense>
    </>
  );
};

App.propTypes = {
  layout: PropTypes.any,
};

export default App;
