import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Stack } from "react-bootstrap";
import ColumnVisibility from "../ColumnVisibility";
import Search from "layout/MainLayout/Header/Search";
import Filter from "../FilterFunction";
import PropTypes from "prop-types";

// ==============================|| TABLE - MAIN HEADER ||============================== //

const MainHeader = ({
  title,
  table,
  classes,
  titleAdd,
  filterColumns,
  globalFiltering,
  enableGlobalFilter = true,
  handleBulkRemove,
  handleAdd,
  handleFilter,
}) => {
  return (
    <>
      <h4 className="mb-4">
        <b>{title}</b>
      </h4>
      <div className="d-flex flex-row bd-highlight flex-wrap mb-4 mt-2 me-4 gap-3">
        <Stack className="bd-highlight me-auto" gap={3} direction="horizontal">
          {enableGlobalFilter && (
            <Search values={globalFiltering} handleChange={handleFilter} />
          )}
          {filterColumns &&
            filterColumns.map((header) => <Filter column={header.column} />)}
        </Stack>
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
              {titleAdd && <span className={`fw-bold ms-2`}>{titleAdd}</span>}
            </Button>
          )}
          <ColumnVisibility table={table} />
        </Stack>
      </div>
    </>
  );
};

MainHeader.prototype = {
  table: PropTypes.any,
  titleAdd: PropTypes.string,
  filterColumns: PropTypes.array,
  classes: PropTypes.object,
  enableGlobalFilter: PropTypes.bool,
  globalFiltering: PropTypes.string,
  handleBulkRemove: PropTypes.func,
  handleAdd: PropTypes.func,
  handleFilter: PropTypes.func,
};

export default MainHeader;
