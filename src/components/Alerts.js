import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// bootstrap
import { Alert } from "react-bootstrap";

// material-ui
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const Alerts = ({ title, children, show, handleClose, classes }) => {
  const [width, setWidth] = useState();
  const theme = useTheme();
  const matchDownXs = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    setWidth(
      matchDownXs
        ? { width: "100%", zIndex: 1060 }
        : { width: "450px", zIndex: 1060 }
    );
  }, [matchDownXs]);
  return (
    <Alert
      show={show}
      variant={classes.alertVariant}
      className={classes.alertClass}
      style={width}
      onClose={handleClose}
      dismissible
    >
      {title && <Alert.Heading>{title}</Alert.Heading>}
      {children}
    </Alert>
  );
};

Alerts.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  show: PropTypes.bool,
  children: PropTypes.node,
  handleClose: PropTypes.func,
  classes: PropTypes.object,
};

export default Alerts;
