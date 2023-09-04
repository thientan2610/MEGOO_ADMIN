import React, { forwardRef } from "react";

// bootstrap
import { Col, Row, Card } from "react-bootstrap";

//assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faEarthAsia,
} from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";

const CounterWidget = forwardRef((props, ref) => {
  const { icon, iconColor, category, title, period, percentage } = props;
  const percentageIcon = percentage < 0 ? faAngleDown : faAngleUp;
  const percentageColor = percentage < 0 ? "text-danger" : "text-success";
  const curPercentage = percentage < 0 ? percentage * -1 : percentage;
  return (
    <Card ref={ref} border="light" className="shadow-sm h-100">
      <Card.Body>
        <Row className="d-block d-xl-flex align-items-center">
          <Col
            xl={4}
            className="text-xl-center d-flex align-items-center justify-content-xl-center mb-3 mb-xl-0"
          >
            <div
              className={`icon icon-shape icon-lg icon-shape-${iconColor} rounded-circle me-sm-0`}
              style={{ width: "4.5rem", height: "4.5rem" }}
            >
              <FontAwesomeIcon icon={icon} />
            </div>
            <div className="d-sm-none">
              <h5>{category}</h5>
              <h3 className="mb-1">{title}</h3>
            </div>
          </Col>
          <Col xs={12} xl={8} className="px-xl-0">
            <div className="d-none d-sm-block">
              <h5>{category}</h5>
              <h3 className="mb-1">{title}</h3>
            </div>
            <small>
              <FontAwesomeIcon icon={faClock} /> {period.min} - {period.max}
            </small>
            {curPercentage && (
              <div className="small mt-2">
                <FontAwesomeIcon
                  icon={percentageIcon}
                  className={`${percentageColor} me-1`}
                />
                <span className={`${percentageColor} fw-bold`}>
                  {curPercentage}%
                </span>{" "}
                Tháng trước
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
});
export default CounterWidget;
