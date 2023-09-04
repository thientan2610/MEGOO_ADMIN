import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, useMediaQuery } from "@mui/material";
import { Container } from "react-bootstrap";

// project import
import Drawer from "./Drawer";
import Header from "./Header";
import navigation from "menu";
import Breadcrumbs from "components/Breadcrumb";
import Footer from "./Footer";

// types
import { openDrawer } from "store/reducers/menu";
import { refeshToken } from "store/requests/auth.js";
import { loginSuccess } from "store/reducers/auth";

// third party
import jwtDecode from "jwt-decode";

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down("lg"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let { currentUser } = useSelector((state) => state?.auth.login);
  const { drawerOpen } = useSelector((state) => state.menu);
  const [isAuth, setIsAuth] = useState(currentUser ? true : false);
  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  useEffect(() => {
    if (currentUser !== null) {
      const decodedToken = jwtDecode(currentUser?.accessToken);
      if (decodedToken.exp < new Date().getTime() / 1000) {
        dispatch(loginSuccess(null));
      }
    }
    setIsAuth(currentUser ? true : false);
    console.log("Authentication:", isAuth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    refeshToken(currentUser, dispatch, navigate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  return (
    <>
      {!isAuth && navigate("/login")}
      <Header open={open} handleDrawerToggle={handleDrawerToggle} />
      <Box sx={{ display: "flex", width: "100%" }}>
        <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{ width: "100%", flexGrow: 1, p: { xs: 2, sm: 3 }, mt: 7 }}
        >
          <Container>
            <Breadcrumbs navigation={navigation} title />
          </Container>
          <Outlet />
          <Container>
            <Footer open={open} handleDrawerToggle={handleDrawerToggle} />
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
