import React, { lazy } from "react";

// project import
import MinimalLayout from "layout/MinimalLayout";
import Loadable from "components/Loadable";

// render - login
const AuthLogin = Loadable(lazy(() => import("pages/auth/Login")));
const AuthForgorPassword = Loadable(
  lazy(() => import("pages/auth/ForgotPassword"))
);
const AuthResetPassword = Loadable(
  lazy(() => import("pages/auth/ResetPassword"))
);
const AuthSessionExpired = Loadable(
  lazy(() => import("pages/auth/SessionExpired"))
);

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "login",
      element: <AuthLogin />,
    },
    {
      path: "forgotPassword",
      element: <AuthForgorPassword />,
    },
    {
      path: "resetPassword",
      element: <AuthResetPassword />,
    },
    {
      path: "sessionExpired",
      element: <AuthSessionExpired />,
    },
  ],
};

export default LoginRoutes;
