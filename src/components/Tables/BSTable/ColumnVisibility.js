import { useMemo } from "react";
import { capitalizeFirstLetter } from "store/requests/user";

const { CheckboxDropdown } = require("components/DropdownWithCheck");

const ColumnVisibility = ({ table }) => {
  const handleAllChecked = (checked) => {
    table.toggleAllColumnsVisible(checked);
  };
  const handleNoneChecked = () => {
    const uncheckedCol = table.getAllLeafColumns().filter((column) => {
      if (column.id === "deleted") return false;
      return true;
    });
    uncheckedCol.map((item) => item.toggleVisibility(false));
  };
  const checkItems = table
    .getAllLeafColumns()
    .filter((column) => {
      if (
        column.id === "select" ||
        column.id === "actions" ||
        column.id === "deleted"
      )
        return false;
      return true;
    })
    .map((column) => {
      const handleChecked = (checked) => {
        column.toggleVisibility(checked);
      };
      return {
        id: column.id,
        label: column.columnDef.header
          ? column.columnDef.header
          : capitalizeFirstLetter(column.columnDef.accessorKey),
        checked: column.getIsVisible(),
        handleChecked: handleChecked,
      };
    });
  const deletedColumn = table
    .getHeaderGroups()
    .flatMap((headerGroup) =>
      headerGroup.headers.filter(
        (header) =>
          header.column.getCanFilter() && header?.column?.id === "deleted"
      )
    );
  return (
    <CheckboxDropdown
      items={checkItems}
      handleAllSelect={handleAllChecked}
      handleNoneSelect={handleNoneChecked}
      column={deletedColumn?.at(0)?.column}
    />
  );
};

export default ColumnVisibility;
