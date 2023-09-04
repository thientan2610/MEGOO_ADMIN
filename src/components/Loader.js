import React from "react";

// bootstrap
import { Spinner } from "react-bootstrap";

// ==============================|| Loader ||============================== //

const Loader = () => (
  <div className="position-relative" style={{ zIndex: 2001 }}>
    <Spinner
      className="position-absolute top-50 start-50 translate-middle"
      animation="border"
      variant="primary"
    />
  </div>
);

export default Loader;
