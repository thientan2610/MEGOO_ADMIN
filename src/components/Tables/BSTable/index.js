import { memo, useState } from "react";
import PropTypes from "prop-types";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import MiniLayout from "./Layout/MiniLayout";
import MainLayout from "./Layout/MainLayout";
import SampleTable from "./SampleTable";

const DataTable = (props) => {
  const {
    columns,
    data,
    enablePagination = true,
    updateData,
    autoResetPageIndex,
    layout = "main",
  } = props;
  const initVisibility = (columns) => {
    let res = {};
    Array.isArray(columns) &&
      // eslint-disable-next-line array-callback-return
      columns.map((column) => {
        if (column?.hide) res[column.accessorKey] = false;
      });
    return res;
  };
  const [sorting, setSorting] = useState([]);
  const [globalFiltering, setGlobalFiltering] = useState("");
  const [columnFiltering, setColumnFiltering] = useState([
    { id: "deleted", value: false },
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState(
    initVisibility(columns)
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting,
      globalFilter: globalFiltering,
      rowSelection: rowSelection,
      columnVisibility: columnVisibility,
      columnFilters: columnFiltering,
    },
    initialState: enablePagination
      ? { enablePagination: { pageSize: 3 } }
      : null,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFiltering,
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableRowSelection: true,
    autoResetPageIndex,
    meta: { updateData },
    debugTable: true,
  });
  // useEffect(() => {
  //   table.getHeaderGroups().map((headerGroup) => {
  //     headerGroup.headers.map((header) => {
  //       console.log("headers", header);
  //     });
  //   });
  //   table.getRowModel().rows.map((row) => {
  //     row.getVisibleCells().map((cell) => {
  //       console.log("body", cell);
  //     });
  //   });
  // }, [table]);
  const handleFilter = (event) => {
    setGlobalFiltering(event.target.value);
  };
  const filterColumns = table
    .getHeaderGroups()
    .flatMap((headerGroup) =>
      headerGroup.headers.filter(
        (header) =>
          header.column.getCanFilter() && header.column.id !== "deleted"
      )
    );
  return (
    <>
      {layout === "main" && (
        <MainLayout
          {...props}
          table={table}
          handleFilter={handleFilter}
          filterColumns={filterColumns}
          globalFiltering={globalFiltering}
        />
      )}
      {layout === "mini" && (
        <MiniLayout
          {...props}
          table={table}
          handleFilter={handleFilter}
          filterColumns={filterColumns}
          globalFiltering={globalFiltering}
        />
      )}
      {layout === "none" && <SampleTable table={table} {...props} />}
    </>
  );
};

DataTable.prototype = {
  data: PropTypes.array,
  columns: PropTypes.array,
  enablePagination: PropTypes.bool,
  updateData: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleAdd: PropTypes.string,
  classes: PropTypes.object,
  enableGlobalFilter: PropTypes.bool,
  handleBulkRemove: PropTypes.func,
  handleAdd: PropTypes.func,
  emptyItem: PropTypes.object,
  onRowClick: PropTypes.func,
  layout: PropTypes.oneOf(["main", "mini", "none"]),
};

export default memo(DataTable);
