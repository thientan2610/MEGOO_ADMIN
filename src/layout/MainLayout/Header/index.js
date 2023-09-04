import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// bootstrap
import { Navbar, Container, Button } from "react-bootstrap";

// project import
import HeaderContent from "./Header";
import Search from "./Search";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = ({ open, handleDrawerToggle }) => {
  const [isOpen, setIsOpen] = useState();
  const handleOpen = (check) => {
    !check
      ? setIsOpen("ps-0 pe-2 py-0 shadow-sm")
      : setIsOpen("ps-0 pe-2 py-0 shadow-sm open");
  };

  useEffect(() => {
    handleOpen(open);
  }, [open]);

  const iconColor = "#2e3650";
  const iconBackColorOpen = "#e9ecef";

  const menuButtonStyle = {
    border: "none",
    color: iconColor,
    backgroundColor: open ? iconBackColorOpen : "inherit",
    transition: "all .2s ease",
  };
  return (
    <Navbar fixed="top" variant="dark" expanded className={isOpen}>
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">
            <Button
              className="mx-2"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              style={menuButtonStyle}
            >
              <FontAwesomeIcon icon={faBars} />
            </Button>
            <Search />
          </div>
          <HeaderContent />
        </div>
      </Container>
    </Navbar>
  );
};

Header.propTypes = {
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
};

export default Header;
