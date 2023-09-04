import { memo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import SampleTable from "../SampleTable";
import PaginationTable from "../Pagination";
import MainHeader from "./../Header/MainHeader";

// ==============================|| TABLE - MAIN LAYOUT ||============================== //

const MiniLayout = (props) => {
  const {
    table,
    enablePagination = true,
    filterColumns,
    handleFilter,
    globalFiltering,
  } = props;
  return (
    <Row>
      <Col xs={12}>
        <MainHeader
          table={table}
          filterColumns={filterColumns}
          handleFilter={handleFilter}
          globalFiltering={globalFiltering}
          {...props}
        />
      </Col>
      <Col xs={12}>
        <Card border="light" className="bg-white shadow-sm h-100">
          <Card.Body>
            <>
              <SampleTable table={table} {...props} />
              <PaginationTable
                table={table}
                enablePagination={enablePagination}
              />
            </>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
export default memo(MiniLayout);
