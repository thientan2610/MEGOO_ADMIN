import React, { forwardRef, useEffect, useState } from "react";

// bootstrap
import { Card, Button } from "react-bootstrap";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

// project
import TransactionChart from "components/Charts/TransactionChart";

const TransactionWidget = forwardRef((props, ref) => {
  const { title, value, percentage } = props;
  const [slot, setSlot] = useState("month");
  const percentageIcon = percentage < 0 ? faAngleDown : faAngleUp;
  const percentageColor = percentage < 0 ? "text-danger" : "text-success";
  const curPercentage = percentage < 0 ? percentage * -1 : percentage;

  return (
    <Card ref={ref} border="light" className="shadow-sm h-100">
      <Card.Body>
        <div className="d-flex flex-row align-items-center flex-0 bg-none">
          <div className="d-block ms-3">
            <h5 className="fw-normal mb-2">{title}</h5>
            <h3>{slot === "month" ? value.month : value.year}</h3>
            {curPercentage ? (
              <small className="fw-bold mt-2">
                <span className="me-2">Tháng trước</span>
                <FontAwesomeIcon
                  icon={percentageIcon}
                  className={`${percentageColor} me-1`}
                />
                <span className={percentageColor}>{curPercentage}%</span>
              </small>
            ) : (
              <br />
            )}
          </div>
          <div className="d-flex ms-auto me-3">
            <Button
              variant={slot === "month" ? "primary" : "outline-primary"}
              size="sm"
              className={
                slot === "month" ? "me-3 rounded" : "me-3 rounded btn-pressed"
              }
              style={{ width: "4rem" }}
              onClick={() => setSlot("month")}
            >
              Tháng
            </Button>
            <Button
              variant={slot === "year" ? "primary" : "outline-primary"}
              size="sm"
              className={
                slot === "year" ? "me-2 rounded" : "me-2 rounded btn-pressed"
              }
              style={{ width: "4rem" }}
              onClick={() => setSlot("year")}
            >
              Năm
            </Button>
          </div>
        </div>
        <div className="m-0 me-1">
          <TransactionChart slot={slot} />
        </div>
      </Card.Body>
    </Card>
  );
});

export default TransactionWidget;
