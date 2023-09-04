import React, { memo } from "react";
import PropTypes from "prop-types";
import { Table } from "react-bootstrap";
import { flexRender } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

const SampleTable = ({ table, classes, enableFooter = false, onRowClick }) => {
  return (
    <Table hover responsive borderless className={classes.table}>
      <thead className="thead-light">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <>
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                  className={header.column.columnDef.classes}
                >
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: (
                          <FontAwesomeIcon icon={faCaretUp} className="ms-1" />
                        ),
                        desc: (
                          <FontAwesomeIcon
                            icon={faCaretDown}
                            className="ms-1"
                          />
                        ),
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              </>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={`${cell.column.columnDef.classes} py-1`}
                style={cell.column.columnDef.style}
                onClick={() => {
                  if (
                    cell.column.id !== "select" &&
                    cell.column.id !== "actions" &&
                    !cell.column.columnDef.disableRowClick
                  ) {
                    onRowClick && onRowClick(row.original);
                  }
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {enableFooter && (
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <>
                  {header.column.columnDef.showFooter && (
                    <th
                      key={header.id}
                      colSpan={
                        header.column.columnDef.colSpan
                          ? header.column.columnDef.colSpan
                          : header.colSpan
                      }
                      className={header.column.columnDef.classesFooter}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  )}
                </>
              ))}
            </tr>
          ))}
        </tfoot>
      )}
    </Table>
  );
};

SampleTable.propTypes = {
  table: PropTypes.any,
  enableFooter: PropTypes.bool,
  onRowClick: PropTypes.func,
  classes: PropTypes.object,
};

export default memo(SampleTable);
