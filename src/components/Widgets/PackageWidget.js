import React, { forwardRef, useState } from "react";

// bootstrap
import { Card, Button } from "react-bootstrap";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";

// project
import PackageChart from "components/Charts/PackageChart";

const PackageWidget = forwardRef((props, ref) => {
  const { title, value, percentage } = props;
  const percentageIcon = percentage < 0 ? faAngleDown : faAngleUp;
  const percentageColor = percentage < 0 ? "text-danger" : "text-success";
  const curPercentage = percentage < 0 ? percentage * -1 : percentage;

  const [slot, setSlot] = useState("month");

  return (
    <Card ref={ref} border="light" className="shadow-sm h-100">
      <Card.Body>
        <h5 className="d-block fw-normal mb-2 ms-3">{title}</h5>
        <div className="d-flex flex-row align-items-start flex-0 bg-none">
          <h3>{value}</h3>
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
        <div className="m-0 my-4">
          <PackageChart slot={slot} />
        </div>
      </Card.Body>
    </Card>
  );
});

export default PackageWidget;
