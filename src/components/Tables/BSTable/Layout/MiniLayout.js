import { memo } from "react";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Stack } from "react-bootstrap";
import SampleTable from "../SampleTable";
import PaginationTable from "../Pagination";
import MiniHeader from "./../Header/MiniHeader";

// ==============================|| TABLE - MAIN LAYOUT ||============================== //

const MiniLayout = (props) => {
  const {
    table,
    title,
    data,
    titleAdd,
    enablePagination = true,
    handleAdd,
    emptyItem,
    filterColumns,
    handleFilter,
    globalFiltering,
  } = props;
  return (
    <Card border="light" className="bg-white shadow-sm h-100">
      <Card.Body>
        {!data || data.length === 0 ? (
          <>
            <div className="d-flex flex-row justify-content-between mx-4 my-2">
              <h5>
                <b>{title}</b>
              </h5>
              {handleAdd && (
                <Button
                  variant="primary"
                  className="fw-bolder"
                  onClick={handleAdd}
                >
                  <FontAwesomeIcon icon={faPlus} />{" "}
                  {titleAdd && (
                    <span className={`fw-bold ms-2`}>{titleAdd}</span>
                  )}
                </Button>
              )}
            </div>
            <Stack direction="vertical">
              <div className="icon icon-xl">
                <FontAwesomeIcon
                  icon={emptyItem.icon}
                  className="text-quinary"
                />
              </div>
              <h5 className="text-quinary text-center my-3">
                {emptyItem.label}
              </h5>
            </Stack>
          </>
        ) : (
          <>
            <MiniHeader
              table={table}
              filterColumns={filterColumns}
              handleFilter={handleFilter}
              globalFiltering={globalFiltering}
              {...props}
            />
            <SampleTable table={table} {...props} />
            <PaginationTable
              table={table}
              enablePagination={enablePagination}
            />
          </>
        )}
      </Card.Body>
    </Card>
  );
};
export default memo(MiniLayout);
