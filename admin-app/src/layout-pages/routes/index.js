import React from "react";
import { Redirect } from "react-router-dom";

// Authentication related pages
import Auth from "../pages/Authentication/Auth";
// import MailSend from "layout-pages/pages/Authentication/MailSend";
// import MailResend from "layout-pages/pages/Authentication/MailResend";
// import MailVerify from "layout-pages/pages/Authentication/MailVerify";

/* Customer pages */
import CustomerProfile from "../pages/Profile/FO/Profile";

/* Admin pages */
import AdminUsersPage from "../pages/Users";
import AdminSessionsPage from "../pages/Sessions";

const defaultUserProtectedRoutes = [
  {
    path: "/sessions",
    component: AdminSessionsPage,
    isVerifiedAccountGuard: true,
  },
  {
    path: "/profile",
    component: CustomerProfile,
    isVerifiedAccountGuard: true,
  },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/sessions" /> },
  // { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const adminProtectedRoutes = [
  {
    path: "/users",
    component: AdminUsersPage,
    isVerifiedAccountGuard: true,
  },
  {
    path: "/sessions",
    component: AdminSessionsPage,
    isVerifiedAccountGuard: true,
  },
  {
    path: "/profile",
    component: CustomerProfile,
    isVerifiedAccountGuard: true,
  },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/sessions" /> },
];

const publicRoutes = [
  { path: "/auth", component: Auth },
  // { path: "/login", component: Login },
  // { path: "/register", component: Register },
  // { path: "/mail/send", component: MailSend },
  // { path: "/mail/resend", component: MailResend },
  // { path: "/verify/:token", component: MailVerify },
  // { path: "/forgot-password", component: ForgetPwd },
  // { path: "/reset-password/:token", component: ResetPassword },
];

export { defaultUserProtectedRoutes, adminProtectedRoutes, publicRoutes };
