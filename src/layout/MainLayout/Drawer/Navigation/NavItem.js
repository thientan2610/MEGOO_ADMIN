import React, { forwardRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// bootstrap
import { Nav, Container, Col, Row } from "react-bootstrap";

// project import
import { activeItem } from "store/reducers/menu";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { drawerOpen, openItem } = useSelector((state) => state.menu);

  let itemTarget = "_self";
  // if (item.target) {
  //   itemTarget = "_blank";
  // }

  let listItemProps = {
    component: forwardRef((props, ref) => (
      <Link ref={ref} {...props} to={item.url} target={itemTarget} />
    )),
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: itemTarget };
  }

  const itemHandler = (id) => {
    dispatch(activeItem({ openItem: [id] }));
  };

  const itemIcon = item.icon ? <FontAwesomeIcon icon={item.icon} /> : false;

  const isSelected = openItem.findIndex((id) => id === item.id) > -1;
  // active menu item on page load
  useEffect(() => {
    if (pathname.includes(item.url)) {
      dispatch(activeItem({ openItem: [item.id] }));
    }
    // eslint-disable-next-line
  }, [pathname]);

  const IconStyle = !drawerOpen ? { fontSize: "18px" } : null;
  const navItemClassName = isSelected ? "sidebar-item active" : "sidebar-item";

  return (
    <Nav.Item className={navItemClassName} href={item.url}>
      <Nav.Link
        disabled={item.disabled}
        onClick={() => itemHandler(item.id)}
        target={itemTarget}
        className="d-flex justify-content-center align-items-center"
        active={isSelected}
        eventKey={item.url}
        as={listItemProps.component}
      >
        <Container>
          <Row className="align-items-start">
            <Col xs={2} className="text-end" style={IconStyle}>
              {itemIcon}
            </Col>
            {drawerOpen && (
              <Col xs={8} className="text-start">
                {item.title}
              </Col>
            )}
          </Row>
        </Container>
      </Nav.Link>
    </Nav.Item>
  );
};

NavItem.propTypes = { item: PropTypes.object };

export default NavItem;
