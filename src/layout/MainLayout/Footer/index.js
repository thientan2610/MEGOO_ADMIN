import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faSkype,
  faSlack,
} from "@fortawesome/free-brands-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

// bootstrap
import { Row, Col, Card } from "react-bootstrap";

// ==============================|| FOOTER ||============================== //
const Footer = ({ open }) => {
  const [isOpen, setIsOpen] = useState();
  const handleOpen = (check) => {
    !check
      ? setIsOpen("footer section rounded py-5 shadow-sm")
      : setIsOpen("footer section py-5 rounded open shadow-sm");
  };
  useEffect(() => {
    handleOpen(open);
  }, [open]);

  return (
    <footer className={isOpen}>
      <Row>
        <Col xs={12} lg={6} className="mb-4 mb-lg-0">
          <p className="mb-0 text-center text-xl-left made-with-love">
            Made with{" "}
            <FontAwesomeIcon
              icon={faHeart}
              className="text-danger icon heart"
            />{" "}
            by Night Owl © Megoo 2023
          </p>
        </Col>
        <Col xs={12} lg={6}>
          <ul className="list-inline list-group-flush list-group-borderless text-center text-xl-right mb-0">
            <li className="list-inline-item px-0 px-sm-2">
              <Card.Link href="#" target="_blank">
                Về chúng tôi
              </Card.Link>
            </li>
            <li className="list-inline-item px-0 px-sm-2">
              <Card.Link>Liên hệ</Card.Link>
            </li>
            <li className="list-inline-item px-0 px-sm-2">
              <Card.Link href="#" target="_blank" className="icon icon-sm">
                <FontAwesomeIcon icon={faSquareFacebook} />
              </Card.Link>
            </li>
            <li className="list-inline-item px-0 px-sm-2">
              <Card.Link href="#" target="_blank" className="icon icon-sm">
                <FontAwesomeIcon icon={faSkype} />
              </Card.Link>
            </li>
            <li className="list-inline-item px-0 px-sm-2">
              <Card.Link href="#" target="_blank" className="icon icon-sm">
                <FontAwesomeIcon icon={faSlack} />
              </Card.Link>
            </li>
          </ul>
        </Col>
      </Row>
    </footer>
  );
};

Footer.propTypes = { open: PropTypes.bool };

export default Footer;
