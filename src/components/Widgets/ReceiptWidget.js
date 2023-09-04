// bootstrap
import { Row, Col, Image } from "react-bootstrap";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faUser } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import VnPayLogo from "assets/payment/VnPay.png";
import ZaloPayLogo from "assets/payment/ZaloPay.png";

import { formatCurrency } from "store/requests/user";
import { useMemo } from "react";
import DataTable from "components/Tables/BSTable";

// ==============================|| Receipt Widget ||============================== //
const ReceiptWidget = ({ trans, userInfo }) => {
  const columns = useMemo(
    () => [
      {
        header: "Mã",
        accessorKey: "id",
        hide: true,
        enableColumnFilter: false,
      },
      {
        header: "Mặt hàng",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Thành viên",
        accessorKey: "noOfMember",
        classes: "text-center",
        enableColumnFilter: false,
      },
      {
        header: "Thời hạn",
        accessorFn: (row) => `${row.duration} tháng`,
        classes: "text-center",
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${formatCurrency(row.price)}`,
        header: "Đơn giá",
        classes: "text-end",
        enableColumnFilter: false,
      },
      {
        header: "Số lượng",
        accessorKey: "quantity",
        classes: "text-center",
        enableColumnFilter: false,
      },
      {
        header: "Tổng",
        accessorFn: (row) => `${formatCurrency(row.price * row.quantity)}`,
        classes: "text-end",
        enableColumnFilter: false,
      },
    ],
    []
  );
  return (
    <>
      <Row>
        <Col xs={12} lg={6} className="ps-3">
          <FontAwesomeIcon icon={faUser} /> <b>Khách hàng: </b> {userInfo.name}
        </Col>
        <Col xs={12} lg={6} className="ps-3">
          <FontAwesomeIcon icon={faReceipt} /> <b>Hóa đơn: </b>
          {trans._id}
        </Col>
      </Row>
      <div className="d-flex flex-row justify-content-between"></div>
      <hr className="dash" />
      <DataTable
        data={trans.item}
        columns={columns}
        classes={{ table: "w-100 align-middle" }}
        layout="none"
      />
      {/* <hr className="dash" /> */}
      <Row>
        <Col xs={6}>
          <h6 className="fw-bold ps-2">Thành tiền: </h6>
        </Col>
        <Col xs={6} className="text-end pe-4">
          {trans.amount_vnd}
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <h6 className="fw-bold ps-2">Thuế: </h6>
        </Col>
        <Col xs={6} className="text-end pe-4">
          {formatCurrency(0)}
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <h6 className="fw-bold ps-2">Giảm giá: </h6>
        </Col>
        <Col xs={6} className="text-end pe-4">
          {formatCurrency(0)}
        </Col>
      </Row>
      <hr className="dash" />
      <Row>
        <Col xs={6}>
          <h5 className="fw-bold ps-2">Tổng tiền: </h5>
        </Col>
        <Col xs={6} className="text-end pe-4">
          {trans.amount_vnd}
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <h5 className="fw-bold ps-2">Phương thức </h5>
        </Col>
        <Col xs={6} className="pe-4">
          <Image
            src={trans.wallet === "ZaloPay" ? ZaloPayLogo : VnPayLogo}
            className="payment-logo"
            style={{ float: "right" }}
            alt={trans.wallet}
          />
        </Col>
      </Row>
      <hr className="dash" />
      <div className="text-end pe-2">
        <FontAwesomeIcon icon={faClock} /> {trans.createdAt}
      </div>
    </>
  );
};

export default ReceiptWidget;
