import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Route, Redirect } from "react-router-dom";
import MainWrapper from "layout-pages/common/MainWrapper";

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthProtected = true,
  isVerifiedAccountGuard,
  // auth user data
  isLoading,
  isAuthenticated,
  user,
  //
  ...rest
}) => {
  const { t } = useTranslation();
  return (
    <Route
      {...rest}
      render={props => {
        if (isLoading) {
          return (
            <>
              {isAuthenticated ? (
                <Layout>
                  <MainWrapper title={t("page.common.spinner.onLoading")}>
                    <h5 className="text-primary">Loading ...</h5>
                  </MainWrapper>
                </Layout>
              ) : (
                <h5 className="text-primary mt-4 mx-3">Loading ...</h5>
              )}
            </>
          );
        }

        // todo fixme
        if (isAuthProtected && !isAuthenticated) {
          return (
            // <Redirect
            //   to={{ pathname: "/auth", state: { from: props.location } }}
            // />

            <Route
              render={() => (
                <h6 className="text-danger m-2">User not logged in 401 !</h6>
              )}
            />
          );
        }

        // if (isVerifiedAccountGuard && !user?.active) {
        //   showAlertMsg("warning", t("page.common.toaster.validateYourAccount"));
        //   return (
        //     <Redirect
        //       to={{ pathname: "/dashboard", state: { from: props.location } }}
        //     />
        //   );
        // }

        // if (hasRoleGuard && hasRoleGuard !== user?.role?.name) {
        //   return (
        //     <Layout>
        //       <MainWrapper title={"Page non autorisée !"}>
        //         <h1 className="text-danger"> Page non autorisée ! </h1>
        //       </MainWrapper>
        //     </Layout>
        //   );
        // }

        return (
          <Layout>
            <Component {...props} />
          </Layout>
        );
      }}
    />
  );
};
Authmiddleware.propTypes = {
  isAuthProtected: PropTypes.bool,
  component: PropTypes.any,
  location: PropTypes.object,
  layout: PropTypes.any,
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  isVerifiedAccountGuard: PropTypes.bool,
  user: PropTypes.any,
};

const mapStateToProps = state => ({
  isAuthenticated: state.Login.isAuthenticated,
  isLoading: state.Login.isLoading,
  user: state.Login.user,
});

export default connect(mapStateToProps)(Authmiddleware);
