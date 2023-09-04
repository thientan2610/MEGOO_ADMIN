import {
  faFilterCircleXmark,
  faGear,
  faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import {
  Button,
  ButtonGroup,
  Dropdown,
  Form,
  ListGroup,
  Nav,
  Tab,
} from "react-bootstrap";

const CheckboxMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`${className} CheckboxMenu`}
        aria-labelledby={labeledBy}
      >
        <ListGroup style={{ maxHeight: "calc(100vh)", overflow: "none" }}>
          {children}
        </ListGroup>
      </div>
    );
  }
);

const CheckDropdownItem = React.forwardRef(
  ({ children, id, checked, onChange }, ref) => {
    return (
      <Form.Group
        ref={ref}
        controlId={id}
        className="dropdown-item mb-0 d-flex justify-content-between align-items-center"
      >
        <span>{children}</span>
        <Form.Check
          type="switch"
          checked={checked}
          onChange={onChange && onChange.bind(onChange, id)}
        />
      </Form.Group>
    );
  }
);

export const CheckboxDropdown = ({
  items,
  handleAllSelect,
  handleNoneSelect,
  column,
}) => {
  const handleSelectAll = () => {
    items.forEach((i) => (i.checked = true));
    handleAllSelect(true);
  };
  const handleSelectNone = () => {
    items.forEach((i) => (i.checked = false));
    handleNoneSelect();
  };
  const handleSelect = (key, event) => {
    items.find((i) => i.id === key).checked = event.target.checked;
    items.find((i) => i.id === key).handleChecked(event.target.checked);
  };

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle variant="light">
        <FontAwesomeIcon icon={faGear} />
      </Dropdown.Toggle>

      <Dropdown.Menu variant="light" as={CheckboxMenu}>
        {column ? (
          <Tab.Container id="list-group-tabs-example" defaultActiveKey={1}>
            <Nav fill className="nav-dropdown">
              <Nav.Item>
                <Nav.Link eventKey={1}>
                  <FontAwesomeIcon icon={faTableColumns} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey={2}>
                  <FontAwesomeIcon icon={faFilterCircleXmark} />
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey={1}>
                {items.map((i) => (
                  <Dropdown.Item
                    key={i.id}
                    as={CheckDropdownItem}
                    id={i.id}
                    checked={i.checked}
                    onChange={handleSelect}
                  >
                    {i.label}
                  </Dropdown.Item>
                ))}
                <ListGroup.Item
                  className="dropdown-item border-top pt-2 pb-0"
                  style={{ backgroundColor: "inherit" }}
                >
                  <ButtonGroup size="sm">
                    <Button variant="link" onClick={handleSelectAll}>
                      Chọn tất cả
                    </Button>
                    <Button variant="link" onClick={handleSelectNone}>
                      Bỏ Chọn
                    </Button>
                  </ButtonGroup>
                </ListGroup.Item>
              </Tab.Pane>
              <Tab.Pane eventKey={2}>
                <ListGroup.Item
                  action
                  active={typeof column.getFilterValue() === "undefined"}
                  onClick={() => column.setFilterValue()}
                >
                  Tất cả
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={column.getFilterValue() === true}
                  onClick={() => column.setFilterValue(true)}
                >
                  Đã xóa
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={column.getFilterValue() === false}
                  onClick={() => column.setFilterValue(false)}
                >
                  Chưa xóa
                </ListGroup.Item>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        ) : (
          <>
            {items.map((i) => (
              <Dropdown.Item
                key={i.id}
                as={CheckDropdownItem}
                id={i.id}
                checked={i.checked}
                onChange={handleSelect}
              >
                {i.label}
              </Dropdown.Item>
            ))}
            <ListGroup.Item
              className="dropdown-item border-top pt-2 pb-0"
              style={{ backgroundColor: "inherit" }}
            >
              <ButtonGroup size="sm">
                <Button variant="link" onClick={handleSelectAll}>
                  Chọn tất cả
                </Button>
                <Button variant="link" onClick={handleSelectNone}>
                  Bỏ Chọn
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
