import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// bootstrap
import { Col, Row, Table, Card, Form } from "react-bootstrap";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
  BulkCheckboxControl,
} from "react-bs-datatable";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

// ==============================|| Sample Datatable ||============================== //
const SampleTable = ({
  title,
  header,
  body,
  onRowClick,
  children,
  filter,
  filterKey,
  classes,
}) => {
  const [curBody, setCurBody] = useState(body);
  const tableClass = classes
    ? `mx-auto mt-3 datatable ${classes}`
    : "mx-auto mt-3 datatable";
  function handleSelect(event) {
    const selected = event.target.value;

    if (selected === "all") {
      setCurBody(body);
    } else {
      const filtered = body.filter(
        (elem) => elem[filterKey].toLowerCase() === selected.toLowerCase()
      );
      setCurBody(filtered);
    }
  }
  useEffect(() => {
    setCurBody(body);
  }, [body]);
  return (
    <>
      <h4 className="mb-2">
        <b>{title}</b>
      </h4>
      <DatatableWrapper
        body={curBody ? curBody : body}
        headers={header}
        paginationProps={{
          initialState: { page: 1 },
        }}
        paginationOptionsProps={{
          initialState: {
            rowsPerPage: 5,
            options: [5, 10, 15, 20],
          },
        }}
        checkboxProps={{
          onCheckboxChange: function noRefCheck(data, row) {
            console.log("selected", data.nextCheckboxState.selected);
          },
        }}
        sortProps={{
          sortValueObj: {
            name: function noRefCheck() {},
          },
        }}
      >
        <Row className="mb-4">
          <Col xs={12} sm={6} className="d-flex flex-row mt-2">
            <Filter
              placeholder="Tìm kiếm"
              classes={{
                inputGroup: "table-search h-100",
                input: "input-button-group",
                clearButton: "btn-light",
              }}
            />
            {filter && (
              <Form.Select
                aria-label="Default select example"
                onChange={handleSelect}
                className="table-filter ms-3"
              >
                <option value="all">Tất cả</option>
                {filter.map((i) => {
                  return (
                    <option key={`form-select-${i.id}`} value={i.value}>
                      {i.title}
                    </option>
                  );
                })}
              </Form.Select>
            )}
          </Col>
          <Col
            xs={12}
            sm={6}
            className="d-flex flex-row justify-content-end mt-2"
          >
            <PaginationOptions
              alwaysShowPagination
              classes={{ formText: "d-none", formGroup: "text-end" }}
            />
            {children}
          </Col>
        </Row>
        <Card border="light" className="bg-white shadow-sm mb-4">
          <Table hover responsive borderless className={tableClass}>
            <TableHeader classes={{ thead: "thead-light" }} />
            <TableBody
              onRowClick={onRowClick}
              classes={{ td: "align-middle" }}
            />
          </Table>
          <Row className="mx-2 mb-4 p-2">
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-sm-start"
            >
              <BulkCheckboxControl />
            </Col>
            <Col
              xs={12}
              sm={6}
              lg={8}
              className="d-flex flex-col justify-content-end align-items-end"
            >
              <Pagination
                alwaysShowPagination
                paginationRange={3}
                labels={{
                  firstPage: "Đầu",
                  prevPage: <FontAwesomeIcon icon={faAngleLeft} />,
                  nextPage: <FontAwesomeIcon icon={faAngleRight} />,
                  lastPage: "Cuối",
                }}
              />
            </Col>
          </Row>
        </Card>
      </DatatableWrapper>
    </>
  );
};

SampleTable.prototype = {
  title: PropTypes.string,
  header: PropTypes.array,
  body: PropTypes.array,
  onRowClick: PropTypes.func,
  children: PropTypes.node,
  filter: PropTypes.array,
  filterKey: PropTypes.string,
  classes: PropTypes.string,
};

export default SampleTable;
