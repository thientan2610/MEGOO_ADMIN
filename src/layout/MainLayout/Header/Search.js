//Bootstrap
import { Form, InputGroup } from "react-bootstrap";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const InputGroupTxtStyle = {
  color: "#66799e",
  borderColor: "#93a5be",
  fontSize: "0.875rem",
  borderRight: 0,
};

const Search = ({ values, handleChange }) => (
  <div className="d-flex align-items-center">
    <Form>
      <Form.Group id="topbarSearch">
        <InputGroup className="my-auto">
          <InputGroup.Text style={InputGroupTxtStyle}>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Tìm kiếm"
            aria-label="Search"
            value={values}
            onChange={handleChange}
          />
        </InputGroup>
      </Form.Group>
    </Form>
  </div>
);

export default Search;
