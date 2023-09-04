import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Stack } from "react-bootstrap";
import ColumnVisibility from "../ColumnVisibility";
import Search from "layout/MainLayout/Header/Search";
import Filter from "../FilterFunction";
import PropTypes from "prop-types";

// ==============================|| TABLE - MINI HEADER ||============================== //

const MiniHeader = ({
  table,
  classes,
  title,
  filterColumns,
  enableGlobalFilter = true,
  enableHeader = true,
  globalFiltering,
  handleBulkRemove,
  handleAdd,
  handleFilter,
}) => {
  return (
    <>
      {enableHeader && (
        <div className="d-flex flex-row bd-highlight flex-wrap mb-4 mt-2 ms-4 me-4 gap-3">
          {title && (
            <h5 className="bd-highlight me-auto">
              <b>{title}</b>
            </h5>
          )}
          <Stack direction="horizontal" gap={3} className="bd-highlight">
            {table.getSelectedRowModel().flatRows.length > 0 && (
              <Button
                variant="secondary"
                onClick={(e) => {
                  handleBulkRemove(table.getSelectedRowModel().flatRows);
                  table.resetRowSelection(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            )}
            {handleAdd && (
              <Button
                variant="primary"
                onClick={handleAdd}
                className={`${classes.addBtn}`}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            )}
            {table.getSelectedRowModel().flatRows.length > 0 || handleAdd ? (
              <div className="vr" />
            ) : null}
            {filterColumns &&
              filterColumns.map((header) => <Filter column={header.column} />)}
          </Stack>
          <Stack className="bd-highlight" gap={3} direction="horizontal">
            {enableGlobalFilter && (
              <Search values={globalFiltering} handleChange={handleFilter} />
            )}
            <ColumnVisibility table={table} />
          </Stack>
        </div>
      )}
    </>
  );
};

MiniHeader.prototype = {
  table: PropTypes.any,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  filterColumns: PropTypes.array,
  classes: PropTypes.object,
  enableGlobalFilter: PropTypes.bool,
  enableHeader: PropTypes.bool,
  globalFiltering: PropTypes.string,
  handleBulkRemove: PropTypes.func,
  handleAdd: PropTypes.func,
  handleFilter: PropTypes.func,
};

export default MiniHeader;
