import React from "react";
import DebouncedSelect from "./DebouncedSelect";

function Filter({ column }) {
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column]
  );
  return (
    <DebouncedSelect
      value={columnFilterValue ?? ""}
      onChange={(value) => column.setFilterValue(value)}
      list={sortedUniqueValues.slice(0, 5000)}
    />
  );
}

export default Filter;
