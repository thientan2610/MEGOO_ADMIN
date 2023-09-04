import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";

const Modals = ({
  title,
  children,
  show,
  handleClose,
  classes,
  size,
  handleConfirm,
}) => {
  return (
    <Modal show={show} onHide={handleClose} scrollable size={size ? size : ""}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

Modals.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  show: PropTypes.bool,
  children: PropTypes.node,
  size: PropTypes.string,
  handleClose: PropTypes.func,
};

export default Modals;
