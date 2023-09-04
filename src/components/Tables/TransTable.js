import React, { useMemo, useState } from "react";

// bootstrap
import { Image, Button, Col, Row, Container } from "react-bootstrap";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import VnPayLogo from "assets/payment/VnPay.png";
import ZaloPayLogo from "assets/payment/ZaloPay.png";

// project import
import Modals from "components/Modal";
import ReceiptWidget from "components/Widgets/ReceiptWidget";
import IndeterminateCheckbox from "./BSTable/IndeterminateCheckbox";
import Datatable from "components/Tables/BSTable";

const TransTable = ({ trans, userInfo }) => {
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const handleClose = () => {
    setShowReceipt(false);
  };
  function onRowClick(data) {
    setReceipt(trans.filter((item) => item._id === data._id).at(0));
    setShowReceipt(true);
  }
  const columns = useMemo(
    () => [
      {
        accessorKey: "select",
        classes: "text-center",
        enableSorting: false,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        showFooter: true,
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      {
        header: "No.",
        accessorKey: "_id",
        enableColumnFilter: false,
      },
      {
        header: "Tổng tiền",
        accessorKey: "amount_vnd",
        enableColumnFilter: false,
        classes: "text-end",
      },
      {
        header: "Phương thức",
        accessorKey: "wallet",
        classes: "text-center",
        cell: ({ row }) => (
          <Image
            src={row.original.wallet === "ZaloPay" ? ZaloPayLogo : VnPayLogo}
            className="payment-logo mx-auto"
            alt={row.wallet}
          />
        ),
      },
      {
        header: "Ngày lập",
        accessorKey: "createdAt",
        cell: ({ row }) => (
          <span>
            <FontAwesomeIcon icon={faClock} /> {row.original.createdAt}
          </span>
        ),
        enableColumnFilter: false,
      },
      {
        header: null,
        accessorKey: "actions",
        showFooter: true,
        enableColumnFilter: false,
        cell: ({ row }) => {
          return (
            <Button
              className="btn-table-options"
              // onClick={(e) => onRemove(row.index)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          );
        },
        classes: "text-center",
        enableSorting: false,
        enableGlobalFilter: false,
      },
    ],
    []
  );
  return (
    <Container>
      <Modals
        title="Hóa đơn"
        show={showReceipt}
        handleClose={handleClose}
        handleConfirm={handleClose}
        size="lg"
      >
        <ReceiptWidget trans={receipt} userInfo={userInfo} />
      </Modals>
      <Row className="justify-content-md-center mt-0">
        <Col xs={12} className="mb-4 d-table-cell">
          <Datatable
            data={trans}
            columns={columns}
            classes={{ table: "mx-auto align-middle" }}
            title={
              <>
                <FontAwesomeIcon icon={faReceipt} /> Lịch sử giao dịch
              </>
            }
            emptyItem={{ label: "Lịch sử giao dịch trống", icon: faReceipt }}
            onRowClick={onRowClick}
            layout="mini"
          />
        </Col>
      </Row>
    </Container>
  );
};
export default TransTable;
