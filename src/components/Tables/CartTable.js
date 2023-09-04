import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// bootstrap
import { Container, Row, Col, Stack, Button, Form } from "react-bootstrap";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faShoppingBasket,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// project import
import Alerts from "components/Alerts";
import { formatCurrency, updateCart } from "store/requests/user";
import ModalForm from "components/Forms/ModalForm";
import { useSkipper } from "components/Tables/BSTable/Skipper";
import { getAllPackages } from "store/requests/package";
import { calcPrice } from "components/Forms/GroupForm";
import IndeterminateCheckbox from "components/Tables/BSTable/IndeterminateCheckbox";
import DataTable from "components/Tables/BSTable";

// third party
import * as Yup from "yup";
import { HttpStatusCode } from "axios";

const CartTable = ({ userInfo }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.auth.login);
  const { packages } = useSelector((state) => state?.packages);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const [updated, setUpdated] = useState(false);
  const [cart, setCart] = useState(userInfo.cart);
  const [addModal, setAddModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState({
    alertVariant: "danger",
    alertClass: "fixed-top mx-auto",
  });
  const [content, setContent] = useState("");
  useEffect(() => {
    setCart(userInfo.cart);
  }, [userInfo]);
  useEffect(() => {
    getAllPackages(dispatch);
  }, [dispatch]);
  const handleAlert = (title, content, variant) => {
    setTitle(title);
    setContent(content);
    setClasses({
      alertVariant: variant,
      alertClass: "fixed-top mx-auto",
    });
  };
  const handleShowAlert = useCallback((title, content, variant) => {
    handleAlert(title, content, variant);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  }, []);
  const handleAddModal = () => setAddModal(true);
  const handleClose = () => {
    setShowAlert(false);
    setAddModal(false);
  };

  const handleChange = useCallback(
    async (values) => {
      handleClose();
      const cartArr = values.map((item) => {
        const formItem = {
          package: item._id,
          quantity: item.quantity,
          noOfMember: item.noOfMember,
          duration: item.duration,
        };
        return formItem;
      });
      const formData = { cart: cartArr };
      const dataObj = { req: formData, res: values };
      const res = await updateCart(
        userInfo._id,
        currentUser?.accessToken,
        dataObj,
        dispatch
      );
      if (res.statusCode !== HttpStatusCode.Ok) {
        handleShowAlert("Thất bại", res.message, "danger");
      }
    },
    [currentUser?.accessToken, dispatch, handleShowAlert, userInfo._id]
  );
  useEffect(() => {
    if (updated) {
      handleChange(cart);
    }
    setUpdated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updated]);

  const schema = Yup.object().shape({
    packages: Yup.object().required("Bắt buộc"),
    duration: Yup.number()
      .min(1, "Tối thiểu 1 tháng")
      .max(36, "Tối đa 36 tháng")
      .required("Bắt buộc"),
    noOfMember: Yup.number()
      .min(2, "Tối thiểu 2 thành viên")
      .max(30, "Tối đa 30 thành viên")
      .required("Bắt buộc"),
    quantity: Yup.number()
      .min(1, "Tối thiểu 1")
      .max(30, "Tối đa 30")
      .required("Bắt buộc"),
  });
  const addForm = [
    {
      title: "Gói dịch vụ",
      data: { packages: packages, cart: cart },
      showQty: true,
      max: 30,
      min: 1,
      step: 1,
      _Type: "packages-autocomplete",
    },
  ];
  const initValues = {
    packages: null,
    duration: 1,
    noOfMember: 2,
    quantity: 1,
    submit: null,
  };
  // -----Increment Event------
  const increaseQuantity = useCallback(
    (index) => {
      let newState = [...cart];
      newState = newState.map((data, idx) => {
        if (index === idx) {
          if (data.quantity < 30) {
            const updatedData = { ...data, quantity: data.quantity + 1 };
            return updatedData;
          } else return data;
        }
        return data;
      });
      setCart(newState);
      handleChange(newState);
    },
    [handleChange, cart]
  );

  // -----Decrement Event------
  const decreaseQuantity = useCallback(
    (index) => {
      let flag = false;
      let newState = [...cart];
      newState = newState.map((data, idx) => {
        if (index === idx) {
          if (data.quantity > 1) {
            return { ...data, quantity: data.quantity - 1 };
          } else if (data.quantity === 1) {
            flag = true;
          } else return data;
        }
        return data;
      });
      if (flag) {
        newState.splice(index, 1);
      }
      setCart(newState);
      handleChange(newState);
    },
    [handleChange, cart]
  );

  const updateData = (idx, columnID, value) => {
    skipAutoResetPageIndex();
    setCart((oldData) =>
      oldData.map((row, index) => {
        if (index === idx) {
          return {
            ...oldData[idx],
            [columnID]: !value ? "" : Number(value),
          };
        }
        return row;
      })
    );
  };
  const onRemove = useCallback(
    (index) => {
      const newState = [...cart];

      newState.splice(index, 1);
      setCart(newState);
      handleChange(newState);
    },
    [handleChange, cart]
  );

  const onAdd = useCallback(
    (values) => {
      let newState = [...cart];
      const idx = cart.findIndex((elem) => {
        if (
          elem._id === values.packages._id &&
          elem.duration === Number(values.duration) &&
          elem.noOfMember === Number(values.noOfMember)
        )
          return true;
        else return false;
      });
      if (idx !== -1) {
        newState = newState.map((data, index) => {
          if (index === idx) {
            return { ...data, quantity: values.quantity };
          }
          return data;
        });
      } else {
        const newItem = {
          _id: values.packages._id,
          name: values.packages.name,
          duration: Number(values.duration),
          price: calcPrice(
            values.duration,
            values.packages.price,
            Number(values.duration),
            values.packages.coefficient
          ),
          noOfMember: Number(values.noOfMember),
          coefficient: values.packages.coefficient,
          description: values.packages.description,
          quantity: values.quantity,
        };
        newState.push(newItem);
      }
      setCart(newState);
      handleChange(newState);
    },
    [handleChange, cart]
  );
  const onBulkRemove = useCallback(
    (rowsSelected) => {
      let newState = [...cart];
      newState = newState.filter((elem) => {
        if (rowsSelected.some((item) => item.original === elem)) {
          return false;
        } else {
          return true;
        }
      });
      setCart(newState);
      handleChange(newState);
    },
    [handleChange, cart]
  );
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
        header: "Mã gói",
        accessorKey: "_id",
        enableColumnFilter: false,
        hide: true,
        showFooter: true,
      },
      {
        header: "Gói dịch vụ",
        accessorKey: "name",
        showFooter: true,
        enableColumnFilter: false,
      },
      {
        header: "Thời hạn",
        accessorFn: (row) => `${row.duration} tháng`,
        classes: "text-end",
        showFooter: true,
        colSpan: 3,
        classesFooter: "text-end",
        enableColumnFilter: false,
        footer: ({ table }) => (
          <>
            Sản phẩm trong giỏ:{" "}
            <span className="text-danger fw-bolder">
              {table
                .getCoreRowModel()
                .flatRows.reduce(
                  (acc, data) => acc + data.original.quantity,
                  0
                )}
            </span>
          </>
        ),
      },
      {
        header: "Thành viên",
        accessorKey: "noOfMember",
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
        enableGlobalFilter: false,
        showFooter: true,
        colSpan: 2,
        classesFooter: "text-end",
        enableColumnFilter: false,
        footer: ({ table }) => (
          <>
            Tổng tiền:{" "}
            <span className="text-danger fw-bolder">
              {formatCurrency(
                table
                  .getCoreRowModel()
                  .flatRows.reduce(
                    (acc, data) =>
                      acc + data.original.price * data.original.quantity,
                    0
                  )
              )}
            </span>
          </>
        ),
        cell: function Cell({
          getValue,
          row: { index },
          column: { id },
          table,
        }) {
          const initialValue = getValue();
          const [value, setValue] = useState(initialValue);
          const onBlur = () => {
            table.options.meta?.updateData(index, id, value);
            setUpdated(true);
          };
          useEffect(() => {
            setValue(initialValue);
          }, [initialValue]);
          return (
            <Stack
              direction="horizontal"
              gap={1}
              className="justify-content-center"
            >
              <Button
                variant="outline-secondary"
                size="sm"
                className="btn-qty"
                onClick={() => decreaseQuantity(index)}
              >
                <FontAwesomeIcon icon={faMinus} />
              </Button>
              <Form.Control
                className="text-center"
                style={{
                  width: "3.5rem",
                  minWidth: "2rem",
                }}
                size="sm"
                value={value}
                name="quantity"
                onBlur={onBlur}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
              <Button
                variant="outline-secondary"
                size="sm"
                className="btn-qty"
                onClick={() => increaseQuantity(index)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            </Stack>
          );
        },
      },
      {
        header: "Tổng",
        accessorFn: (row) => `${formatCurrency(row.price * row.quantity)}`,
        classes: "text-end",
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
              onClick={(e) => onRemove(row.index)}
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
    [onRemove, decreaseQuantity, increaseQuantity]
  );
  return (
    <Container>
      <Alerts
        show={showAlert}
        handleClose={handleClose}
        title={title}
        classes={classes}
      >
        {content}
      </Alerts>
      <ModalForm
        show={addModal}
        title="Thêm sản phẩm"
        handleClose={handleClose}
        handleSubmit={onAdd}
        handleAlert={handleShowAlert}
        schema={schema}
        initValues={initValues}
        forms={addForm}
      />
      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-table-cell">
          <DataTable
            data={cart}
            columns={columns}
            classes={{ table: "mx-auto align-middle" }}
            title={
              <>
                <FontAwesomeIcon icon={faShoppingBasket} /> Giỏ hàng (
                {cart?.length})
              </>
            }
            emptyItem={{ label: "Giỏ hàng trống", icon: faShoppingBasket }}
            titleAdd="Thêm vào giỏ hàng"
            handleBulkRemove={onBulkRemove}
            handleAdd={handleAddModal}
            enableFooter={true}
            layout="mini"
            updateData={updateData}
            autoResetPageIndex={autoResetPageIndex}
          />
        </Col>
      </Row>
    </Container>
  );
};
export default memo(CartTable);
