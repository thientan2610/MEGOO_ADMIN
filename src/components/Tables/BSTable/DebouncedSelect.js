import React from "react";
import { Form } from "react-bootstrap";
import { capitalizeFirstLetter } from "store/requests/user";

function DebouncedSelect({
  value: initialValue,
  onChange,
  debounce = 500,
  list,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Form.Select
      aria-label="debounced-select"
      onChange={(e) => setValue(e.target.value)}
      {...props}
    >
      <option value="">Tất cả</option>
      {list.map((i) => {
        return (
          <option key={`form-select-${i.id}`} value={i}>
            {capitalizeFirstLetter(i.toString())}
          </option>
        );
      })}
    </Form.Select>
  );
}

export default DebouncedSelect;
