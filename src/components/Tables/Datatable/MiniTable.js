import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// bootstrap
import { Col, Row, Table, Card, Form } from "react-bootstrap";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  TableBody,
  TableHeader,
  BulkCheckboxControl,
} from "react-bs-datatable";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const MiniTable = ({
  title,
  header,
  body,
  onRowClick,
  children,
  filter,
  filterKey,
  rowsPerPage,
}) => {
  const [curBody, setCurBody] = useState(body);
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
      <Card border="light" className="bg-white shadow-sm mb-2 h-100">
        <Card.Body>
          <DatatableWrapper
            body={curBody ? curBody : body}
            headers={header}
            paginationProps={{
              initialState: { page: 1 },
            }}
            paginationOptionsProps={{
              initialState: {
                rowsPerPage: rowsPerPage ? rowsPerPage : 5,
              },
            }}
            checkboxProps={{
              onCheckboxChange: function noRefCheck(data, row) {
                alert(data.nextCheckboxState.selected[1]);
              },
            }}
            sortProps={{
              sortValueObj: {
                name: function noRefCheck() {},
              },
            }}
          >
            <Row className="mb-4">
              <Col
                xs={12}
                sm={6}
                className="d-flex flex-row mt-2 ps-4 justify-content-start"
              >
                <h5 className="mb-2">
                  <b>{title}</b>
                </h5>
              </Col>
              <Col
                xs={12}
                sm={6}
                className="d-flex flex-row mt-2 pe-5 justify-content-end"
              >
                {filter && (
                  <Form.Select
                    aria-label="Default select example"
                    onChange={handleSelect}
                    className="table-filter me-3"
                  >
                    <option value="all">Tất cả</option>
                    {filter.map((i) => {
                      return (
                        <option
                          key={`mini-form-select-${i.id}`}
                          value={i.value}
                        >
                          {i.title}
                        </option>
                      );
                    })}
                  </Form.Select>
                )}
                <Filter
                  placeholder="Tìm kiếm"
                  classes={{
                    inputGroup: "table-search h-100",
                    input: "input-button-group",
                    clearButton: "btn-light",
                  }}
                />
              </Col>
            </Row>
            <Table
              hover
              responsive
              borderless
              className="mx-auto mt-2 overflow-hidden text-start align-middle datatable"
            >
              <TableHeader classes={{ thead: "thead-light" }} />
              <TableBody onRowClick={onRowClick} />
            </Table>
            <Row className="mx-2 mb-2 p-2">
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
                className="d-flex flex-col justify-content-end align-items-end "
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
          </DatatableWrapper>
        </Card.Body>
      </Card>
    </>
  );
};

MiniTable.prototype = {
  title: PropTypes.string,
  header: PropTypes.array,
  body: PropTypes.array,
  onRowClick: PropTypes.func,
  children: PropTypes.node,
  filter: PropTypes.array,
  filterKey: PropTypes.string,
  rowsPerPage: PropTypes.number,
};

export default MiniTable;
