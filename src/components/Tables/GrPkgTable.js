import React, { useState, useEffect } from "react";
import { Card, Row, Col, Badge, Stack, Form } from "react-bootstrap";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft, faUser } from "@fortawesome/free-solid-svg-icons";

import { findMainPackage } from "store/requests/group";
import { faCalendarCheck, faClock } from "@fortawesome/free-regular-svg-icons";
import { formatShortDate } from "store/requests/user";
const GroupPackageTable = ({ group, heightCard }) => {
  const [packages, setPackages] = useState(
    group.packages.filter(
      (item) => !_.isEqual(item, findMainPackage(group.packages))
    )
  );
  const [filterItem, setFilterItem] = useState(packages);
  const PackageCard = ({ packages, classes }) => {
    return (
      <Col xs={12}>
        <Card className={`shadow-sm ${classes}`}>
          <Card.Body>
            <Row className="mb-1">
              <Col xs={12} className="d-flex justify-content-between">
                <h5>{packages.package?.name}</h5>
                <Badge
                  tab
                  bg={
                    packages.status === "Not Activated"
                      ? "primary"
                      : "secondary"
                  }
                  style={{ width: "5.5rem", height: "1.25rem" }}
                  className="tag px-auto"
                >
                  {packages.status === "Not Activated"
                    ? "Chưa kích hoạt"
                    : "Đã hết hạn"}
                </Badge>
              </Col>
              <Col
                xs={12}
                className="text-center mb-1"
                style={{
                  fontWeight: "bolder",
                  color: "#93a5be",
                  fontSize: "0.75rem",
                }}
              >
                <FontAwesomeIcon icon={faClock} />{" "}
                {packages.startDate
                  ? formatShortDate(packages.startDate)
                  : "______"}{" "}
                -{" "}
                {packages.endDate
                  ? formatShortDate(packages.endDate)
                  : "______"}
              </Col>
              <Col>
                <FontAwesomeIcon icon={faCalendarCheck} /> <b>Thời hạn: </b>
                {packages.package?.duration} tháng
              </Col>
              <Col>
                <FontAwesomeIcon icon={faUser} /> <b>Thành viên: </b>
                {packages.package?.noOfMember} người
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    );
  };
  useEffect(() => {
    setPackages(
      group.packages.filter(
        (item) => !_.isEqual(item, findMainPackage(group.packages))
      )
    );
  }, [group]);
  useEffect(() => {
    setFilterItem(packages);
  }, [packages]);
  const handleFilter = (e) => {
    const value = e.target.value;
    if (value === "Not Activated") {
      setFilterItem(packages.filter((item) => item.status === "Not Activated"));
    }
    if (value === "Expired") {
      setFilterItem(packages.filter((item) => item.status === "Expired"));
    }
  };
  return (
    <>
      <Card border="light" className="bg-white shadow-sm h-100">
        <Card.Body
          className="d-flex flex-column"
          style={{ height: `${heightCard}px` }}
        >
          <div className="d-flex flex-row justify-content-between mb-3">
            <h5>
              <b>Lịch sử mua gói</b>
            </h5>
            {packages && packages.length > 0 && (
              <Form.Select
                aria-label="Default select example"
                size="sm"
                onChange={handleFilter}
              >
                <option>Tất cả</option>
                <option value="Not Activated">Chưa kích hoạt</option>
                <option value="Expired">Đã hết hạn</option>
              </Form.Select>
            )}
          </div>
          {!packages || packages.length === 0 ? (
            <div className="d-flex flex-grow-1 justify-content-center align-items-center">
              <div className="text-center text-quinary">
                <div className="icon icon-xl">
                  <FontAwesomeIcon icon={faClockRotateLeft} />
                </div>
                <h5 className="mt-3">Lịch sử mua gói trống</h5>
              </div>
            </div>
          ) : (
            <div
              style={{
                overflowY: "auto",
                height: `calc(${heightCard} - 20)px`,
                overflowX: "hidden",
              }}
            >
              <Row>
                {filterItem.map((pkg, idx) => {
                  return (
                    <PackageCard
                      key={`member-card-${pkg.id}`}
                      packages={pkg}
                      classes={idx !== 0 && "mt-3"}
                    />
                  );
                })}
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>
    </>
  );
};
export default GroupPackageTable;
