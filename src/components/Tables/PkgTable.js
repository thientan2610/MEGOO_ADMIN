import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// bootstrap
import {
  Col,
  Container,
  Dropdown,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";

// assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSuitcase,
  faStopwatch,
  faUsers,
  faCoins,
  faWaveSquare,
  faTrashArrowUp,
  faEllipsisVertical,
  faShapes,
  faPiggyBank,
  faListUl,
  faHandScissors,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays, faClock } from "@fortawesome/free-regular-svg-icons";

// data
import {
  getAllPackages,
  createPackage,
  updatePackage,
} from "store/requests/package";

// project import
import Modals from "components/Modal";
import ModalForm from "components/Forms/ModalForm";
import Alerts from "components/Alerts";
import { removePackage, restorePackage } from "store/requests/package";

// third party
import * as Yup from "yup";
import { HttpStatusCode } from "axios";
import IndeterminateCheckbox from "./BSTable/IndeterminateCheckbox";
import DataTable from "components/Tables/BSTable";

const PackageTable = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.auth.login);
  const { packages } = useSelector((state) => state.packages);
  const [showModal, setShowModal] = useState(false);
  const [showExModal, setShowExModal] = useState(false);
  const [addAction, setAddAction] = useState(false);
  const [showModalForm, setShowModalForm] = useState(false);
  const [action, setAction] = useState();
  const [selected, setSelected] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState({
    alertVariant: "danger",
    alertClass: "fixed-top mx-auto",
  });
  const [initValues, setInitValues] = useState({
    name: "",
    duration: 1,
    noOfMember: 2,
    editableDuration: false,
    editableNoOfMember: false,
    price: 1000,
    description: null,
    coefficient: 1000,
    submit: null,
  });
  useEffect(() => {
    getAllPackages(dispatch);
  }, [dispatch]);
  const handleAction = useCallback((row, action) => {
    if (typeof action === "object") {
      const valuesArray = Object.values(action);
      action = valuesArray.join("").trim();
    }
    setAction(action);
    setSelected(row);
    if (action === "remove") {
      setContent(`Bạn có chắc chắn muốn xóa gói ${row.name}?`);
    } else if (action === "restore") {
      setContent(`Bạn có chắc chắn muốn khôi phục gói ${row.name}?`);
    }
    setShowModal(true);
  }, []);
  const handleConfirm = async () => {
    setShowModal(false);
    let res;
    let error = false;
    if (action === "remove") {
      console.log("row", selected._id);
      res = await removePackage(selected._id, dispatch);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Xóa gói thành công", "success");
      } else error = true;
    } else if (action === "restore") {
      res = await restorePackage(selected._id, dispatch);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleAlert("Thành công", "Khôi phục gói thành công", "success");
      } else error = true;
    }
    if (error) {
      handleAlert("Thất bại", res.message, "danger");
      error = false;
    }
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };
  const handleClose = () => {
    setShowModal(false);
    setShowExModal(false);
    setShowModalForm(false);
    setShowAlert(false);
  };
  const handleAlert = (title, content, variant) => {
    setTitle(title);
    setContent(content);
    setClasses({
      alertVariant: variant,
      alertClass: "fixed-top mx-auto",
    });
  };
  const handleShowAlert = (title, content, variant) => {
    handleAlert(title, content, variant);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };
  const handleAddAction = () => {
    setAddAction(true);
    setInitValues({
      name: "",
      duration: 1,
      noOfMember: 2,
      editableDuration: false,
      editableNoOfMember: false,
      price: 1000,
      description: null,
      coefficient: 1000,
      submit: null,
    });
    setSelected(null);
    setShowModalForm(true);
  };
  const handleSubmitModalForm = async (values) => {
    let formData = {
      name: values.name,
      duration: values.duration,
      price: Number(values.price),
      noOfMember: values.noOfMember,
      editableDuration: values.editableDuration,
      editableNoOfMember: values.editableNoOfMember,
      description: values.description.join("\n"),
      coefficient: Number(values.coefficient),
    };
    let res;
    if (addAction) {
      formData.createdBy = currentUser?.data.userInfo?._id;
      res = await createPackage(formData, dispatch);
      if (res.statusCode === HttpStatusCode.Created) {
        handleClose();
        handleAlert("Thành công", "Tạo gói thành công", "success");
      } else {
        handleAlert("Thất bại", res.message, "danger");
      }
    } else {
      formData.updatedBy = currentUser?.data.userInfo?._id;
      res = await updatePackage(formData, dispatch, selected._id);
      if (res.statusCode === HttpStatusCode.Ok) {
        handleClose();
        handleAlert("Thành công", "Cập nhật gói thành công", "success");
      } else {
        handleAlert("Thất bại", res.message, "danger");
      }
    }
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 1000);
  };

  function onRowClick(data) {
    setSelected(data);
    setAddAction(false);
    setInitValues({
      name: data.name,
      duration: data.duration,
      noOfMember: data.noOfMember,
      editableDuration: data.editableDuration,
      editableNoOfMember: data.editableNoOfMember,
      price: data.price,
      description: data.description,
      coefficient: data.coefficient,
      submit: null,
    });
    setShowModalForm(true);
  }

  const schema = Yup.object().shape({
    name: Yup.string().max(255).required("Bắt buộc"),
    duration: Yup.number()
      .min(1, "Thời hạn ít nhất là 1 tháng")
      .max(36, "Thời hạn không nhiều hơn 36 tháng")
      .required("Bắt buộc"),
    noOfMember: Yup.number()
      .min(2, "Ít nhất phải có 2 thành viên")
      .max(30, "Thành viên tối đa không được vượt 30 người")
      .required("Bắt buộc"),
    price: Yup.number()
      .typeError("Đơn giá phải là một con số")
      .min(1000, "Đơn giá ít nhất là 1000đ")
      .required("Bặt buộc"),
    coefficient: Yup.number()
      .typeError("Đơn giá phải là một con số")
      .min(1000, "Đơn giá ít nhất là 1000đ"),
  });

  // icons
  const icons = {
    faSuitcase,
    faStopwatch,
    faUsers,
    faCoins,
    faWaveSquare,
  };

  const addForm = [
    {
      title: "Tên Gói",
      icon: icons.faSuitcase,
      name: "name",
      type: "text",
      placeholder: "Nhập tên gói",
      classes: { formGroup: "mb-4", formControl: "input-out-button-group" },
      required: true,
      disabled: selected && selected.deleted,
      _Type: "simple",
    },
    {
      title: "Thời hạn (tháng)",
      icon: icons.faStopwatch,
      name: "duration",
      nameCheckbox: "editableDuration",
      labelCheckbox: "Tùy chỉnh",
      type: "number",
      placeholder: "Nhập thời hạn",
      classes: { formGroup: "mb-4", formControl: "input-button-group" },
      required: true,
      disabled: selected && selected.deleted,
      _Type: "checkbox",
    },
    {
      title: "Thành viên",
      icon: icons.faUsers,
      name: "noOfMember",
      nameCheckbox: "editableNoOfMember",
      labelCheckbox: "Tùy chỉnh",
      type: "number",
      placeholder: "Nhập số thành viên tối đa",
      required: true,
      disabled: selected && selected.deleted,
      classes: { formGroup: "mb-4", formControl: "input-button-group" },
      _Type: "checkbox",
    },
    {
      title: "Đơn giá",
      icon: icons.faCoins,
      name: "price",
      placeholder: "Nhập đơn giá",
      required: true,
      disabled: selected && selected.deleted,
      classes: { formGroup: "mb-4", formControl: "input-out-button-group" },
      _Type: "currency",
    },
    {
      title: "Hệ số",
      icon: icons.faWaveSquare,
      name: "coefficient",
      placeholder: "Nhập hệ số giá",
      required: true,
      disabled: selected && selected.deleted,
      classes: { formGroup: "mb-4", formControl: "input-out-button-group" },
      _Type: "currency",
    },
    {
      title: "Mô tả",
      name: "description",
      classes: { formGroup: "mb-0" },
      disabled: selected && selected.deleted,
      _Type: "text-area",
    },
  ];

  // ==============================|| EXTENSION ||============================== //
  const extension = [
    { icon: faHandScissors, label: "Phân chi hóa đơn", checked: true },
    { icon: faCalendarDays, label: "Lịch biểu", checked: true },
    { icon: faListUl, label: "Việc cần làm", checked: true },
    { icon: faPiggyBank, label: "Tính lãi xuất", checked: true },
  ];
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
        header: "Mã",
        accessorKey: "_id",
        enableColumnFilter: false,
        hide: true,
      },
      {
        header: "Gói dịch vụ",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Thời hạn",
        accessorFn: (row) => `${row.duration} tháng`,
        enableColumnFilter: false,
        classes: "text-end",
      },
      {
        header: "Thành viên",
        accessorKey: "noOfMember",
        classes: "text-center",
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => `${row.price_vnd}`,
        header: "Đơn giá",
        classes: "text-end",
        enableColumnFilter: false,
      },
      {
        accessorKey: "deleted",
        header: null,
        cell: ({ row }) => <span>{row.original.deleted}</span>,
      },
      {
        header: "Ngày lập",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        hide: true,
        cell: ({ row }) => (
          <span>
            <FontAwesomeIcon icon={faClock} /> {row.original.createdAt}
          </span>
        ),
      },
      {
        header: "Cập nhật",
        accessorKey: "updatedAt",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <span>
            <FontAwesomeIcon icon={faClock} /> {row.original.updatedAt}
          </span>
        ),
      },
      {
        header: null,
        accessorKey: "actions",
        enableColumnFilter: false,
        classes: "text-center",
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => {
          return (
            <Dropdown>
              <Dropdown.Toggle
                className="text-dark me-lg-1 dropdown-table-option"
                id="dropdown-autoclose-true"
              >
                <span className="icon icon-sm m-0">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="notifications-dropdown shadow rounded-3 mt-2 py-0 ">
                <ListGroup className="list-group-flush">
                  <Dropdown.Item
                    className="text-start text-dark py-3"
                    onClick={(e) => onRowClick(row.original)}
                  >
                    <FontAwesomeIcon icon={faPen} /> Chỉnh sửa
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-start text-dark py-3"
                    onClick={(e) =>
                      handleAction(row.original, {
                        ...(row.original.deleted ? "restore" : " remove"),
                      })
                    }
                  >
                    {row.original.deleted ? (
                      <>
                        <FontAwesomeIcon icon={faTrashArrowUp} /> Khôi phục gói
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faTrash} /> Xóa gói
                      </>
                    )}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-start text-dark py-3"
                    onClick={(e) => setShowExModal(true)}
                  >
                    <FontAwesomeIcon icon={faShapes} /> Tiện ich
                  </Dropdown.Item>
                </ListGroup>
              </Dropdown.Menu>
            </Dropdown>
          );
        },
      },
    ],
    [handleAction]
  );
  return (
    <Container>
      <Modals
        title="Xác nhận"
        show={showModal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      >
        {selected && <h6>{content}</h6>}
      </Modals>
      <Modals
        title="Tiện ích"
        show={showExModal}
        handleClose={handleClose}
        handleConfirm={handleClose}
      >
        <ListGroup className="m-0 p-0">
          {extension.map((item) => (
            <ListGroup.Item
              key={item.id}
              className="d-flex justify-content-between align-items-center border-start-0 border-end-0"
            >
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={item.icon} className="me-2" />
                {item.label}
              </span>
              <Form.Check
                type="switch"
                id={`switch-${item.id}`}
                defaultChecked
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modals>
      <Alerts
        show={showAlert}
        handleClose={handleClose}
        title={title}
        classes={classes}
      >
        {content}
      </Alerts>
      <ModalForm
        title="Gói dịch vụ"
        show={showModalForm}
        handleClose={handleClose}
        schema={schema}
        initValues={initValues}
        forms={addForm}
        handleSubmit={handleSubmitModalForm}
        handleAlert={handleShowAlert}
      ></ModalForm>
      <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-table-cell">
          <DataTable
            data={packages}
            columns={columns}
            classes={{ table: "mx-auto align-middle" }}
            title="Gói dịch vụ"
            // emptyItem={{ label: "Giỏ hàng trống", icon: faShoppingBasket }}
            // handleBulkRemove={onBulkRemove}
            handleAdd={handleAddAction}
            onRowClick={onRowClick}
            titleAdd="Thêm gói"
          />
        </Col>
      </Row>
    </Container>
  );
};
export default PackageTable;
// Then, use it in a component.
