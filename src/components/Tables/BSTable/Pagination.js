import PropTypes from "prop-types";
import { Pagination } from "@mui/material";
import { Button, Form, Stack } from "react-bootstrap";

const PaginationTable = ({ table, enablePagination = true }) => {
  return (
    <>
      {enablePagination && (
        <div className="d-flex flex-row bd-highlight flex-wrap gap-3 m-4">
          <Stack direction="horizontal" gap={2} className="bd-highlight">
            <span>Hiển thị</span>
            <Form.Select
              aria-label="pagination-options"
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              value={table.getState().pagination.pageSize}
            >
              {[3, 5, 10, 15, 20].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </Form.Select>
            <span>dòng</span>
            {table.getSelectedRowModel().flatRows.length > 0 && (
              <>
                <div className="vr" />
                <span>
                  Đã chọn {table.getSelectedRowModel().flatRows.length} dòng.
                </span>
                {table.getIsAllRowsSelected() ? (
                  <Button
                    variant="link"
                    onClick={() => {
                      table.resetRowSelection(true);
                    }}
                  >
                    Bỏ chọn
                  </Button>
                ) : (
                  <Button
                    variant="link"
                    onClick={() => {
                      table.toggleAllRowsSelected(true);
                    }}
                  >
                    Chọn tất cả
                  </Button>
                )}
              </>
            )}
          </Stack>
          <div className="bd-highlight ms-auto">
            <Pagination
              count={table.getPageCount()}
              siblingCount={1}
              boundaryCount={0}
              variant="outlined"
              color="secondary"
              onChange={(event, value) => {
                table.setPageIndex(value - 1);
              }}
              showFirstButton
              showLastButton
            />
          </div>
        </div>
      )}
    </>
  );
};
PaginationTable.prototype = {
  table: PropTypes.any,
  enablePagination: PropTypes.bool,
};
export default PaginationTable;
