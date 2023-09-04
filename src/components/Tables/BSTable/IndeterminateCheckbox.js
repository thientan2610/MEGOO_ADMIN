import { Checkbox } from "@mui/material";
import React from "react";

function IndeterminateCheckbox({ indeterminate, ...rest }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, indeterminate]);
  const label = { inputProps: { "aria-label": "rowSelection" } };
  return (
    <Checkbox
      {...label}
      ref={ref}
      indeterminate={indeterminate}
      {...rest}
      size="small"
      sx={{ p: 0 }}
    />
  );
}

export default IndeterminateCheckbox;
