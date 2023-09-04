import React, { lazy } from "react";

// project import
import Loadable from "components/Loadable";
import MainLayout from "layout/MainLayout";

// render - dashboard
const Dashboard = Loadable(lazy(() => import("pages/dashboard")));

// render - utilities
const Users = Loadable(lazy(() => import("pages/management/user")));
const Packages = Loadable(lazy(() => import("pages/management/package")));
const Groups = Loadable(lazy(() => import("pages/management/group")));
const UserDetail = Loadable(lazy(() => import("pages/profile")));
const GroupDetail = Loadable(lazy(() => import("pages/groupDetail")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "users",
      element: <Users />,
    },
    { path: "users/:id", element: <UserDetail /> },
    { path: "groups/:id", element: <GroupDetail /> },
    {
      path: "packages",
      element: <Packages />,
    },
    {
      path: "groups",
      element: <Groups />,
    },
  ],
};

export default MainRoutes;
