import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCog,
  faSignOutAlt,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";

// bootstrap
import {
  Row,
  Col,
  Nav,
  Image,
  Dropdown,
  ListGroup,
  Badge,
} from "react-bootstrap";

// project import
import NOTIFICATIONS_DATA from "data/notifications";
import { logoutUser } from "store/requests/auth";
import { getUserById } from "store/requests/user";

const HeaderContent = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { currentUser } = useSelector((state) => state?.auth.login);

  useEffect(() => {
    getUserById(
      currentUser?.data.userInfo?._id,
      currentUser?.accessToken,
      dispatch
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleLogout = async () => {
    await logoutUser(currentUser, dispatch, navigate);
  };

  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const areNotificationsRead = notifications.reduce(
    (acc, notif) => acc && notif.read,
    true
  );

  const markNotificationsAsRead = () => {
    setTimeout(() => {
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    }, 300);
  };

  const Notification = (props) => {
    const { link, sender, image, time, message, read = false } = props;
    const readClassName = read ? "" : "text-danger";

    return (
      <ListGroup.Item action href={link} className="border-bottom">
        <Row className="align-items-center">
          <Col className="col-auto">
            <Image
              src={image}
              className="user-avatar lg-avatar rounded-circle"
            />
          </Col>
          <Col className="ps-0 ms--2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="h6 mb-0 text-small">{sender}</h4>
              </div>
              <div className="text-end">
                <small className={readClassName}>{time}</small>
              </div>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Nav className="align-items-center me-3">
      <Dropdown as={Nav.Item} onToggle={markNotificationsAsRead}>
        <Dropdown.Toggle
          as={Nav.Link}
          className="text-dark icon-notifications me-lg-3"
        >
          <span className="icon icon-sm mt-2">
            <FontAwesomeIcon icon={faBell} shake={!areNotificationsRead} />
          </span>
          {areNotificationsRead ? null : (
            <h6 className="text-center">
              <Badge
                bg="primary"
                pill
                className="position-absolute top-10 start-40 p-1 unread-notifications"
              >
                <strong>99+</strong>
              </Badge>
            </h6>
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dashboard-dropdown notifications-dropdown shadow rounded-3 dropdown-menu-lg  mt-2 py-0 ">
          <ListGroup className="list-group-flush">
            <Nav.Link
              // href="#"
              className="text-center text-primary fw-bold border-bottom py-3"
            >
              Notifications
            </Nav.Link>

            {notifications.map((n) => (
              <Notification key={`notification-${n.id}`} {...n} />
            ))}

            <Dropdown.Item className="text-center text-primary fw-bold py-3">
              View all
            </Dropdown.Item>
          </ListGroup>
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown as={Nav.Item}>
        <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
          <div className="media d-flex align-items-center">
            <Image
              src={currentUser?.data.userInfo?.avatar}
              className="user-avatar md-avatar rounded-circle shadow"
            />
            <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
              <span className="mb-0 font-small fw-bold">
                {currentUser?.data.userInfo?.name}
              </span>
            </div>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="user-dropdown dropdown-menu-end mt-2 shadow">
          <Dropdown.Item
            className="fw-bold"
            as={Link}
            to={`/users/${currentUser?.data.userInfo?._id}`}
          >
            <FontAwesomeIcon icon={faUserCircle} className="me-2" /> Trang cá
            nhân
          </Dropdown.Item>
          <Dropdown.Item className="fw-bold">
            <FontAwesomeIcon icon={faCog} className="me-2" /> Cài đặt
          </Dropdown.Item>
          <Dropdown.Item className="fw-bold">
            <FontAwesomeIcon icon={faUserShield} className="me-2" /> Hỗ trợ
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item className="fw-bold" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="text-danger me-2" />{" "}
            Đăng xuất
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  );
};
export default HeaderContent;
